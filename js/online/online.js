// Ortak kariyer: lig kurma/katılma, dünya durumunun paylaşılması ve işlem sırası.
//
// Ligdeki çevrimiçi oyunculardan biri "işleyici" olur: diğerlerinin gönderdiği işlemleri
// (taktik, teklif, sözleşme...) uygular, herkes hazır olduğunda günleri ilerletir ve yeni dünya
// durumunu yayınlar. İşleyici uygulamayı kapatırsa kira süresi dolar ve çevrimiçi başka bir oyuncu
// otomatik olarak devralır; böylece lig kurucusunun sürekli açık olması gerekmez.
import { FIREBASE_CONFIG } from './config.js';
import { newMultiplayerGame, advanceMultiplayer, migrateState, addHuman } from '../engine/game.js';
import { seedRng, getRngState } from '../engine/util.js';
import { FORMATIONS, MENTALITIES } from '../engine/tactics.js';
import { makeBid, proposeContract, cancelNegotiation, respondIncoming, respondCounter } from '../engine/transfers.js';

export class UserError extends Error {}

export const MAX_MEMBERS = 8;
const LEASE_MS = 20000;
const CODE_ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// --- Sunucu seçimi ---
function useLocalNet() {
  try {
    if (new URLSearchParams(location.search).has('yerel')) sessionStorage.setItem('slm-localnet', '1');
    return sessionStorage.getItem('slm-localnet') === '1';
  } catch {
    return false;
  }
}

export const onlineAvailable = () => useLocalNet() || !!FIREBASE_CONFIG;

let netPromise = null;
export function getNet() {
  if (!netPromise) {
    netPromise = (async () => {
      if (useLocalNet()) return (await import('./net-local.js')).createLocalNet();
      if (!FIREBASE_CONFIG) throw new UserError('Çevrimiçi mod henüz ayarlanmadı.');
      return (await import('./net-firebase.js')).createFirebaseNet(FIREBASE_CONFIG);
    })();
    netPromise.catch(() => { netPromise = null; });
  }
  return netPromise;
}

export function leagueLink(code) {
  return `${location.origin}${location.pathname}?lig=${code}`;
}

function randomCode() {
  let s = '';
  for (const b of crypto.getRandomValues(new Uint8Array(6))) s += CODE_ABC[b % CODE_ABC.length];
  return s;
}

const clean = (v) => JSON.parse(JSON.stringify(v ?? null));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function applyPatch(obj, patch) {
  const out = structuredClone(obj);
  for (const [k, v] of Object.entries(patch)) {
    const path = k.split('.');
    let cur = out;
    for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]] ??= {};
    cur[path[path.length - 1]] = v;
  }
  return out;
}

// --- Sıkıştırma (dünya durumu ~500 KB JSON → ~100 KB) ---
function bytesToB64(u8) {
  let s = '';
  for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
  return btoa(s);
}
function b64ToBytes(b64) {
  const s = atob(b64);
  const u8 = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i);
  return u8;
}
export async function gzipB64(text) {
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'));
  return bytesToB64(new Uint8Array(await new Response(stream).arrayBuffer()));
}
export async function gunzipB64(b64) {
  const stream = new Blob([b64ToBytes(b64)]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).text();
}

// --- Lobi ---
export async function createLeague(net, { name, teamId }) {
  for (let i = 0; i < 6; i++) {
    const code = randomCode();
    try {
      await net.createLeague(code, {
        code,
        createdBy: net.uid,
        createdAt: Date.now(),
        status: 'lobby',
        members: { [net.uid]: { name, teamId, ready: false, joinedAt: Date.now() } },
        memberUids: [net.uid],
        rev: 0,
        snapParts: 0,
        stop: null,
        processor: null,
        updatedAt: Date.now(),
      });
      return code;
    } catch (e) {
      if (e.code !== 'exists') throw e;
    }
  }
  throw new UserError('Lig kodu oluşturulamadı, tekrar dene.');
}

