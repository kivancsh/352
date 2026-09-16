// Ortak kariyer: lig kurma/katılma, dünya durumunun paylaşılması, işlem sırası ve canlı maçlar.
//
// Ligdeki çevrimiçi oyunculardan biri "işleyici" olur: diğerlerinin gönderdiği işlemleri
// (taktik, teklif, sözleşme...) uygular, herkes hazır olduğunda günleri ilerletir ve yeni dünya
// durumunu yayınlar. İnsan takımlarının maçları işleyicide dakika dakika oynatılır ve herkes aynı
// anda izler. İşleyici uygulamayı kapatırsa kira süresi dolar ve çevrimiçi başka bir oyuncu
// (canlı maç dahil) kaldığı yerden devralır.
import { FIREBASE_CONFIG } from './config.js';
import { newMultiplayerGame, advanceMultiplayer, migrateState, rebuildFromOld, addHuman, applyHumanMatch } from '../engine/game.js';
import { Match } from '../engine/match.js';
import { seedRng, getRngState } from '../engine/util.js';
import { FORMATIONS, MENTALITIES } from '../engine/tactics.js';
import { makeBid, proposeContract, cancelNegotiation, respondIncoming, respondCounter } from '../engine/transfers.js';
import { answerPress, talkToPlayer, toggleShortlist } from '../engine/career.js';

export class UserError extends Error {}

export const MAX_MEMBERS = 8;
const LEASE_MS = 20000;
const LIVE_TICK_MS = 1500;
const CODE_ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const FIREBASE_TIMEOUT = 5000; // 5 saniye timeout

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

// --- DÜZELTME 1: Timeout Indicator ---
function showLoadingIndicator(message = '⏳ İşlem yapılıyor... (5 saniye)') {
  let loader = document.getElementById('firebaseLoadingSpinner');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'firebaseLoadingSpinner';
    loader.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.85);color:white;padding:25px 35px;border-radius:12px;z-index:9999;font-size:16px;font-family:Arial,sans-serif;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.3);';
    document.body.appendChild(loader);
  }
  loader.textContent = message;
  loader.style.display = 'block';
  return loader;
}

function hideLoadingIndicator() {
  const loader = document.getElementById('firebaseLoadingSpinner');
  if (loader) loader.style.display = 'none';
}

// --- Lobi ---
export async function createLeague(net, { name, teamId }) {
  showLoadingIndicator('🏆 Lig oluşturuluyor...');
  
  for (let i = 0; i < 6; i++) {
    const code = randomCode();
    try {
      await Promise.race([
        net.createLeague(code, {
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
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), FIREBASE_TIMEOUT))
      ]);
      hideLoadingIndicator();
      return code;
    } catch (e) {
      if (e.code !== 'exists' && e.message !== 'Timeout') {
        hideLoadingIndicator();
        throw new UserError(
          '⚠️ Lig oluşturulamadı!\n\n' +
          'Hata: ' + (e.message || 'Bilinmeyen hata') + '\n\n' +
          '✓ İnternet bağlantınızı kontrol edin\n' +
          '✓ Sayfayı yenileyin ve tekrar deneyin'
        );
      }
    }
  }
  hideLoadingIndicator();
  throw new UserError('Lig kodu oluşturulamadı. Lütfen tekrar deneyin.');
}