export async function joinLeague(net, code, { name, teamId }) {
  return net.transactLeague(code, (lg) => {
    if (!lg) throw new UserError('Bu kodla bir lig bulunamadı.');
    const takenBy = Object.entries(lg.members).find(([u, m]) => u !== net.uid && m.teamId === teamId);
    if (lg.members[net.uid]) {
      const patch = { [`members.${net.uid}.name`]: name };
      if (lg.status === 'lobby' && teamId && !takenBy) patch[`members.${net.uid}.teamId`] = teamId;
      return patch;
    }
    if (Object.keys(lg.members).length >= MAX_MEMBERS) throw new UserError(`Lig dolu (en fazla ${MAX_MEMBERS} kişi).`);
    if (takenBy) throw new UserError(`${takenBy[1].name} bu takımı seçti. Başka bir takım seç.`);
    return {
      [`members.${net.uid}`]: { name, teamId, ready: false, joinedAt: Date.now() },
      memberUids: [...lg.memberUids, net.uid],
    };
  });
}

export async function setMemberTeam(net, code, teamId) {
  return net.transactLeague(code, (lg) => {
    if (!lg || lg.status !== 'lobby') throw new UserError('Lig başladıktan sonra takım değiştirilemez.');
    const takenBy = Object.entries(lg.members).find(([u, m]) => u !== net.uid && m.teamId === teamId);
    if (takenBy) throw new UserError(`${takenBy[1].name} bu takımı seçti.`);
    return { [`members.${net.uid}.teamId`]: teamId };
  });
}

// Kurucu ligi başlatır: dünya oluşturulur ve ilk durum yayınlanır.
export async function startLeague(net, code) {
  const lg = await net.getLeague(code);
  if (!lg || lg.status !== 'lobby') return false;
  if (lg.createdBy !== net.uid) throw new UserError('Ligi yalnızca kurucu başlatabilir.');
  const members = Object.values(lg.members).sort((a, b) => a.joinedAt - b.joinedAt);
  const state = newMultiplayerGame(members.map((m) => ({ teamId: m.teamId, name: m.name })), code);
  const parts = await net.putSnapshot(code, 1, await gzipB64(JSON.stringify(state)));
  const ok = await net.transactLeague(code, (cur) => {
    if (!cur || cur.status !== 'lobby') return null;
    return {
      status: 'active', rev: 1, snapParts: parts, date: state.date, season: state.season, stop: null, updatedAt: Date.now(),
    };
  });
  return !!ok;
}

// --- İşlemler ---
export function applyAction(state, league, a) {
  const member = league.members?.[a.uid];
  if (!member || member.teamId !== a.teamId || !state.teams[a.teamId]) return { ok: false, text: 'Bu işlem için yetkin yok.' };
  const tid = a.teamId;
  const p = a.payload || {};
  const prevUser = state.userTeamId;
  state.userTeamId = tid;
  seedRng(state.rng);
  try {
    switch (a.type) {
      case 'tactics': {
        const t = state.teams[tid];
        if (FORMATIONS[p.formation]) t.formation = p.formation;
        if (MENTALITIES[p.mentality]) t.mentality = p.mentality;
        const ids = new Set(t.squad);
        if (Array.isArray(p.lineup) && p.lineup.length === FORMATIONS[t.formation].length) {
          t.lineup = p.lineup.map((x) => (ids.has(x) ? x : null));
        }
        if (Array.isArray(p.bench)) t.bench = [...new Set(p.bench)].filter((x) => ids.has(x) && !(t.lineup || []).includes(x)).slice(0, 9);
        return { ok: true };
      }
      case 'bid': {
        const r = makeBid(state, { pid: p.pid, type: p.type === 'loan' ? 'loan' : 'transfer', fee: Math.max(0, Number(p.fee) || 0), wageShare: Number(p.wageShare) || 0, actor: tid });
        return { ok: r.ok, error: r.error || null, freeAgent: !!r.freeAgent };
      }
      case 'contract':
        return proposeContract(state, { pid: p.pid, wage: Number(p.wage) || 0, years: Math.min(5, Math.max(1, Number(p.years) || 1)), offerId: p.offerId || null, actor: tid });
      case 'cancelNeg': {
        const o = state.offers.find((x) => x.id === p.offerId);
        if (o && o.from === tid) cancelNegotiation(state, p.offerId);
        return { ok: true, text: 'Transfer görüşmeleri sonlandırıldı.' };
      }
      case 'incoming':
        return respondIncoming(state, p.offerId, ['accept', 'reject', 'counter'].includes(p.action) ? p.action : 'reject', Math.max(0, Number(p.fee) || 0), tid);
      case 'counterReply':
        return respondCounter(state, p.offerId, !!p.accept, tid);
      default:
        return { ok: false, text: 'Bilinmeyen işlem.' };
    }
  } finally {
    state.rng = getRngState();
    state.userTeamId = prevUser;
  }
}

// --- Oturum ---
export class OnlineSession {
  constructor(net, code, hooks) {
    this.net = net;
    this.code = code;
    this.hooks = hooks;
    this.league = undefined;
    this.state = null;
    this.rev = -1;
    this.parts = 0;
    this.pending = [];
    this.applied = new Set();
    this.wasProcessor = false;
  }

  get uid() { return this.net.uid; }
  myMember() { return this.league?.members?.[this.uid] || null; }
  myTeamId() { return this.myMember()?.teamId || null; }
  isProcessor() {
    const p = this.league?.processor;
    return !!p && p.uid === this.uid && p.until > Date.now();
  }

  async start() {
    this.stopped = false;
    await new Promise((resolve) => {
      let first = true;
      this.unLeague = this.net.watchLeague(this.code, (lg) => {
        this.onLeague(lg);
        if (first) {
          first = false;
          resolve();
        }
      });
    });
    this.timer = setInterval(() => this.tick(), 5000);
    this.tick();
  }

  stop() {
    this.stopped = true;
    this.unLeague?.();
    this.unActions?.();
    clearInterval(this.timer);
  }

  onLeague(lg) {
    if (this.stopped) return;
    this.league = lg;
    if (lg && this.wasProcessor && !this.isProcessor()) {
      this.wasProcessor = false;
      this.unActions?.();
      this.unActions = null;
    }
    if (lg?.status === 'active' && lg.rev !== this.rev && !this.isProcessor()) this.pull();
    this.hooks.onLeague?.(lg);
    if (lg?.status === 'active') {
      if (this.isProcessor()) this.schedulePump();
      else if (!lg.processor || lg.processor.until < Date.now()) this.tick();
    }
  }

  pull() {
    if (!this.pullPromise) this.pullPromise = this.doPull().finally(() => { this.pullPromise = null; });
    return this.pullPromise;
  }

  async doPull() {
    for (let guard = 0; guard < 6; guard++) {
      const lg = this.league;
      if (!lg || !lg.rev || lg.rev === this.rev) return;
      try {
        const b64 = await this.net.getSnapshot(this.code, lg.rev, lg.snapParts);
        if (b64 == null) {
          await sleep(600);
          continue;
        }
        const s = migrateState(JSON.parse(await gunzipB64(b64)));
        if (this.league.rev < lg.rev) continue;
        this.state = s;
        this.rev = lg.rev;
        this.parts = lg.snapParts;
        s.userTeamId = this.myTeamId();
        this.hooks.onState?.(s);
      } catch (e) {
        console.warn('durum indirilemedi', e);
        await sleep(1000);
      }
    }
  }

  // İşleyici kirasını al veya yenile.
  async tick() {
    if (this.stopped || this.ticking || !this.league || this.league.status !== 'active') return;
    const cur = this.league.processor;
    if (cur && cur.uid !== this.uid && cur.until > Date.now()) return;
    this.ticking = true;
    try {
      const patch = await this.net.transactLeague(this.code, (lg) => {
        const p = lg?.processor;
        if (!lg || lg.status !== 'active' || (p && p.uid !== this.uid && p.until > Date.now())) return null;
        return { processor: { uid: this.uid, until: Date.now() + LEASE_MS } };
      });
      if (!patch) return;
      this.league = { ...this.league, processor: patch.processor };
      if (!this.wasProcessor) {
        this.wasProcessor = true;
        this.league = await this.net.getLeague(this.code);
        if (this.league.rev !== this.rev) await this.pull();
        this.unActions?.();
        this.unActions = this.net.watchActions(this.code, (list) => {
          this.pending = list;
          this.schedulePump();
        });
      }
      this.schedulePump();
    } catch (e) {
      console.warn('işleyici kirası alınamadı', e);
    } finally {
      this.ticking = false;
    }
  }

  schedulePump() {
    if (this.pumpTimer) return;
    this.pumpTimer = setTimeout(() => {
      this.pumpTimer = null;
      this.pump();
    }, 60);
  }