export async function joinLeague(net, code, { name, teamId }) {
  showLoadingIndicator('📡 Lige katılınıyor... (5 saniye)');
  
  try {
    return await Promise.race([
      net.transactLeague(code, (lg) => {
        if (!lg) throw new UserError('❌ Bu kodla bir lig bulunamadı.\n\nLütfen kodu kontrol edip tekrar deneyin.');
        const takenBy = Object.entries(lg.members).find(([u, m]) => u !== net.uid && m.teamId === teamId);
        if (lg.members[net.uid]) {
          const patch = { [`members.${net.uid}.name`]: name };
          if (lg.status === 'lobby' && teamId && !takenBy) patch[`members.${net.uid}.teamId`] = teamId;
          return patch;
        }
        if (Object.keys(lg.members).length >= MAX_MEMBERS) throw new UserError(`❌ Lig dolu (en fazla ${MAX_MEMBERS} kişi).\n\nBaşka bir lig deneyin.`);
        if (takenBy) throw new UserError(`❌ ${takenBy[1].name} bu takımı seçti.\n\nBaşka bir takım seçin.`);
        return {
          [`members.${net.uid}`]: { name, teamId, ready: false, joinedAt: Date.now() },
          memberUids: [...lg.memberUids, net.uid],
        };
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout')), FIREBASE_TIMEOUT))
    ]);
  } catch (e) {
    hideLoadingIndicator();
    if (e instanceof UserError) throw e;
    throw new UserError(
      '⚠️ Lige katılamadı!\n\n' +
      'Hata: ' + (e.message || 'Bağlantı hatası') + '\n\n' +
      '✓ İnternet bağlantınızı kontrol edin\n' +
      '✓ Lig kodunu kontrol edip tekrar deneyin'
    );
  } finally {
    hideLoadingIndicator();
  }
}

export async function setMemberTeam(net, code, teamId) {
  return net.transactLeague(code, (lg) => {
    if (!lg || lg.status !== 'lobby') throw new UserError('❌ Lig başladıktan sonra takım değiştirilemez.');
    const takenBy = Object.entries(lg.members).find(([u, m]) => u !== net.uid && m.teamId === teamId);
    if (takenBy) throw new UserError(`❌ ${takenBy[1].name} bu takımı seçti.`);
    return { [`members.${net.uid}.teamId`]: teamId };
  });
}

// --- DÜZELTME 4: Lig Üyeleri Bilgisi ---
export function getLeaguePlayerCount(league) {
  if (!league || !league.members) return { current: 0, max: MAX_MEMBERS, list: [] };
  const members = Object.values(league.members);
  return {
    current: members.length,
    max: MAX_MEMBERS,
    list: members.map(m => ({ name: m.name, teamId: m.teamId, ready: m.ready }))
  };
}

// Kurucu ligi başlatır: dünya oluşturulur ve ilk durum yayınlanır.
export async function startLeague(net, code) {
  const lg = await net.getLeague(code);
  if (!lg || lg.status !== 'lobby') return false;
  if (lg.createdBy !== net.uid) throw new UserError('❌ Ligi yalnızca kurucu başlatabilir.');
  
  showLoadingIndicator('🎮 Oyun dünyası oluşturuluyor...');
  
  try {
    const members = Object.values(lg.members).sort((a, b) => a.joinedAt - b.joinedAt);
    let seed = 7;
    for (const ch of code) seed = (Math.imul(seed, 31) + ch.charCodeAt(0)) >>> 0;
    const state = newMultiplayerGame(members.map((m) => ({ teamId: m.teamId, name: m.name })), code, seed);
    const parts = await net.putSnapshot(code, 1, await gzipB64(JSON.stringify(state)));
    const ok = await net.transactLeague(code, (cur) => {
      if (!cur || cur.status !== 'lobby') return null;
      return {
        status: 'active', rev: 1, snapParts: parts, date: state.date, season: state.season, stop: null, updatedAt: Date.now(),
      };
    });
    hideLoadingIndicator();
    return !!ok;
  } catch (e) {
    hideLoadingIndicator();
    throw new UserError('❌ Lig başlatılamadı: ' + (e.message || 'Bilinmeyen hata'));
  }
}

// --- Dünya işlemleri ---
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
        const r = makeBid(state, { pid: p.pid, type: p.type === 'loan' ? 'loan' : 'transfer', fee: Math.max(0, Number(p.fee) || 0), wageShare: Number(p.wageShare) || 0, loanYears: Number(p.loanYears) || 1, actor: tid });
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
      case 'press':
        return answerPress(state, tid, p.fid, Array.isArray(p.answers) ? p.answers.slice(0, 3).map(String) : []);
      case 'talk':
        return talkToPlayer(state, tid, p.pid, String(p.kind));
      case 'shortlist':
        return toggleShortlist(state, tid, p.pid);
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
    this.live = null;
    this.liveTimer = null;
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
    this.unLive = this.net.watchLive(this.code, (d) => {
      if (!this.stopped) this.hooks.onLive?.(d);
    });
    this.timer = setInterval(() => this.tick(), 5000);
    this.tick();
  }

  stop() {
    this.stopped = true;
    this.unLeague?.();
    this.unActions?.();
    this.unLive?.();
    clearInterval(this.timer);
    this.stopLiveLoop();
  }

  onLeague(lg) {
    if (this.stopped) return;
    this.league = lg;
    if (lg && this.wasProcessor && !this.isProcessor()) {
      this.wasProcessor = false;
      this.unActions?.();
      this.unActions = null;
      this.stopLiveLoop();
      this.live = null;
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
        showLoadingIndicator('📥 Oyun durumu indiriliyor...');
        const b64 = await Promise.race([
          this.net.getSnapshot(this.code, lg.rev, lg.snapParts),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Download timeout')), FIREBASE_TIMEOUT * 2))
        ]);
        hideLoadingIndicator();
        
        if (b64 == null) {
          await sleep(600);
          continue;
        }
        const raw = JSON.parse(await gunzipB64(b64));
        let s = migrateState(raw);
        if (!s) {
          // Avrupa kupaları ve alt ligler öncesindeki bir lig: aynı teknik direktörlerle yeni dünyada baştan başlar.
          s = rebuildFromOld(raw);
          this.upgraded = true;
        }
        if (this.league.rev < lg.rev) continue;
        this.state = s;
        this.rev = lg.rev;
        this.parts = lg.snapParts;
        s.userTeamId = this.myTeamId();
        this.hooks.onState?.(s);
      } catch (e) {
        hideLoadingIndicator();
        console.warn('durum indirilemedi', e);
        this.hooks.toast?.(
          '⚠️ Oyun durumu indirilenemedi!\n\n' +
          'İnternet bağlantınızı kontrol edin ve sayfayı yenileyin.'
        );
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
      const patch = await Promise.race([
        this.net.transactLeague(this.code, (lg) => {
          const p = lg?.processor;
          if (!lg || lg.status !== 'active' || (p && p.uid !== this.uid && p.until > Date.now())) return null;
          return { processor: { uid: this.uid, until: Date.now() + LEASE_MS } };
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Processor lease timeout')), FIREBASE_TIMEOUT))
      ]);
      
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
      if (this.state?.mpLive && !this.live) await this.resumeLive();
      this.schedulePump();
    } catch (e) {
      console.warn('işleyici kirası alınamadı', e);
      this.hooks.toast?.(
        '⚠️ Sunucuya bağlanılamadı!\n\n' +
        'İnternet bağlantınızı kontrol edin. Başka bir oyuncu çevrimiçi olduğunda sistem devralacaktır.'
      );
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
      let changed = !!this.upgraded;
      this.upgraded = false;

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
        if (a.type === 'liveSub' || a.type === 'liveMent') {
          const res = clean(this.applyLiveAction(a));
          this.net.updateAction(this.code, a.id, { status: 'done', result: res, doneAt: Date.now() }).catch(() => {});
          continue;
        }
        results.push([a, clean(applyAction(s, this.league, a))]);
        changed = true;
      }

      let stop = null;
      const members = Object.values(this.league.members);
      if (!s.mpLive && members.length && members.every((m) => m.ready)) {
        stop = advanceMultiplayer(s);
        if (stop.reason === 'live') this.prepareLive(stop);
        changed = true;
      }
      if (changed) await this.publish(results, stop);
    } catch (e) {
      console.error(e);
      this.hooks.toast?.(
        `⚠️ Senkronizasyon hatası!\n\n` +
        `Hata: ${e.message}\n\n` +
        'Lütfen sayfayı yenileyin.'
      );
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
      // Canlı maç sırasında hazır bayrakları korunur: maçlar bitince gün kendiliğinden ilerler.
      if (stop.reason !== 'live') {
        for (const u of Object.keys(this.league.members)) {
          patch[`members.${u}.ready`] = false;
          patch[`members.${u}.skipLive`] = null;
        }
      }
    }
    const ok = await this.net.transactLeague(this.code, (lg) => (lg && lg.processor?.uid === this.uid && (lg.rev || 0) === rev - 1 ? patch : null));
    if (!ok) {
      this.net.deleteSnapshot(this.code, rev, parts).catch(() => {});
      for (const [a] of results) this.applied.delete(a.id);
      this.stopLiveLoop();
      this.live = null;
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

    if (this.live && s.mpLive?.id === this.live.id && !this.liveTimer) {
      await this.writeLive(false);
      this.startLiveLoop();
    }
  }

  // --- Canlı maçlar (yalnızca işleyicide çalışır) ---
  prepareLive(stop) {
    const s = this.state;
    seedRng(s.rng);
    const matches = stop.fixtures
      .map((fid) => s.fixtures.find((f) => f.id === fid))
      .filter((f) => f && !f.played)
      .map((fx) => new Match(s, fx, { autoUser: true }));
    s.rng = getRngState();
    const id = `L${s.season}_${s.date}_${Date.now().toString(36)}`;
    s.mpLive = { id, date: s.date, fixtures: matches.map((m) => m.fx.id) };
    this.live = { id, matches, doneTicks: 0 };
  }

  async resumeLive() {
    const s = this.state;
    const d = await this.net.getLive(this.code).catch(() => null);
    if (d && d.id === s.mpLive.id) {
      const matches = (d.matches || []).map((snap) => Match.restore(s, snap)).filter(Boolean);
      this.live = { id: d.id, matches, doneTicks: d.finished ? 3 : 0 };
    } else {
      // Canlı veri kaybolduysa maçları baştan oynat.
      seedRng(s.rng);
      const matches = s.mpLive.fixtures
        .map((fid) => s.fixtures.find((f) => f.id === fid))
        .filter((f) => f && !f.played)
        .map((fx) => new Match(s, fx, { autoUser: true }));
      s.rng = getRngState();
      this.live = { id: s.mpLive.id, matches, doneTicks: 0 };
    }
    this.startLiveLoop();
  }

  startLiveLoop() {
    this.stopLiveLoop();
    this.liveTimer = setInterval(() => this.liveTick(), LIVE_TICK_MS);
  }

  stopLiveLoop() {
    clearInterval(this.liveTimer);
    this.liveTimer = null;
  }

  async liveTick() {
    if (!this.live || !this.isProcessor()) {
      this.stopLiveLoop();
      return;
    }
    if (this.liveBusy) return;
    this.liveBusy = true;
    try {
      const live = this.live;
      const members = Object.values(this.league.members);
      const skip = members.length > 0 && members.every((m) => m.skipLive === live.id);
      let active = false;
      for (const m of live.matches) {
        if (m.finished) continue;
        if (skip) m.playToEnd();
        else m.step();
        active = true;
      }
      if (!active) live.doneTicks++;
      const done = !active && (live.doneTicks >= 3 || skip);
      await this.writeLive(done);
      if (done) await this.finishLive();
    } catch (e) {
      console.warn('canlı maç hatası', e);
    } finally {
      this.liveBusy = false;
    }
  }

  async writeLive(finished) {
    const live = this.live;
    if (!live) return;
    await this.net.putLive(this.code, clean({
      id: live.id,
      date: this.state.date,
      finished: !!finished,
      updatedAt: Date.now(),
      matches: live.matches.map((m) => m.snapshot()),
    }));
  }

  async finishLive() {
    const s = this.state;
    const live = this.live;
    this.stopLiveLoop();
    for (const m of live.matches) {
      if (!m.finished) m.playToEnd();
      if (m.fx.played) continue;
      applyHumanMatch(s, m.fx, m.apply());
    }
    s.rng = getRngState();
    s.mpLive = null;
    this.live = null;
    const stop = advanceMultiplayer(s);
    if (stop.reason === 'live') this.prepareLive(stop);
    await this.publish([], stop);
  }

  applyLiveAction(a) {
    const live = this.live;
    const member = this.league.members?.[a.uid];
    if (!live || !member) return { ok: false, text: 'Şu an canlı maç yok.' };
    const p = a.payload || {};
    const m = live.matches.find((x) => x.fx.id === p.fid);
    if (!m || m.finished) return { ok: false, text: 'Maç bitti.' };
    const side = m.sides.findIndex((sd) => sd.teamId === member.teamId);
    if (side < 0) return { ok: false, text: 'Bu maçta takımın yok.' };
    m.fresh = [];
    if (a.type === 'liveSub') {
      const ok = m.substitute(side, p.out, p.in);
      if (ok) m.sides[side].manual = true;
      return ok ? { ok: true } : { ok: false, text: 'Değişiklik yapılamadı.' };
    }
    if (MENTALITIES[p.mentality]) {
      m.setMentality(side, p.mentality);
      m.sides[side].manual = true;
      return { ok: true };
    }
    return { ok: false, text: 'Geçersiz oyun anlayışı.' };
  }

  async setReady(ready) {
    await this.net.updateLeague(this.code, { [`members.${this.uid}.ready`]: ready });
    this.tick();
  }

  async voteSkipLive(liveId) {
    await this.net.updateLeague(this.code, { [`members.${this.uid}.skipLive`]: liveId });
  }

  // İşlemi sıraya koyar; wait ise işleyicinin sonucunu bekler.
  async submit(type, payload, wait = true) {
  const action = clean({ uid: this.uid, teamId: this.myTeamId(), type, payload, status: 'pending', ts: Date.now() });
  
  async submit(type, payload, wait = true) {
  const action = clean({ uid: this.uid, teamId: this.myTeamId(), type, payload, status: 'pending', ts: Date.now() });
  
  // OPTIMISTIC UPDATE
  const optimisticResult = clean(applyAction(this.state, this.league, action));
  
  if (optimisticResult.ok) {
    this.hooks.onState?.(this.state);
    this.hooks.toast?.('✅ İşlem uygulandı');
  }
  
  // ASYNC SYNC
  this.net.addAction(this.code, action)
    .then(id => {
      this.tick();
      return new Promise((resolve) => {
        let un = this.net.watchAction(this.code, id, (a) => {
          if (a && a.status === 'done') {
            un?.();
            resolve(a.result);
          }
        });
      });
    })
    .catch(error => {
      this.rev = -1;
      this.pull().then(() => {
        this.hooks.toast?.('⚠️ İşlem başarısız, durumu yeniledi');
      });
    });
  
  if (!wait) return { ok: true };
  return { ok: optimisticResult.ok, queued: true };
}