  async pump() {
    if (this.pumping) {
      this.pumpAgain = true;
      return;
    }
    if (this.stopped || !this.isProcessor() || this.league?.status !== 'active') return;
    this.pumping = true;
    try {
      if (this.league.rev !== this.rev) await this.pull();
      if (!this.state || this.league.rev !== this.rev) return;
      const s = this.state;
      let changed = false;

      // Lig başladıktan sonra katılanlar ve isim değişiklikleri
      for (const m of Object.values(this.league.members)) {
        if (!m.teamId || !s.teams[m.teamId]) continue;
        if (!s.humans.includes(m.teamId)) {
          if (Object.values(this.league.members).filter((x) => x.teamId === m.teamId).length > 1) continue;
          seedRng(s.rng);
          addHuman(s, m.teamId, m.name);
          s.rng = getRngState();
          changed = true;
        } else if (s.managers[m.teamId] !== m.name) {
          s.managers[m.teamId] = m.name;
          s.teams[m.teamId].coach = m.name;
          changed = true;
        }
      }

      const results = [];
      const actions = this.pending.filter((a) => a.status === 'pending' && !this.applied.has(a.id)).sort((a, b) => (a.ts || 0) - (b.ts || 0));
      for (const a of actions) {
        this.applied.add(a.id);
        results.push([a, clean(applyAction(s, this.league, a))]);
        changed = true;
      }

      let stop = null;
      const members = Object.values(this.league.members);
      if (members.length && members.every((m) => m.ready)) {
        stop = advanceMultiplayer(s);
        changed = true;
      }
      if (changed) await this.publish(results, stop);
    } catch (e) {
      console.error(e);
      this.hooks.toast?.(`Senkronizasyon hatası: ${e.message}`);
    } finally {
      this.pumping = false;
      if (this.pumpAgain) {
        this.pumpAgain = false;
        this.schedulePump();
      }
    }
  }

  async publish(results, stop) {
    const s = this.state;
    const b64 = await gzipB64(JSON.stringify(s));
    const rev = (this.league.rev || 0) + 1;
    const parts = await this.net.putSnapshot(this.code, rev, b64);
    const patch = { rev, snapParts: parts, date: s.date, season: s.season, updatedAt: Date.now() };
    if (stop) {
      patch.stop = { reason: stop.reason, date: stop.date };
      for (const u of Object.keys(this.league.members)) patch[`members.${u}.ready`] = false;
    }
    const ok = await this.net.transactLeague(this.code, (lg) => (lg && lg.processor?.uid === this.uid && (lg.rev || 0) === rev - 1 ? patch : null));
    if (!ok) {
      this.net.deleteSnapshot(this.code, rev, parts).catch(() => {});
      for (const [a] of results) this.applied.delete(a.id);
      this.rev = -1;
      this.league = await this.net.getLeague(this.code);
      await this.pull();
      return;
    }
    const oldRev = this.rev;
    const oldParts = this.parts;
    this.rev = rev;
    this.parts = parts;
    this.league = applyPatch(this.league, patch);
    await Promise.all(results.map(([a, res]) => this.net.updateAction(this.code, a.id, { status: 'done', result: res, doneAt: Date.now() })));
    if (oldRev > 0 && oldParts) this.net.deleteSnapshot(this.code, oldRev, oldParts).catch(() => {});
    if (Math.random() < 0.15) this.net.pruneActions?.(this.code, Date.now() - 120000).catch(() => {});
    s.userTeamId = this.myTeamId();
    this.hooks.onState?.(s);
    this.hooks.onLeague?.(this.league);
  }

  async setReady(ready) {
    await this.net.updateLeague(this.code, { [`members.${this.uid}.ready`]: ready });
    this.tick();
  }

  // İşlemi sıraya koyar; wait ise işleyicinin sonucunu bekler.
  async submit(type, payload, wait = true) {
    const action = clean({ uid: this.uid, teamId: this.myTeamId(), type, payload, status: 'pending', ts: Date.now() });
    const id = await this.net.addAction(this.code, action);
    this.tick();
    if (!wait) return { ok: true };
    return new Promise((resolve) => {
      let done = false;
      let un = null;
      const finish = (r) => {
        if (done) return;
        done = true;
        un?.();
        clearTimeout(timeout);
        resolve(r);
      };
      const timeout = setTimeout(() => finish({ ok: false, queued: true, text: 'İşlemin sıraya alındı. Ligdeki bir oyuncu çevrimiçi olduğunda uygulanacak.' }), 25000);
      un = this.net.watchAction(this.code, id, (a) => {
        if (a && a.status === 'done') finish(a.result || { ok: true });
      });
      if (done) un();
    });
  }
}
