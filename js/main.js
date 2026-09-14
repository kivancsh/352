// Arayüz: ekranlar, modallar, canlı maç, kayıt ve ortak kariyer.
import { TEAMS } from './data/teams.js';
import {
  newGame, continueGame, standings, nextUserFixture, onUserMatchPlayed, startNewSeason, currentWindow, migrateState,
} from './engine/game.js';
import { Match, squadOf, prepareLineup } from './engine/match.js';
import { FORMATIONS, MENTALITIES, autoPick, teamRating } from './engine/tactics.js';
import {
  POS_TR, POS_LONG, POS_GROUP, POSITIONS, posFit, playerValue, avgRating, moraleLabel, isAvailable,
} from './engine/players.js';
import {
  makeBid, proposeContract, contractDemand, respondIncoming, respondCounter, cancelNegotiation, playerRole, ROLE_TR,
} from './engine/transfers.js';
import { isHuman } from './engine/inbox.js';
import { fmtDate, fmtMoney, daysBetween, seedRng, getRngState, roundMoney } from './engine/util.js';
import {
  OnlineSession, getNet, onlineAvailable, createLeague, joinLeague, setMemberTeam, startLeague, leagueLink, UserError, MAX_MEMBERS,
} from './online/online.js';

const SAVE_KEY = 'slm-save-v1';
const ONLINE_KEY = 'slm-online';
const $app = document.getElementById('app');
const $modal = document.getElementById('modal');
const $toast = document.getElementById('toast');

let state = null;
let live = null;
let pendingStart = { teamId: null, manager: '' };
const view = {
  tab: 'home',
  squadTab: 'list',
  squadFilter: 'ALL',
  leagueTab: 'table',
  statTab: 'goals',
  round: null,
  transferTab: 'search',
  tf: { pos: '', maxAge: '', minOvr: '', maxVal: '', team: '', q: '' },
};

// Ortak kariyer
let mode = 'sp';
let session = null;
const mp = { name: '', teamId: null, code: '', joinInfo: null, busy: false, connecting: false };
let pendingTactics = null;
let tacticsTimer = null;
let seenPlayed = null;
let readIds = new Set();

// ---------- Yardımcılar ----------
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const P = (id) => state.players[id];
const T = (id) => state.teams[id];
const me = () => state.teams[state.userTeamId];
const isMp = () => mode === 'mp';
const myBoard = () => state.boards?.[state.userTeamId] || { confidence: 65, label: '-', target: 10 };
const managerName = (teamId = state.userTeamId) => state.managers?.[teamId] || state.manager || 'Teknik Direktör';
const myInbox = () => state.inbox.filter((m) => !m.teamId || m.teamId === state.userTeamId);
const isRead = (m) => m.read || readIds.has(m.id);

const FLAG_SPECIAL = {
  EN: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}',
  SC: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}',
};
function flag(code) {
  if (!code) return '';
  if (FLAG_SPECIAL[code]) return FLAG_SPECIAL[code];
  return String.fromCodePoint(...[...code.toUpperCase()].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));
}
const COUNTRY = {
  TR: 'Türkiye', BR: 'Brezilya', PT: 'Portekiz', FR: 'Fransa', DE: 'Almanya', ES: 'İspanya', IT: 'İtalya', EN: 'İngiltere', SC: 'İskoçya',
  NL: 'Hollanda', BE: 'Belçika', NG: 'Nijerya', SN: 'Senegal', CI: 'Fildişi Sahili', CM: 'Kamerun', GH: 'Gana', ML: 'Mali', GN: 'Gine',
  MA: 'Fas', TN: 'Tunus', EG: 'Mısır', RS: 'Sırbistan', HR: 'Hırvatistan', BA: 'Bosna-Hersek', XK: 'Kosova', AL: 'Arnavutluk',
  MK: 'Kuzey Makedonya', ME: 'Karadağ', GR: 'Yunanistan', RO: 'Romanya', HU: 'Macaristan', PL: 'Polonya', CZ: 'Çekya', SK: 'Slovakya',
  UA: 'Ukrayna', RU: 'Rusya', GE: 'Gürcistan', AZ: 'Azerbaycan', UZ: 'Özbekistan', KR: 'Güney Kore', AT: 'Avusturya', CH: 'İsviçre',
  DK: 'Danimarka', SE: 'İsveç', NO: 'Norveç', IS: 'İzlanda', IE: 'İrlanda', CO: 'Kolombiya', AR: 'Arjantin', UY: 'Uruguay', CL: 'Şili',
  VE: 'Venezuela', PA: 'Panama', HN: 'Honduras', JM: 'Jamaika', CW: 'Curaçao', SR: 'Surinam', GW: 'Gine-Bissau', CV: 'Yeşil Burun',
  AO: 'Angola', CD: 'Kongo DC', CG: 'Kongo', GM: 'Gambiya', TD: 'Çad', BJ: 'Benin', LR: 'Liberya', TZ: 'Tanzanya', MG: 'Madagaskar',
  KM: 'Komorlar', AE: 'BAE', JO: 'Ürdün', SY: 'Suriye', IL: 'İsrail', SA: 'Suudi Arabistan', QA: 'Katar', US: 'ABD',
};

function badge(teamId, size = '') {
  const t = T(teamId);
  if (!t) return '';
  return `<span class="badge ${size}" style="background:${t.colors[0]};color:${t.colors[1]};border-color:${t.colors[1]}">${esc(t.short)}</span>`;
}
// Kulüp renkleriyle çizilmiş forma (resmî forma tasarımı ya da logo değildir).
let kitSeq = 0;
function kitSvg(kit, size = 56) {
  if (!kit) return '';
  const [c1, c2] = kit.colors;
  const id = `kit${kitSeq++}`;
  const shirt = 'M30 10 L42 5 Q50 13 58 5 L70 10 L93 25 L83 43 L73 37 L73 95 L27 95 L27 37 L17 43 L7 25 Z';
  let body = '';
  if (kit.pattern === 'stripes') for (let x = 8; x < 100; x += 16) body += `<rect x="${x}" y="0" width="8" height="100" fill="${c2}"/>`;
  else if (kit.pattern === 'halves') body = `<rect x="50" y="0" width="50" height="100" fill="${c2}"/>`;
  else if (kit.pattern === 'band') body = `<rect x="0" y="42" width="100" height="16" fill="${c2}"/>`;
  const stroke = kit.pattern === 'plain' ? c2 : 'rgba(0,0,0,.35)';
  return `<svg class="kit" width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true">`
    + `<defs><clipPath id="${id}"><path d="${shirt}"/></clipPath></defs>`
    + `<g clip-path="url(#${id})"><rect width="100" height="100" fill="${c1}"/>${body}</g>`
    + `<path d="${shirt}" fill="none" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`
    + `<path d="M42 5 Q50 13 58 5" fill="none" stroke="${c2}" stroke-width="4"/></svg>`;
}
const teamKit = (teamId, size) => kitSvg((state && T(teamId)?.kit) || TEAMS.find((t) => t.id === teamId)?.kit, size);
const teamNameStatic = (teamId) => TEAMS.find((t) => t.id === teamId)?.name || '';

const ovrCls = (o) => (o >= 80 ? 'r-elite' : o >= 74 ? 'r-good' : o >= 66 ? 'r-mid' : 'r-low');
const ovrPill = (o) => `<span class="ovr ${ovrCls(o)}">${o}</span>`;
const posPill = (pos) => `<span class="pos g-${POS_GROUP[pos]}">${POS_TR[pos]}</span>`;
function shortName(name) {
  const parts = name.split(' ');
  return parts.length > 1 ? parts[parts.length - 1] : name;
}
function condBar(c) {
  const cls = c < 60 ? 'bad' : c < 80 ? 'warn' : '';
  return `<div class="cond"><div class="bar ${cls}"><i style="width:${Math.round(c)}%"></i></div><small>%${Math.round(c)}</small></div>`;
}
function statusIcons(p) {
  let s = '';
  if (p.injury) s += `<span title="Sakat">🚑</span>`;
  if (p.susp > 0) s += `<span title="Cezalı">🟥</span>`;
  if (p.loan && p.teamId === state.userTeamId) s += `<span title="Kiralık">🔁</span>`;
  if (!p.loan && p.teamId && p.contractEnd <= state.season + 1) s += `<span title="Sözleşmesi bitiyor">📄</span>`;
  return s;
}
const seasonLabel = (s) => `${s}-${String(s + 1).slice(2)}`;

function toast(text, ms = 2600) {
  $toast.textContent = text;
  $toast.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { $toast.hidden = true; }, ms);
}

function openModal(html) {
  $modal.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;
  $modal.hidden = false;
}
function closeModal() {
  $modal.hidden = true;
  $modal.innerHTML = '';
}
const sheetHead = (title, extra = '') => `<div class="sheet-h">${extra}<h2>${title}</h2><button class="x" data-act="close" aria-label="Kapat">✕</button></div>`;

function save() {
  if (!state || isMp()) return;
  if (live) state.live = live.m.snapshot();
  else delete state.live;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    toast('Oyun kaydedilemedi (tarayıcı depolaması dolu olabilir).');
  }
}
// Kayıtlı oyunlarda değişmeyen bilgileri (stadyum, forma, forma numarası) güncel veriyle eşitler.
function syncStatic(s) {
  const nums = {};
  for (const t of TEAMS) {
    const team = s.teams[t.id];
    if (team) {
      team.stadium = t.stadium;
      team.capacity = t.capacity;
      team.kit = t.kit;
    }
    for (const line of t.players.trim().split('\n')) {
      const [num, name] = line.split('|');
      if (num && num !== '-') nums[`${t.id}|${name}`] = Number(num);
    }
  }
  for (const p of Object.values(s.players)) {
    const n = nums[`${p.teamId}|${p.name}`];
    if (!p.num && n) p.num = n;
  }
  return s;
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function onlineStore() {
  try {
    return JSON.parse(localStorage.getItem(ONLINE_KEY) || '{}');
  } catch {
    return {};
  }
}
function setOnlineStore(patch) {
  try {
    localStorage.setItem(ONLINE_KEY, JSON.stringify({ ...onlineStore(), ...patch }));
  } catch { /* yok say */ }
}

function loadRead(code) {
  try {
    readIds = new Set(JSON.parse(localStorage.getItem(`slm-read-${code}`) || '[]'));
  } catch {
    readIds = new Set();
  }
}
function markRead(m) {
  if (isMp()) {
    readIds.add(m.id);
    try {
      localStorage.setItem(`slm-read-${session.code}`, JSON.stringify([...readIds].slice(-800)));
    } catch { /* yok say */ }
  } else {
    m.read = true;
    save();
  }
}

// Motorun rastgele sayı üretecini kayıtlı durumla eşleyerek çalıştırır.
function withRng(fn) {
  seedRng(state.rng);
  const r = fn();
  state.rng = getRngState();
  save();
  return r;
}

// ---------- Uygulama olarak kurulum ----------
let deferredInstall = null;
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

function installBanner() {
  if (isStandalone()) return '';
  try {
    if (localStorage.getItem('slm-install-hidden') === '1') return '';
  } catch { /* yok say */ }
  let how;
  if (deferredInstall) how = '<button class="btn primary block" data-act="install">📲 Uygulamayı yükle</button>';
  else if (isIOS()) how = '<div class="small">Safari\'de alttaki <b>Paylaş</b> düğmesine (kareden çıkan ok), ardından <b>Ana Ekrana Ekle</b>\'ye dokun.</div>';
  else how = '<div class="small">Tarayıcı menüsünden (⋮) <b>Ana ekrana ekle</b> ya da <b>Uygulamayı yükle</b> seçeneğine dokun.</div>';
  return `<section class="card install">
    <div class="row-flex"><span style="font-size:26px">📲</span><div class="grow"><b>Uygulama olarak kur</b><div class="muted small">Ana ekrandaki simgeden tam ekran açılır ve her seferinde kaldığın yerden devam eder.</div></div><button class="x" data-act="hideInstall" aria-label="Gizle">✕</button></div>
    <div class="spacer"></div>${how}
    ${isIOS() ? '<div class="muted small" style="margin-top:8px">Önemli: iPhone\'da Safari\'deki kayıt ana ekran uygulamasına taşınmaz. Önce ana ekrana ekle, kariyerine oradan başla.</div>' : ''}
  </section>`;
}

// ---------- Ana render ----------
function render() {
  if (isMp()) return renderMp();
  if (!state) return renderStart();
  if (live) return renderMatch();
  if (state.gameOver) return renderGameOver();
  if (state.phase === 'seasonEnd' && state.seasonSummary) return renderSeasonEnd();
  return renderGame();
}

function renderMp() {
  if (mp.connecting) return renderConnecting();
  if (!session) return renderOnlineMenu();
  const lg = session.league;
  if (lg === undefined) return renderConnecting();
  if (!lg) return renderOnlineMenu();
  if (lg.status === 'lobby') return renderLobby();
  if (!state) return renderConnecting('Lig verisi indiriliyor…');
  if (state.phase === 'seasonEnd' && state.seasonSummary) return renderSeasonEnd();
  return renderGame();
}

function readyButton() {
  const lg = session.league;
  const members = Object.values(lg.members);
  const n = members.filter((m) => m.ready).length;
  const mine = lg.members[session.uid];
  return `<button class="btn-continue ${mine?.ready ? 'ready' : ''}" data-act="ready">${mine?.ready ? 'Hazır ✓' : 'Hazırım ▶'} <small>${n}/${members.length}</small></button>`;
}

function renderGame() {
  const t = me();
  const unread = myInbox().filter((m) => !isRead(m) || (m.needsAction && !m.resolved)).length;
  let body = '';
  if (view.tab === 'home') body = (isMp() ? onlineCard() : '') + installBanner() + homeHtml();
  else if (view.tab === 'squad') body = squadHtml();
  else if (view.tab === 'league') body = leagueHtml();
  else if (view.tab === 'transfer') body = transferHtml();
  else if (view.tab === 'inbox') body = inboxHtml();

  const navBtn = (id, ic, label, dot = 0) =>
    `<button class="${view.tab === id ? 'on' : ''}" data-act="tab" data-tab="${id}"><span class="ic">${ic}</span>${label}${dot ? `<span class="dot">${dot > 99 ? '99+' : dot}</span>` : ''}</button>`;

  $app.innerHTML = `
    <div class="shell">
      <header class="top">
        <button class="x" style="width:auto;height:auto;border:0;background:none;padding:0" data-act="club" aria-label="Kulüp">${badge(t.id)}</button>
        <div class="top-info">
          <div class="top-team">${esc(t.name)}</div>
          <div class="top-sub">${fmtDate(state.date, true)} · <b>${fmtMoney(t.finance.balance)}</b></div>
        </div>
        ${isMp() ? readyButton() : '<button class="btn-continue" data-act="continue">Devam ▶</button>'}
      </header>
      <main>${body}</main>
      <nav class="nav"><div class="nav-inner">
        ${navBtn('home', '🏠', 'Ana Sayfa')}
        ${navBtn('squad', '👕', 'Kadro')}
        ${navBtn('league', '🏆', 'Lig')}
        ${navBtn('transfer', '💱', 'Transfer')}
        ${navBtn('inbox', '✉️', 'Gelen', unread)}
      </div></nav>
    </div>`;
}

// ---------- Başlangıç ----------
function teamStrengthFromData(t) {
  const ovrs = t.players.trim().split('\n').map((l) => Number(l.split('|')[5])).sort((a, b) => b - a).slice(0, 16);
  return Math.round(ovrs.reduce((s, v) => s + v, 0) / ovrs.length);
}

function renderStart() {
  const saved = loadSave();
  const teams = TEAMS.slice().sort((a, b) => b.rep - a.rep);
  const stars = (rep) => '★'.repeat(Math.max(1, Math.round((rep - 40) / 10)));
  const savedTeam = saved?.teams?.[saved.userTeamId];
  $app.innerHTML = `
    <div class="shell" style="padding-bottom:0">
      <main>
        <div class="hero">
          <div class="ball">⚽</div>
          <h1>Süper Lig Menajer</h1>
          <p>2026-27 Trendyol Süper Lig · Gerçek takımlar ve kadrolar</p>
        </div>
        ${installBanner()}
        ${savedTeam ? `
          <section class="card">
            <div class="card-h">Kayıtlı kariyer</div>
            <div class="row-flex">
              ${kitSvg(savedTeam.kit || TEAMS.find((t) => t.id === savedTeam.id)?.kit, 48)}
              <div class="grow">
                <div style="font-weight:700">${esc(saved.managers?.[saved.userTeamId] || saved.manager)} · ${esc(savedTeam.name)}</div>
                <div class="muted small">${fmtDate(saved.date)} · ${seasonLabel(saved.season)} sezonu</div>
              </div>
            </div>
            <button class="btn primary block" data-act="resume">Kaldığın yerden devam et</button>
          </section>` : ''}
        <section class="card online">
          <div class="row-flex"><span style="font-size:26px">👥</span><div class="grow"><b>Arkadaşlarınla ortak kariyer</b><div class="muted small">Aynı ligde her biriniz bir takımı yönetir, birbirinize transfer teklifi yaparsınız.</div></div></div>
          <button class="btn block" data-act="mpOpen">Arkadaşlarla oyna</button>
        </section>
        <section class="card">
          <div class="card-h">${saved ? 'Yeni tek oyunculu kariyer' : 'Tek oyunculu kariyer'}</div>
          <label class="lbl" for="mgr">Teknik direktör adın</label>
          <input id="mgr" class="inp" maxlength="30" placeholder="Adınızı yazın" value="${esc(pendingStart.manager)}" data-input="manager">
          <div class="spacer"></div>
          <label class="lbl">Takımını seç</label>
          <div class="team-pick">
            ${teams.map((t) => `
              <button class="team-card ${pendingStart.teamId === t.id ? 'on' : ''}" data-act="pickTeam" data-id="${t.id}">
                ${kitSvg(t.kit, 44)}
                <div class="grow">
                  <div style="font-weight:700">${esc(t.name)}</div>
                  <div class="muted small">${esc(t.city)} · Bütçe ${fmtMoney(t.balance)}</div>
                </div>
                <div style="text-align:right">
                  ${ovrPill(teamStrengthFromData(t))}
                  <div class="stars">${stars(t.rep)}</div>
                </div>
              </button>`).join('')}
          </div>
        </section>
        <div class="start-bar">
          <button class="btn primary block" data-act="startGame" ${pendingStart.teamId ? '' : 'disabled'}>${pendingStart.teamId ? `${esc(teamNameStatic(pendingStart.teamId))} ile kariyere başla` : 'Önce bir takım seç'}</button>
        </div>
        <p class="footer-note">
          Kadrolar Eylül 2026 itibarıyla kamuya açık kaynaklardan derlenmiştir. Oyuncu güç değerleri bu oyuna özel tahminlerdir.<br>
          Resmî bir ürün değildir; kulüp ve lig markalarıyla bağlantısı yoktur. Açık kaynak: <a href="https://github.com/kivancsh/super-lig-menajer" target="_blank" rel="noopener">GitHub</a>
        </p>
      </main>
    </div>`;
}

// ---------- Ortak kariyer ekranları ----------
function renderConnecting(text = 'Lige bağlanılıyor…') {
  $app.innerHTML = `<div class="shell" style="padding-bottom:0"><main>
    <div class="hero"><div class="ball">👥</div><h1>Ortak Kariyer</h1><p><span class="spin"></span> ${esc(text)}</p></div>
    <button class="btn ghost block" data-act="mpBack">← Vazgeç</button>
  </main></div>`;
}

function teamPicker(action, selected, taken, kitSize = 36) {
  return `<div class="team-pick">${TEAMS.slice().sort((a, b) => b.rep - a.rep).map((t) => {
    const who = taken.get(t.id);
    return `<button class="team-card ${selected === t.id ? 'on' : ''}" data-act="${action}" data-id="${t.id}" ${who ? 'disabled' : ''}>
      ${kitSvg(t.kit, kitSize)}
      <div class="grow"><b>${esc(t.name)}</b><div class="muted small">${who ? `${esc(who)} seçti` : esc(t.city)}</div></div>
      ${ovrPill(teamStrengthFromData(t))}
    </button>`;
  }).join('')}</div>`;
}

function renderOnlineMenu() {
  const store = onlineStore();
  if (!mp.name) mp.name = store.name || '';
  const avail = onlineAvailable();
  const taken = new Map(Object.values(mp.joinInfo?.members || {}).map((m) => [m.teamId, m.name]));
  const leagues = store.leagues || [];
  $app.innerHTML = `<div class="shell" style="padding-bottom:0"><main>
    <div class="hero"><div class="ball">👥</div><h1>Ortak Kariyer</h1><p>Aynı ligde arkadaşlarınla teknik direktörlük</p></div>
    ${!avail ? '<section class="card"><div class="note bad small">Çevrimiçi mod henüz ayarlanmadı. Birazdan tekrar dene.</div></section>' : ''}
    ${leagues.length ? `<section class="card"><div class="card-h">Liglerim</div><div class="list">${leagues.map((l) => `
      <button class="item" data-act="mpResume" data-code="${esc(l.code)}">${kitSvg(TEAMS.find((t) => t.id === l.teamId)?.kit, 32)}
        <div class="grow"><b>${esc(l.code)}</b><div class="sub">${esc(teamNameStatic(l.teamId))}</div></div><span class="tag ok">Aç</span></button>`).join('')}</div></section>` : ''}
    <section class="card">
      <div class="card-h">Nasıl çalışır?</div>
      <div class="small muted">Biri lig kurar ve kodu paylaşır, diğerleri kodla katılır. Herkes kendi takımını yönetir; herkes "Hazırım" dediğinde oyun bir sonraki maç haftasına ilerler. Maçlar, her teknik direktörün ayarladığı kadro ve taktikle oynanır.</div>
    </section>
    <section class="card">
      <label class="lbl" for="mpName">Teknik direktör adın</label>
      <input id="mpName" class="inp" maxlength="24" placeholder="Adını yaz" value="${esc(mp.name)}" data-input="mpName">
      <div class="spacer"></div>
      <label class="lbl" for="mpCode">Katılacağın ligin kodu <span class="muted">(lig kuracaksan boş bırak)</span></label>
      <input id="mpCode" class="inp code" maxlength="6" placeholder="ABC123" value="${esc(mp.code)}" data-input="mpCode" autocomplete="off" autocapitalize="characters" spellcheck="false">
      ${mp.joinInfo ? `<div class="muted small" style="margin-top:6px">✅ Lig bulundu · ${Object.keys(mp.joinInfo.members).length}/${MAX_MEMBERS} oyuncu${mp.joinInfo.status === 'active' ? ' · lig başlamış, boş bir takımla katılabilirsin' : ''}</div>` : ''}
      <div class="spacer"></div>
      <label class="lbl">Takımını seç</label>
      ${teamPicker('mpPickTeam', mp.teamId, taken)}
    </section>
    <div class="start-bar">
      <div class="btns" style="margin-top:0">
        <button class="btn primary" data-act="mpJoin" ${!avail || mp.busy || mp.code.length !== 6 ? 'disabled' : ''}>${mp.busy ? '<span class="spin"></span>' : 'Lige katıl'}</button>
        <button class="btn" data-act="mpCreate" ${!avail || mp.busy ? 'disabled' : ''}>Yeni lig kur</button>
      </div>
      <button class="btn ghost block" data-act="mpBack">← Tek oyunculu oyuna dön</button>
    </div>
  </main></div>`;
}

function renderLobby() {
  const lg = session.league;
  const isCreator = lg.createdBy === session.uid;
  const members = Object.entries(lg.members).sort((a, b) => a[1].joinedAt - b[1].joinedAt);
  const mine = lg.members[session.uid];
  const taken = new Map(members.filter(([u]) => u !== session.uid).map(([, m]) => [m.teamId, m.name]));
  $app.innerHTML = `<div class="shell" style="padding-bottom:0"><main>
    <div class="hero"><div class="ball">🏟️</div><h1>Lig lobisi</h1><p>Arkadaşların katılınca ligi başlat</p></div>
    <section class="card online">
      <div class="card-h">Lig kodu</div>
      <div class="code-big">${esc(lg.code)}</div>
      <div class="muted small center">Arkadaşların bu kodla ya da davet linkiyle katılabilir.</div>
      <button class="btn primary block" data-act="mpShare">Davet linkini paylaş</button>
    </section>
    <section class="card">
      <div class="card-h">Oyuncular <span>${members.length}/${MAX_MEMBERS}</span></div>
      ${members.map(([u, m]) => `<div class="member">${teamKit(m.teamId, 34)}<div class="grow"><b>${esc(m.name)}</b>${u === session.uid ? ' <span class="tag">sen</span>' : ''}${u === lg.createdBy ? ' <span class="tag info">kurucu</span>' : ''}<div class="muted small">${esc(teamNameStatic(m.teamId))}</div></div></div>`).join('')}
    </section>
    ${mine ? `<section class="card"><div class="card-h">Takımını değiştir</div>${teamPicker('mpLobbyTeam', mine.teamId, taken, 32)}</section>` : ''}
    <div class="start-bar">
      ${isCreator
        ? `<button class="btn primary block" data-act="mpStart" ${mp.busy ? 'disabled' : ''}>${mp.busy ? '<span class="spin"></span>' : `Ligi başlat (${members.length} oyuncu)`}</button>`
        : '<div class="note small center">Kurucunun ligi başlatması bekleniyor…</div>'}
      <button class="btn ghost block" data-act="mpLeave">Lobiden çık</button>
    </div>
  </main></div>`;
}

function onlineCard() {
  const lg = session.league;
  const stop = lg.stop;
  const myTeam = state.userTeamId;
  const hasMatchThisRound = stop?.reason === 'matchday' && state.fixtures.some((f) => !f.played && f.date >= state.date && (f.home === myTeam || f.away === myTeam) && daysBetween(state.date, f.date) <= 3);
  let text = 'Herkes "Hazırım" dediğinde oyun bir sonraki durağa kadar ilerler.';
  if (stop?.reason === 'matchday') text = hasMatchThisRound ? '⚽ Maç haftası! Kadronu ve taktiğini ayarla, sonra Hazırım\'a bas.' : '⚽ Maç haftası. Hazır olduğunda Hazırım\'a bas.';
  else if (stop?.reason === 'week') text = '📅 Bir hafta geçti. Transferlerini ve kadronu gözden geçir, sonra Hazırım\'a bas.';
  else if (stop?.reason === 'newSeason') text = '🆕 Yeni sezon başladı, transfer dönemi açık.';
  const now = Date.now();
  const processing = lg.processor && lg.processor.until > now;
  const members = Object.entries(lg.members).sort((a, b) => a[1].joinedAt - b[1].joinedAt);
  return `<section class="card online">
    <div class="card-h">Ortak kariyer <span>Kod: <b>${esc(lg.code)}</b></span></div>
    <div class="small" style="margin-bottom:6px">${text}</div>
    ${members.map(([u, m]) => `<div class="member">${teamKit(m.teamId, 30)}<div class="grow"><b>${esc(m.name)}</b>${u === session.uid ? ' <span class="tag">sen</span>' : ''}<div class="muted small">${esc(T(m.teamId)?.name || teamNameStatic(m.teamId))}</div></div>${m.ready ? '<span class="tag ok">Hazır</span>' : '<span class="tag warn">Bekleniyor</span>'}</div>`).join('')}
    ${!processing ? '<div class="muted small" style="margin-top:6px"><span class="spin"></span> Lig işleyicisi aranıyor…</div>' : ''}
    <button class="btn ghost block" data-act="mpShare">Arkadaş davet et</button>
  </section>`;
}

// ---------- Ana sayfa ----------
function teamCol(id) {
  const t = T(id);
  return `<div class="vs-team">${teamKit(id, 64)}<div class="nm">${esc(t.name)}</div>${ovrPill(teamRating(squadOf(state, id)))}</div>`;
}

function homeHtml() {
  const t = me();
  const fx = nextUserFixture(state);
  const table = standings(state);
  const pos = table.findIndex((r) => r.id === t.id) + 1;
  const row = table[pos - 1];
  const win = currentWindow(state);
  const board = myBoard();
  const confCls = board.confidence < 30 ? 'bad' : board.confidence < 55 ? 'warn' : '';

  let next = '';
  if (fx) {
    const days = daysBetween(state.date, fx.date);
    const oppId = fx.home === t.id ? fx.away : fx.home;
    next = `
      <section class="card">
        <div class="card-h">Sıradaki maç <span>${fx.round}. hafta · ${fmtDate(fx.date, true)}</span></div>
        <div class="vs">
          ${teamCol(fx.home)}
          <div class="vs-mid">${days <= 0 ? 'BUGÜN' : days === 1 ? 'Yarın' : `${days} gün`}<small>${fx.home === t.id ? 'İç saha' : 'Deplasman'}</small></div>
          ${teamCol(fx.away)}
        </div>
        <div class="muted small center">${esc(T(fx.home).stadium)}${isMp() && isHuman(state, oppId) ? ` · Rakip teknik direktör: <b>${esc(managerName(oppId))}</b>` : ''}</div>
        ${isMp()
          ? '<button class="btn block" data-act="goTactics">Kadro ve taktiği ayarla</button>'
          : `<button class="btn primary block" data-act="continue">${days <= 0 ? 'Maç önü' : 'Maç gününe ilerle'}</button>`}
      </section>`;
  }

  const sq = squadOf(state, t.id);
  const out = sq.filter((p) => p.injury || p.susp > 0);
  const recent = state.fixtures.filter((f) => f.played && (f.home === t.id || f.away === t.id)).slice(-3).reverse();

  return `
    ${win ? `<section class="card" style="padding:10px 14px"><div class="row-flex"><span>💱</span><div class="grow small"><b>${win.label} açık</b> · ${Math.max(0, daysBetween(state.date, win.end))} gün kaldı</div><button class="btn" style="padding:6px 10px" data-act="tab" data-tab="transfer">Pazara git</button></div></section>` : ''}
    ${next}
    <section class="card">
      <div class="kpis">
        <div class="kpi"><b>${row.p ? `${pos}.` : '–'}</b><span>Lig sırası</span></div>
        <div class="kpi"><b>${row.pts}</b><span>Puan</span></div>
        <div class="kpi"><b>${row.gf}:${row.ga}</b><span>Gol</span></div>
      </div>
      <div class="spacer"></div>
      <div class="row-flex small"><span class="muted grow">Son maçlar</span>${(t.form || []).map((f) => `<span class="form-chip form-${f}">${f}</span>`).join('') || '<span class="muted">Henüz maç yok</span>'}</div>
    </section>
    <section class="card" data-act="club" style="cursor:pointer">
      <div class="card-h">Yönetim <span>Hedef: ${esc(board.label)}</span></div>
      <div class="row-flex"><div class="grow"><div class="bar ${confCls}"><i style="width:${Math.round(board.confidence)}%"></i></div></div><b class="small">%${Math.round(board.confidence)}</b></div>
      <div class="muted small" style="margin-top:6px">Yönetimin size güveni · Kulüp detayları için dokunun</div>
    </section>
    ${recent.length ? `<section class="card"><div class="card-h">Son sonuçlar</div>${recent.map(fxRow).join('')}</section>` : ''}
    ${out.length ? `<section class="card"><div class="card-h">Eksikler <span>${out.length} oyuncu</span></div><div class="list">${out.map((p) => `
      <button class="item" data-act="player" data-id="${p.id}">${posPill(p.pos)}<div class="grow"><div class="name ellipsis">${esc(p.name)}</div><div class="sub">${p.injury ? `🚑 ${esc(p.injury.name)} · ${p.injury.days} gün` : `🟥 ${p.susp} maç ceza`}</div></div>${ovrPill(p.ovr)}</button>`).join('')}</div></section>` : ''}
    <section class="card">
      <div class="card-h">Lig haberleri</div>
      ${state.news.slice(0, 8).map((n) => `<div class="news-item">${esc(n.text)}<small>${fmtDate(n.date)}</small></div>`).join('') || '<div class="muted small">Henüz haber yok.</div>'}
    </section>`;
}

// ---------- Kadro & taktik ----------
function squadHtml() {
  const tabs = `<div class="tabs">
    <button class="${view.squadTab === 'list' ? 'on' : ''}" data-act="squadTab" data-v="list">Oyuncular</button>
    <button class="${view.squadTab === 'tactics' ? 'on' : ''}" data-act="squadTab" data-v="tactics">Taktik & İlk 11</button>
    <button class="${view.squadTab === 'finance' ? 'on' : ''}" data-act="squadTab" data-v="finance">Maaşlar</button>
  </div>`;
  if (view.squadTab === 'tactics') return tabs + tacticsHtml();
  if (view.squadTab === 'finance') return tabs + wagesHtml();

  const t = me();
  const groups = { ALL: 'Tümü', GK: 'Kaleci', DEF: 'Defans', MID: 'Orta saha', ATT: 'Forvet' };
  const order = (p) => POSITIONS.indexOf(p.pos);
  const sq = squadOf(state, t.id)
    .filter((p) => view.squadFilter === 'ALL' || POS_GROUP[p.pos] === view.squadFilter)
    .sort((a, b) => order(a) - order(b) || b.ovr - a.ovr);
  const lineup = new Set(t.lineup || []);
  return `${tabs}
    <div class="tabs">${Object.entries(groups).map(([k, v]) => `<button class="${view.squadFilter === k ? 'on' : ''}" data-act="squadFilter" data-v="${k}">${v}</button>`).join('')}</div>
    <section class="card" style="padding:4px 12px">
      <div class="muted small" style="padding:8px 0">${squadOf(state, t.id).length} oyuncu · Takım gücü ${teamRating(squadOf(state, t.id))}</div>
      <div class="list">${sq.map((p) => `
        <button class="item" data-act="player" data-id="${p.id}">
          ${posPill(p.pos)}
          <div class="grow">
            <div class="name ellipsis">${p.num ? `<span class="muted">${p.num}</span> ` : ''}${esc(p.name)} ${lineup.has(p.id) ? '<span class="tag ok">11</span>' : ''}</div>
            <div class="sub">${flag(p.nat)} ${p.age} yaş · ${fmtMoney(playerValue(p, state.season))} <span class="icons">${statusIcons(p)}</span></div>
          </div>
          ${condBar(p.condition)}
          ${ovrPill(p.ovr)}
        </button>`).join('')}</div>
    </section>`;
}

function wagesHtml() {
  const t = me();
  const sq = squadOf(state, t.id).sort((a, b) => b.wage - a.wage);
  const total = sq.reduce((s, p) => s + p.wage * (p.loan ? (p.loan.wageShare ?? 100) / 100 : 1), 0);
  return `<section class="card">
    <div class="card-h">Yıllık maaş yükü <span>${fmtMoney(total)}</span></div>
    <div class="list">${sq.map((p) => `
      <button class="item" data-act="player" data-id="${p.id}">
        ${posPill(p.pos)}
        <div class="grow"><div class="name ellipsis">${esc(p.name)}</div>
          <div class="sub">${p.loan ? `Kiralık (%${p.loan.wageShare ?? 100} sizde) · ${esc(p.loan.fromName)}` : `Sözleşme: Haziran ${p.contractEnd}`}</div></div>
        <b class="small">${fmtMoney(p.wage)}</b>
      </button>`).join('')}</div>
  </section>`;
}

function sanitizeUserLineup() {
  const t = me();
  const slots = FORMATIONS[t.formation];
  const ids = new Set(t.squad);
  if (!t.lineup || t.lineup.length !== slots.length) {
    const r = autoPick(squadOf(state, t.id), t.formation);
    t.lineup = r.lineup;
    t.bench = r.bench;
  }
  t.lineup = t.lineup.map((id) => (id && ids.has(id) ? id : null));
  t.bench = (t.bench || []).filter((id) => ids.has(id) && !t.lineup.includes(id));
}

function tacticsHtml() {
  sanitizeUserLineup();
  const t = me();
  const slots = FORMATIONS[t.formation];
  const pitch = slots.map(([pos, x, y], i) => {
    const p = t.lineup[i] ? P(t.lineup[i]) : null;
    if (!p) return `<button class="slot empty" style="left:${x}%;top:${y}%" data-act="slot" data-i="${i}"><span class="disc">+</span><span class="nm">Boş</span><span class="ps">${POS_TR[pos]}</span></button>`;
    const fit = posFit(p.pos, pos);
    const cls = fit >= 0.95 ? 'fit-good' : fit >= 0.8 ? 'fit-ok' : 'fit-bad';
    const warn = !isAvailable(p) ? '⚠️' : '';
    return `<button class="slot ${cls}" style="left:${x}%;top:${y}%" data-act="slot" data-i="${i}"><span class="disc">${p.ovr}</span><span class="nm">${warn}${esc(shortName(p.name))}</span><span class="ps">${POS_TR[pos]}</span></button>`;
  }).join('');

  const benchIds = t.bench || [];
  const reserves = squadOf(state, t.id).filter((p) => !t.lineup.includes(p.id) && !benchIds.includes(p.id)).sort((a, b) => b.ovr - a.ovr);
  const unavailableInXI = t.lineup.filter((id) => id && !isAvailable(P(id))).length;

  return `
    <section class="card">
      <div class="controls">
        <div><label class="lbl">Diziliş</label>
          <select class="sel" data-change="formation">${Object.keys(FORMATIONS).map((f) => `<option ${f === t.formation ? 'selected' : ''}>${f}</option>`).join('')}</select></div>
        <div><label class="lbl">Oyun anlayışı</label>
          <div class="seg">${Object.entries(MENTALITIES).map(([k, m]) => `<button class="${t.mentality === k ? 'on' : ''}" data-act="mentality" data-v="${k}">${m.label}</button>`).join('')}</div></div>
      </div>
      ${unavailableInXI ? `<div class="note bad small">İlk 11'inizde ${unavailableInXI} sakat/cezalı oyuncu var. Maç önünde yerlerine otomatik seçim yapılır.</div><div class="spacer"></div>` : ''}
      <div class="pitch">${pitch}</div>
      <div class="muted small" style="margin-top:8px">Değiştirmek için bir oyuncuya dokunun. Çerçeve rengi mevki uyumunu gösterir: yeşil iyi, sarı idare eder, kırmızı zayıf.${isMp() ? ' Ortak kariyerde maçlar burada ayarladığın kadro ve taktikle oynanır.' : ''}</div>
      <button class="btn block" data-act="autoPick">Otomatik en iyi 11</button>
    </section>
    <section class="card">
      <div class="card-h">Yedekler <span>${benchIds.length}/9</span></div>
      <div class="list">${benchIds.map((id, i) => {
        const p = P(id);
        return `<button class="item" data-act="benchSlot" data-i="${i}">${posPill(p.pos)}<div class="grow"><div class="name ellipsis">${esc(p.name)} ${statusIcons(p)}</div></div>${condBar(p.condition)}${ovrPill(p.ovr)}</button>`;
      }).join('')}
      ${benchIds.length < 9 ? `<button class="item" data-act="benchSlot" data-i="${benchIds.length}"><span class="pos">+</span><div class="grow muted">Yedek ekle</div></button>` : ''}</div>
    </section>
    <section class="card">
      <div class="card-h">Kadro dışı <span>${reserves.length}</span></div>
      <div class="list">${reserves.map((p) => `<button class="item" data-act="player" data-id="${p.id}">${posPill(p.pos)}<div class="grow"><div class="name ellipsis">${esc(p.name)} ${statusIcons(p)}</div></div>${ovrPill(p.ovr)}</button>`).join('') || '<div class="muted small">Herkes maç kadrosunda.</div>'}</div>
    </section>`;
}

function openSlotPicker(i, bench = false) {
  const t = me();
  const slotPos = bench ? null : FORMATIONS[t.formation][i][0];
  const current = bench ? t.bench[i] : t.lineup[i];
  const cands = squadOf(state, t.id)
    .filter((p) => (bench ? !t.lineup.includes(p.id) : true))
    .map((p) => ({ p, score: slotPos ? p.ovr * posFit(p.pos, slotPos) : p.ovr }))
    .sort((a, b) => (isAvailable(b.p) - isAvailable(a.p)) || b.score - a.score);
  const where = (id) => (t.lineup.includes(id) ? '<span class="tag ok">11</span>' : t.bench.includes(id) ? '<span class="tag">Yedek</span>' : '');
  openModal(`${sheetHead(bench ? 'Yedek seç' : `${POS_LONG[slotPos]} seç`)}
    <div class="list">
      ${current ? `<button class="item" data-act="${bench ? 'pickBench' : 'pickSlot'}" data-i="${i}" data-id=""><span class="pos">—</span><div class="grow muted">Boş bırak</div></button>` : ''}
      ${cands.map(({ p, score }) => `
        <button class="item" data-act="${bench ? 'pickBench' : 'pickSlot'}" data-i="${i}" data-id="${p.id}" ${p.id === current ? 'style="background:rgba(47,210,122,.08)"' : ''}>
          ${posPill(p.pos)}
          <div class="grow"><div class="name ellipsis">${esc(p.name)} ${where(p.id)}</div>
            <div class="sub">${!isAvailable(p) ? (p.injury ? `🚑 ${p.injury.days} gün` : `🟥 ${p.susp} maç`) : `Kondisyon %${Math.round(p.condition)}`}${slotPos && posFit(p.pos, slotPos) < 1 ? ` · Uyum %${Math.round(posFit(p.pos, slotPos) * 100)}` : ''}</div></div>
          ${ovrPill(slotPos ? Math.round(score) : p.ovr)}
        </button>`).join('')}
    </div>`);
}

// Ortak kariyerde taktik değişiklikleri kısa bir gecikmeyle lige gönderilir.
function queueTactics() {
  if (!isMp() || !session) return;
  const t = me();
  pendingTactics = { formation: t.formation, mentality: t.mentality, lineup: (t.lineup || []).slice(), bench: (t.bench || []).slice() };
  clearTimeout(tacticsTimer);
  tacticsTimer = setTimeout(flushTactics, 700);
}
async function flushTactics() {
  clearTimeout(tacticsTimer);
  if (!pendingTactics || !session) return;
  const payload = pendingTactics;
  try {
    await session.submit('tactics', payload, true);
  } catch (e) {
    toast(`Taktik gönderilemedi: ${e.message}`);
    return;
  }
  if (pendingTactics === payload) pendingTactics = null;
}

function tacticsChanged() {
  save();
  queueTactics();
}

function pickSlot(i, pid) {
  const t = me();
  const cur = t.lineup[i];
  if (!pid) {
    t.lineup[i] = null;
  } else {
    const li = t.lineup.indexOf(pid);
    const bi = t.bench.indexOf(pid);
    if (li >= 0) { t.lineup[li] = cur; t.lineup[i] = pid; }
    else if (bi >= 0) {
      if (cur) t.bench[bi] = cur; else t.bench.splice(bi, 1);
      t.lineup[i] = pid;
    } else t.lineup[i] = pid;
  }
  tacticsChanged();
  closeModal();
  render();
}

function pickBench(i, pid) {
  const t = me();
  if (!pid) t.bench.splice(i, 1);
  else {
    const bi = t.bench.indexOf(pid);
    if (bi >= 0 && i < t.bench.length) [t.bench[i], t.bench[bi]] = [t.bench[bi], t.bench[i]];
    else if (i < t.bench.length) t.bench[i] = pid;
    else if (bi < 0) t.bench.push(pid);
  }
  t.bench = [...new Set(t.bench.filter(Boolean))].slice(0, 9);
  tacticsChanged();
  closeModal();
  render();
}

function changeFormation(f) {
  const t = me();
  const old = (t.lineup || []).filter(Boolean).map(P);
  const slots = FORMATIONS[f];
  const lineup = new Array(slots.length).fill(null);
  const used = new Set();
  const order = slots.map((s, i) => i).sort((a, b) => (slots[a][0] === 'GK' ? -1 : slots[b][0] === 'GK' ? 1 : 0));
  for (const i of order) {
    let best = null;
    let bs = -1;
    for (const p of old) {
      if (used.has(p.id)) continue;
      const s = p.ovr * posFit(p.pos, slots[i][0]);
      if (s > bs) { bs = s; best = p; }
    }
    if (best && bs >= best.ovr * 0.8) { lineup[i] = best.id; used.add(best.id); }
  }
  t.formation = f;
  t.lineup = lineup;
  const auto = autoPick(squadOf(state, t.id).filter((p) => !used.has(p.id)), f);
  lineup.forEach((id, i) => { if (!id && auto.lineup[i]) { lineup[i] = auto.lineup[i]; used.add(auto.lineup[i]); } });
  t.bench = (t.bench || []).filter((id) => !lineup.includes(id));
  tacticsChanged();
  render();
}

// ---------- Lig ----------
function fxRow(f) {
  const uid = state.userTeamId;
  const mine = f.home === uid || f.away === uid;
  const sc = f.played ? `<span class="sc">${f.hg} - ${f.ag}</span>` : `<span class="sc tbd">${fmtDate(f.date).slice(0, -5)}</span>`;
  return `<button class="fx ${mine ? 'me' : ''}" ${f.played ? `data-act="report" data-id="${f.id}"` : `data-act="team" data-id="${f.home}"`}>
    <span class="h"><span class="ellipsis">${esc(T(f.home).name)}</span>${badge(f.home, 'sm')}</span>${sc}<span class="a">${badge(f.away, 'sm')}<span class="ellipsis">${esc(T(f.away).name)}</span></span>
  </button>`;
}

function leagueHtml() {
  const tabs = `<div class="tabs">
    ${[['table', 'Puan durumu'], ['fixtures', 'Fikstür'], ['stats', 'İstatistikler'], ['history', 'Geçmiş']].map(([k, v]) => `<button class="${view.leagueTab === k ? 'on' : ''}" data-act="leagueTab" data-v="${k}">${v}</button>`).join('')}
  </div>`;
  if (view.leagueTab === 'fixtures') return tabs + fixturesHtml();
  if (view.leagueTab === 'stats') return tabs + statsHtml();
  if (view.leagueTab === 'history') return tabs + historyHtml();

  const table = standings(state);
  return `${tabs}
    <section class="card" style="padding:8px">
      <div class="muted small" style="padding:4px 6px 8px">Trendyol Süper Lig ${seasonLabel(state.season)}</div>
      <div class="table-wrap"><table class="tbl">
        <thead><tr><th>#</th><th class="tl">Takım</th><th>O</th><th>G</th><th>B</th><th>M</th><th>AV</th><th>P</th></tr></thead>
        <tbody>${table.map((r, i) => `
          <tr class="${r.id === state.userTeamId ? 'me' : ''} ${i === 0 || i === 1 ? 'z-cl' : i <= 3 ? 'z-el' : i >= table.length - 3 ? 'z-rel' : ''}" data-act="team" data-id="${r.id}">
            <td class="rank">${i + 1}</td>
            <td class="tl"><div class="teamcell">${badge(r.id, 'sm')}<span class="ellipsis">${esc(T(r.id).name)}</span>${isMp() && isHuman(state, r.id) ? `<span class="tag human">${esc(managerName(r.id))}</span>` : ''}</div></td>
            <td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf - r.ga > 0 ? '+' : ''}${r.gf - r.ga}</td><td><b>${r.pts}</b></td>
          </tr>`).join('')}</tbody>
      </table></div>
      <div class="legend"><span><i style="background:var(--info)"></i>Şampiyonlar Ligi</span><span><i style="background:var(--warn)"></i>Avrupa kupaları</span><span><i style="background:var(--bad)"></i>Küme düşme</span></div>
    </section>`;
}

function currentRound() {
  const next = state.fixtures.find((f) => !f.played);
  return next ? next.round : 34;
}

function fixturesHtml() {
  if (!view.round) view.round = currentRound();
  const r = view.round;
  const list = state.fixtures.filter((f) => f.round === r);
  return `<section class="card">
    <div class="round-nav"><button data-act="round" data-d="-1" ${r <= 1 ? 'disabled' : ''}>‹</button><b>${r}. Hafta</b><button data-act="round" data-d="1" ${r >= 34 ? 'disabled' : ''}>›</button></div>
    ${list.map(fxRow).join('')}
  </section>`;
}

function statsHtml() {
  const players = Object.values(state.players).filter((p) => p.teamId && p.stats.apps > 0);
  let rows;
  let val;
  if (view.statTab === 'assists') { rows = players.sort((a, b) => b.stats.assists - a.stats.assists || b.stats.goals - a.stats.goals); val = (p) => p.stats.assists; }
  else if (view.statTab === 'rating') { rows = players.filter((p) => p.stats.apps >= Math.max(1, Math.floor(currentRound() / 3))).sort((a, b) => avgRating(b) - avgRating(a)); val = (p) => avgRating(p).toFixed(2); }
  else { rows = players.sort((a, b) => b.stats.goals - a.stats.goals || b.stats.assists - a.stats.assists); val = (p) => p.stats.goals; }
  rows = rows.slice(0, 25);
  return `
    <div class="seg" style="margin-bottom:12px">${[['goals', 'Gol'], ['assists', 'Asist'], ['rating', 'Ort. puan']].map(([k, v]) => `<button class="${view.statTab === k ? 'on' : ''}" data-act="statTab" data-v="${k}">${v}</button>`).join('')}</div>
    <section class="card" style="padding:4px 12px"><div class="list">
      ${rows.map((p, i) => `<button class="item" data-act="player" data-id="${p.id}"><b class="muted" style="width:20px">${i + 1}</b>${badge(p.teamId, 'sm')}<div class="grow"><div class="name ellipsis">${esc(p.name)}</div><div class="sub">${esc(T(p.teamId).name)} · ${p.stats.apps} maç</div></div><b style="font-size:17px">${val(p)}</b></button>`).join('') || '<div class="muted small" style="padding:12px 0">Sezon henüz başlamadı.</div>'}
    </div></section>`;
}

function historyHtml() {
  if (!state.history.length) return '<section class="card muted small">Tamamlanan sezon yok. Sezon sonunda şampiyonlar ve ödüller burada listelenecek.</section>';
  const uid = state.userTeamId;
  return state.history.slice().reverse().map((h) => `
    <section class="card">
      <div class="card-h">${seasonLabel(h.season)} <span>Sıranız: ${h.humans?.[uid]?.pos ?? h.userPos}.</span></div>
      <div class="row-flex">${badge(h.champion)}<div class="grow"><b>🏆 ${esc(T(h.champion).name)}</b><div class="muted small">Şampiyon</div></div></div>
      <div class="hr"></div>
      <div class="small">⚽ Gol kralı: <b>${esc(h.topScorer?.name || '-')}</b> (${h.topScorer?.v ?? 0})<br>🎯 Asist kralı: <b>${esc(h.topAssist?.name || '-')}</b> (${h.topAssist?.v ?? 0})<br>⭐ Sezonun oyuncusu: <b>${esc(h.best?.name || '-')}</b> (${h.best?.v ?? '-'})</div>
    </section>`).join('');
}

function openTeam(id) {
  const t = T(id);
  const sq = squadOf(state, id).sort((a, b) => POSITIONS.indexOf(a.pos) - POSITIONS.indexOf(b.pos) || b.ovr - a.ovr);
  const table = standings(state);
  const pos = table.findIndex((r) => r.id === id) + 1;
  openModal(`${sheetHead(esc(t.name), teamKit(id, 44))}
    <div class="grid3">
      <div class="stat"><span>Sıra</span><b>${pos}.</b></div>
      <div class="stat"><span>Güç</span><b>${teamRating(sq)}</b></div>
      <div class="stat"><span>Kadro</span><b>${sq.length}</b></div>
    </div>
    <div class="spacer"></div>
    <div class="muted small">${esc(t.city)} · ${esc(t.stadium)} (${t.capacity.toLocaleString('tr-TR')}) · Teknik direktör: ${esc(t.coach)}${isMp() && isHuman(state, id) ? ' <span class="tag human">oyuncu</span>' : ''}</div>
    <div class="hr"></div>
    <div class="list">${sq.map((p) => `<button class="item" data-act="player" data-id="${p.id}">${posPill(p.pos)}<div class="grow"><div class="name ellipsis">${esc(p.name)}</div><div class="sub">${flag(p.nat)} ${p.age} yaş · ${fmtMoney(playerValue(p, state.season))} ${statusIcons(p)}</div></div>${ovrPill(p.ovr)}</button>`).join('')}</div>`);
}

function openReport(fid) {
  const f = state.fixtures.find((x) => x.id === fid);
  if (!f || !f.played) return;
  const side = (i) => f.events.filter((e) => e.side === i && e.type === 'goal').map((e) => `${esc(P(e.pid)?.name || '')} ${e.t}'${e.pen ? ' (P)' : ''}`).join('<br>');
  const reds = f.events.filter((e) => e.type === 'red');
  const statRow = (label, arr, suffix = '') => `<div class="row-flex small" style="padding:5px 0;border-bottom:1px solid var(--line)"><b style="width:50px">${arr[0]}${suffix}</b><span class="grow center muted">${label}</span><b style="width:50px;text-align:right">${arr[1]}${suffix}</b></div>`;
  const ratingsHtml = (teamId) => {
    const rows = Object.entries(f.ratings || {}).map(([pid, r]) => ({ p: P(pid), r })).filter((x) => x.p && x.p.teamId === teamId).sort((a, b) => b.r - a.r);
    if (!rows.length) return '';
    return `<div class="card-h" style="margin-top:12px">${esc(T(teamId).name)} oyuncu puanları</div>${rows.map(({ p, r }) => `<div class="row-flex small" style="padding:4px 0">${posPill(p.pos)}<span class="grow ellipsis">${esc(p.name)}${f.motm === p.id ? ' ⭐' : ''}</span><b>${r.toFixed(1)}</b></div>`).join('')}`;
  };
  openModal(`${sheetHead(`${f.round}. hafta · ${fmtDate(f.date)}`)}
    <div class="vs">
      <div class="vs-team">${teamKit(f.home, 64)}<div class="nm">${esc(T(f.home).name)}</div></div>
      <div class="vs-mid" style="font-size:32px">${f.hg} - ${f.ag}<small>${f.attendance ? `${f.attendance.toLocaleString('tr-TR')} seyirci` : ''}</small></div>
      <div class="vs-team">${teamKit(f.away, 64)}<div class="nm">${esc(T(f.away).name)}</div></div>
    </div>
    <div class="grid2 small"><div>${side(0) || '<span class="muted">—</span>'}</div><div style="text-align:right">${side(1) || '<span class="muted">—</span>'}</div></div>
    ${reds.length ? `<div class="small muted" style="margin-top:6px">🟥 ${reds.map((e) => `${esc(P(e.pid)?.name || '')} ${e.t}'`).join(', ')}</div>` : ''}
    ${f.motm && P(f.motm) ? `<div class="note small">⭐ Maçın oyuncusu: <b>${esc(P(f.motm).name)}</b> (${f.ratings[f.motm].toFixed(1)})</div>` : ''}
    ${f.stats ? `<div class="spacer"></div>
      ${statRow('Topa sahip olma', f.stats.poss, '%')}
      ${statRow('Şut', f.stats.shots)}
      ${statRow('İsabetli şut', f.stats.onT)}
      ${statRow('Gol beklentisi (xG)', f.stats.xg)}
      ${statRow('Korner', f.stats.corners)}
      ${statRow('Faul', f.stats.fouls)}` : ''}
    ${ratingsHtml(f.home)}${ratingsHtml(f.away)}`);
}

// ---------- Oyuncu ----------
function openPlayer(pid) {
  const p = P(pid);
  if (!p) return;
  const uid = state.userTeamId;
  const own = p.teamId === uid;
  const value = playerValue(p, state.season);
  const team = p.teamId ? T(p.teamId) : null;
  const potText = own ? `${p.pot}` : `${Math.max(p.ovr, p.pot - 3)}–${p.pot + 3}`;
  const status = p.retired ? 'Futbolu bıraktı' : p.injury ? `🚑 ${p.injury.name} (${p.injury.days} gün)` : p.susp > 0 ? `🟥 ${p.susp} maç cezalı` : 'Oynayabilir';
  const s = p.stats;
  const history = (p.history || []).slice().reverse();

  let actions = '';
  if (!p.retired) {
    if (own && !p.loan) actions = `<button class="btn" data-act="contract" data-id="${p.id}">Sözleşme uzat</button>`;
    else if (!p.teamId && !p.abroad) actions = `<button class="btn primary" data-act="contract" data-id="${p.id}">Sözleşme teklif et</button>`;
    else if (p.teamId && !own) {
      actions = `<button class="btn primary" data-act="bid" data-id="${p.id}" data-type="transfer">Transfer teklifi</button>
        <button class="btn" data-act="bid" data-id="${p.id}" data-type="loan">Kiralama teklifi</button>`;
    }
  }

  openModal(`${sheetHead(esc(p.name), team ? badge(team.id) : '')}
    <div class="row-flex" style="margin-bottom:12px">
      ${ovrPill(p.ovr)} ${posPill(p.pos)}
      <div class="grow small">${flag(p.nat)} ${esc(COUNTRY[p.nat] || p.nat)} · ${p.age} yaş · ${POS_LONG[p.pos]}<br>
        <span class="muted">${team ? esc(team.name) : p.abroad ? esc(p.abroad) : 'Serbest oyuncu'}${p.num ? ` · #${p.num}` : ''}${p.loan ? ` · ${esc(p.loan.fromName)} kulübünden kiralık` : ''}${isMp() && team && isHuman(state, team.id) && !own ? ` · TD: ${esc(managerName(team.id))}` : ''}</span></div>
    </div>
    <div class="grid3">
      <div class="stat"><span>Potansiyel</span><b>${potText}</b></div>
      <div class="stat"><span>Piyasa değeri</span><b>${fmtMoney(value)}</b></div>
      <div class="stat"><span>Maaş / yıl</span><b>${p.teamId ? fmtMoney(p.wage) : '—'}</b></div>
      <div class="stat"><span>Sözleşme</span><b>${p.teamId ? (p.loan ? p.loan.until.slice(0, 4) : `Haz ${p.contractEnd}`) : '—'}</b></div>
      <div class="stat"><span>Kondisyon</span><b>%${Math.round(p.condition)}</b></div>
      <div class="stat"><span>Moral</span><b>${moraleLabel(p.morale)}</b></div>
    </div>
    <div class="note small">${status}${p.teamId ? ` · Kulüpteki rolü: ${ROLE_TR[playerRole(state, p)]}` : ''}</div>
    <div class="card-h" style="margin-top:14px">${seasonLabel(state.season)} sezonu</div>
    <div class="grid3">
      <div class="stat"><span>Maç (ilk 11)</span><b>${s.apps} (${s.starts})</b></div>
      <div class="stat"><span>Gol / Asist</span><b>${s.goals} / ${s.assists}</b></div>
      <div class="stat"><span>Ort. puan</span><b>${s.rN ? avgRating(p).toFixed(2) : '—'}</b></div>
      <div class="stat"><span>Dakika</span><b>${s.mins}</b></div>
      <div class="stat"><span>Sarı / Kırmızı</span><b>${s.yel} / ${s.red}</b></div>
      <div class="stat"><span>${p.pos === 'GK' ? 'Gol yemeden' : 'Kalesini kapatma'}</span><b>${s.cs}</b></div>
    </div>
    ${history.length ? `<div class="card-h" style="margin-top:14px">Kariyer (bu oyunda)</div>${history.map((h) => `<div class="row-flex small" style="padding:4px 0">${badge(h.teamId, 'sm')}<span class="grow">${seasonLabel(h.season)}</span><span class="muted">${h.apps} maç · ${h.goals} gol · ${h.assists} asist · ${h.avg || '-'}</span></div>`).join('')}` : ''}
    ${actions ? `<div class="btns">${actions}</div>` : ''}
    ${p.teamId && !own ? `<button class="btn ghost block" data-act="team" data-id="${p.teamId}">${esc(T(p.teamId).name)} kadrosunu gör</button>` : ''}`);
}

function openBid(pid, type) {
  const p = P(pid);
  const value = playerValue(p, state.season);
  const balance = me().finance.balance;
  const humanSeller = isMp() && isHuman(state, p.teamId);
  const who = humanSeller ? `${managerName(p.teamId)} teklifini değerlendirecek.` : 'Kulüp 1-2 gün içinde yanıt verir.';
  if (type === 'transfer') {
    const max = Math.max(roundMoney(value * 3), 500000);
    const step = value >= 5e6 ? 100000 : 25000;
    openModal(`${sheetHead('Transfer teklifi')}
      <div class="row-flex">${ovrPill(p.ovr)}<div class="grow"><b>${esc(p.name)}</b><div class="muted small">${esc(T(p.teamId).name)} · Değer ${fmtMoney(value)}</div></div></div>
      <div class="spacer"></div>
      <label class="lbl">Bonservis bedeli: <b id="feeLbl">${fmtMoney(value)}</b></label>
      <input type="range" id="fee" min="0" max="${max}" step="${step}" value="${Math.min(value, max)}" data-input="fee">
      <div class="muted small">Kasanız: ${fmtMoney(balance)} · ${who}${humanSeller ? '' : ' Anlaşılırsa oyuncuyla sözleşme görüşürsünüz.'}</div>
      <button class="btn primary block" data-act="sendBid" data-id="${pid}" data-type="transfer">Teklifi gönder</button>`);
  } else {
    openModal(`${sheetHead('Kiralama teklifi')}
      <div class="row-flex">${ovrPill(p.ovr)}<div class="grow"><b>${esc(p.name)}</b><div class="muted small">${esc(T(p.teamId).name)} · Yıllık maaş ${fmtMoney(p.wage)}</div></div></div>
      <div class="spacer"></div>
      <label class="lbl">Maaşın ne kadarını ödeyeceksiniz?</label>
      <select class="sel" id="share">${[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v) => `<option value="${v}" ${v === 50 ? 'selected' : ''}>%${v}</option>`).join('')}</select>
      <div class="spacer"></div>
      <label class="lbl">Kiralama bedeli: <b id="feeLbl">€0</b></label>
      <input type="range" id="fee" min="0" max="${Math.max(roundMoney(value * 0.3), 100000)}" step="25000" value="0" data-input="fee">
      <div class="muted small">Kiralama sezon sonuna kadar geçerlidir. ${who}</div>
      <button class="btn primary block" data-act="sendBid" data-id="${pid}" data-type="loan">Teklifi gönder</button>`);
  }
}

function openContract(pid, offerId = null) {
  const p = P(pid);
  const uid = state.userTeamId;
  const d = contractDemand(state, p, uid);
  const offer = offerId ? state.offers.find((o) => o.id === offerId) : null;
  const start = p.teamId === uid ? p.wage : roundMoney(d.wage * 0.85);
  const min = roundMoney(Math.max(30000, d.wage * 0.4));
  const max = roundMoney(d.wage * 2.5);
  const step = d.wage >= 1e6 ? 50000 : 10000;
  const title = p.teamId === uid ? 'Sözleşme uzatma' : 'Sözleşme görüşmesi';
  openModal(`${sheetHead(title)}
    <div class="row-flex">${ovrPill(p.ovr)}<div class="grow"><b>${esc(p.name)}</b><div class="muted small">${p.age} yaş · ${POS_LONG[p.pos]}${p.teamId === uid ? ` · Mevcut maaş ${fmtMoney(p.wage)}` : ''}</div></div></div>
    ${offer ? `<div class="note small">Kulüpler ${fmtMoney(offer.fee)} bonservis bedelinde anlaştı.</div>` : ''}
    <div class="spacer"></div>
    <label class="lbl">Yıllık maaş: <b id="wageLbl">${fmtMoney(start)}</b></label>
    <input type="range" id="wage" min="${min}" max="${max}" step="${step}" value="${Math.min(Math.max(start, min), max)}" data-input="wage">
    <div class="spacer"></div>
    <label class="lbl">Süre</label>
    <select class="sel" id="years">${[1, 2, 3, 4, 5].map((y) => `<option value="${y}" ${y === d.years ? 'selected' : ''}>${y} yıl (Haziran ${state.season + y})</option>`).join('')}</select>
    <div id="cNote"></div>
    <div class="btns">
      <button class="btn primary" data-act="sendContract" data-id="${pid}" data-offer="${offerId || ''}">Teklif et</button>
      ${offer ? `<button class="btn danger" data-act="cancelNeg" data-offer="${offerId}">Transferden vazgeç</button>` : ''}
    </div>`);
}

// ---------- Transfer ----------
function transferHtml() {
  const win = currentWindow(state);
  const tabs = `<div class="tabs">
    ${[['search', 'Oyuncu ara'], ['offers', 'Teklifler'], ['news', 'Transfer haberleri']].map(([k, v]) => `<button class="${view.transferTab === k ? 'on' : ''}" data-act="transferTab" data-v="${k}">${v}</button>`).join('')}
  </div>`;
  const banner = `<div class="note small ${win ? 'ok' : ''}" style="margin:0 0 12px">${win ? `✅ ${win.label} açık · ${fmtDate(win.end)} tarihinde kapanıyor` : '⛔ Transfer dönemi kapalı. Serbest oyuncularla her zaman anlaşabilirsiniz. Ara transfer dönemi 5 Ocak\'ta açılır.'} · Kasa: <b>${fmtMoney(me().finance.balance)}</b></div>`;
  if (view.transferTab === 'offers') return tabs + banner + offersHtml();
  if (view.transferTab === 'news') {
    return `${tabs}<section class="card">${state.transferLog.slice(0, 60).map((x) => `<div class="news-item"><b>${esc(x.name)}</b>: ${esc(x.from)} → ${esc(x.to)} · ${x.loan ? 'Kiralık' : x.fee ? fmtMoney(x.fee) : 'Bedelsiz'}<small>${fmtDate(x.date)}</small></div>`).join('') || '<div class="muted small">Henüz transfer yok.</div>'}</section>`;
  }

  const f = view.tf;
  const uid = state.userTeamId;
  let rows = Object.values(state.players).filter((p) => !p.retired && !p.abroad && p.teamId !== uid);
  if (f.team === 'FREE') rows = rows.filter((p) => !p.teamId);
  else if (f.team) rows = rows.filter((p) => p.teamId === f.team);
  if (f.pos) rows = rows.filter((p) => p.pos === f.pos);
  if (f.maxAge) rows = rows.filter((p) => p.age <= Number(f.maxAge));
  if (f.minOvr) rows = rows.filter((p) => p.ovr >= Number(f.minOvr));
  if (f.maxVal) rows = rows.filter((p) => playerValue(p, state.season) <= Number(f.maxVal));
  if (f.q) {
    const q = f.q.toLocaleLowerCase('tr');
    rows = rows.filter((p) => p.name.toLocaleLowerCase('tr').includes(q));
  }
  const total = rows.length;
  rows = rows.sort((a, b) => b.ovr - a.ovr).slice(0, 80);
  const sel = (k, opts) => `<select class="sel" data-change="tf" data-k="${k}">${opts.map(([v, l]) => `<option value="${v}" ${String(f[k]) === String(v) ? 'selected' : ''}>${l}</option>`).join('')}</select>`;

  return `${tabs}${banner}
    <section class="card">
      <div class="filters">
        <div class="full"><input class="inp" placeholder="Oyuncu adı ara…" value="${esc(f.q)}" data-change="tf" data-k="q"></div>
        <div>${sel('pos', [['', 'Tüm mevkiler'], ...POSITIONS.map((p) => [p, POS_LONG[p]])])}</div>
        <div>${sel('team', [['', 'Tüm kulüpler'], ['FREE', 'Serbest oyuncular'], ...Object.values(state.teams).filter((t) => t.id !== uid).sort((a, b) => a.name.localeCompare(b.name, 'tr')).map((t) => [t.id, t.name])])}</div>
        <div>${sel('maxAge', [['', 'Her yaş'], [21, '21 ve altı'], [24, '24 ve altı'], [27, '27 ve altı'], [30, '30 ve altı']])}</div>
        <div>${sel('minOvr', [['', 'Her güç'], [60, '60+'], [65, '65+'], [70, '70+'], [75, '75+'], [80, '80+']])}</div>
        <div class="full">${sel('maxVal', [['', 'Her değer'], [500000, '€500 B altı'], [1000000, '€1 M altı'], [3000000, '€3 M altı'], [5000000, '€5 M altı'], [10000000, '€10 M altı'], [20000000, '€20 M altı']])}</div>
      </div>
    </section>
    <section class="card" style="padding:4px 12px">
      <div class="muted small" style="padding:8px 0">${total} oyuncu bulundu${total > 80 ? ' · ilk 80 gösteriliyor' : ''}</div>
      <div class="list">${rows.map((p) => `
        <button class="item" data-act="player" data-id="${p.id}">
          ${posPill(p.pos)}
          <div class="grow"><div class="name ellipsis">${esc(p.name)} ${statusIcons(p)}</div>
            <div class="sub">${flag(p.nat)} ${p.age} · ${p.teamId ? esc(T(p.teamId).name) : '<span style="color:var(--accent)">Serbest</span>'}${p.loan ? ' · kiralık' : ''}</div></div>
          <div style="text-align:right">${ovrPill(p.ovr)}<div class="sub small">${fmtMoney(playerValue(p, state.season))}</div></div>
        </button>`).join('')}</div>
    </section>`;
}

const OFFER_STATUS = {
  pending: ['Yanıt bekleniyor', 'info'], accepted: ['Kabul · sözleşme görüşmesi', 'ok'], countered: ['Karşı teklif', 'warn'],
  rejected: ['Reddedildi', 'bad'], completed: ['Tamamlandı', 'ok'], withdrawn: ['Geri çekildi', ''], cancelled: ['İptal', ''],
  expired: ['Süresi doldu', ''], failed: ['Başarısız', 'bad'],
};

function offersHtml() {
  const uid = state.userTeamId;
  const mine = state.offers.filter((o) => o.user && o.from === uid);
  const incoming = state.offers.filter((o) => o.to === uid && o.from !== uid);
  const row = (o, dir) => {
    const p = P(o.pid);
    const other = dir === 'out' ? T(o.to)?.name : o.fromForeign || T(o.from)?.name;
    const [label, cls] = OFFER_STATUS[o.status] || [o.status, ''];
    return `<button class="item" data-act="player" data-id="${o.pid}">
      ${posPill(p.pos)}<div class="grow"><div class="name ellipsis">${esc(p.name)}</div>
      <div class="sub">${dir === 'out' ? '→' : '←'} ${esc(other || '')} · ${o.type === 'loan' ? `Kiralık (%${o.wageShare})` : fmtMoney(o.fee)} · ${fmtDate(o.created)}</div></div>
      <span class="tag ${cls}">${label}</span></button>`;
  };
  return `<section class="card"><div class="card-h">Yaptığım teklifler</div><div class="list">${mine.map((o) => row(o, 'out')).join('') || '<div class="muted small">Henüz teklif yapmadınız. Oyuncu ara sekmesinden bir oyuncu seçin.</div>'}</div></section>
    <section class="card"><div class="card-h">Oyuncularıma gelen teklifler</div><div class="list">${incoming.map((o) => row(o, 'in')).join('') || '<div class="muted small">Henüz teklif gelmedi.</div>'}</div></section>`;
}

// ---------- Gelen kutusu ----------
function inboxHtml() {
  const list = myInbox();
  if (!list.length) return '<section class="card muted">Gelen kutunuz boş.</section>';
  return `<section class="card" style="padding:4px 12px"><div class="list">${list.slice(0, 120).map((m) => `
    <button class="item" data-act="msg" data-id="${m.id}">
      <span style="width:8px;height:8px;border-radius:50%;flex:none;background:${!isRead(m) ? 'var(--accent)' : 'transparent'}"></span>
      <div class="grow"><div class="name ellipsis" style="${isRead(m) ? 'font-weight:500' : ''}">${esc(m.title)}</div>
        <div class="sub">${fmtDate(m.date)}${m.needsAction && !m.resolved ? ` · <span style="color:var(--warn)">Yanıt bekliyor${isMp() && m.expires ? ` (son gün ${fmtDate(m.expires)})` : ''}</span>` : ''}</div></div>
    </button>`).join('')}</div></section>`;
}

function openMessage(id) {
  const m = state.inbox.find((x) => x.id === id);
  if (!m) return;
  markRead(m);
  const o = m.offerId ? state.offers.find((x) => x.id === m.offerId) : null;
  let actions = '';
  if (m.needsAction && !m.resolved && o) {
    if (m.kind === 'incoming') {
      actions = `<div class="btns">
        <button class="btn primary" data-act="incoming" data-offer="${o.id}" data-a="accept">Kabul et</button>
        <button class="btn danger" data-act="incoming" data-offer="${o.id}" data-a="reject">Reddet</button>
      </div>
      ${o.type === 'transfer' ? `<div class="hr"></div>
        <label class="lbl">Karşı teklif: <b id="feeLbl">${fmtMoney(roundMoney(o.fee * 1.3))}</b></label>
        <input type="range" id="fee" min="${roundMoney(o.fee)}" max="${roundMoney(o.fee * 2.5)}" step="${o.fee >= 5e6 ? 100000 : 25000}" value="${roundMoney(o.fee * 1.3)}" data-input="fee">
        <button class="btn block" data-act="incoming" data-offer="${o.id}" data-a="counter">Karşı teklif gönder</button>` : ''}`;
    } else if (m.kind === 'negotiate') {
      actions = `<div class="btns"><button class="btn primary" data-act="contract" data-id="${o.pid}" data-offer="${o.id}">Sözleşme görüşmesine başla</button>
        <button class="btn danger" data-act="cancelNeg" data-offer="${o.id}">Vazgeç</button></div>`;
    } else if (m.kind === 'counter') {
      actions = `<div class="btns"><button class="btn primary" data-act="counterReply" data-offer="${o.id}" data-a="1">${fmtMoney(o.counter)} öde</button>
        <button class="btn danger" data-act="counterReply" data-offer="${o.id}" data-a="0">Vazgeç</button></div>`;
    } else if (m.kind === 'counterLoan') {
      actions = `<div class="btns"><button class="btn primary" data-act="counterReply" data-offer="${o.id}" data-a="1">%${o.counterShare} maaşı üstlen</button>
        <button class="btn danger" data-act="counterReply" data-offer="${o.id}" data-a="0">Vazgeç</button></div>`;
    }
  }
  openModal(`${sheetHead(esc(m.title))}
    <div class="muted small" style="margin-bottom:8px">${fmtDate(m.date, true)}${isMp() && m.needsAction && !m.resolved && m.expires ? ` · Son yanıt günü: ${fmtDate(m.expires)}` : ''}</div>
    <div class="msg-body">${esc(m.body)}</div>
    ${actions}
    ${m.pid && P(m.pid) ? `<button class="btn ghost block" data-act="player" data-id="${m.pid}">Oyuncu profilini aç</button>` : ''}
    ${!actions ? '<button class="btn block" data-act="close">Tamam</button>' : ''}`);
}

// ---------- Kulüp ----------
function openClub() {
  const t = me();
  const f = t.finance.season;
  const board = myBoard();
  const income = f.gate + f.tv + f.sponsor + f.prize + f.sales;
  const expense = f.wages + f.purchases + f.running;
  const line = (l, v) => `<div class="row-flex small" style="padding:5px 0;border-bottom:1px solid var(--line)"><span class="grow muted">${l}</span><b>${fmtMoney(v)}</b></div>`;
  openModal(`${sheetHead(esc(t.name), badge(t.id))}
    <div class="grid2">
      <div class="stat"><span>Kasa</span><b>${fmtMoney(t.finance.balance)}</b></div>
      <div class="stat"><span>İtibar</span><b>${t.rep}/100</b></div>
      <div class="stat"><span>Yönetim hedefi</span><b>${esc(board.label)}</b></div>
      <div class="stat"><span>Yönetim güveni</span><b>%${Math.round(board.confidence)}</b></div>
    </div>
    <div class="muted small" style="margin-top:8px">Teknik direktör: ${esc(managerName())} · ${esc(t.stadium)} (${t.capacity.toLocaleString('tr-TR')} kişilik)</div>
    <div class="card-h" style="margin-top:14px">Bu sezon gelirler <span>${fmtMoney(income)}</span></div>
    ${line('Bilet gelirleri', f.gate)}${line('Yayın gelirleri', f.tv)}${line('Sponsorluk', f.sponsor)}${line('Ödüller', f.prize)}${line('Oyuncu satışları', f.sales)}
    <div class="card-h" style="margin-top:14px">Bu sezon giderler <span>${fmtMoney(expense)}</span></div>
    ${line('Maaşlar', f.wages)}${line('Transfer harcamaları', f.purchases)}${line('İşletme giderleri', f.running)}
    <div class="hr"></div>
    ${isMp()
      ? `<div class="note small">Ortak kariyer · Lig kodu <b>${esc(session.code)}</b>. Ligden çıksan da takımın ligde kalır; istediğin zaman kodla geri dönebilirsin.</div>
         <button class="btn block" data-act="mpShare">Arkadaş davet et</button>
         <button class="btn danger block" data-act="mpLeave">Bu cihazda ligden çık</button>`
      : `<button class="btn block" data-act="mpOpen">Arkadaşlarla oyna</button>
         <button class="btn danger block" data-act="confirmNew">Yeni kariyer başlat</button>
         <p class="footer-note">Oyun her adımda bu cihazın tarayıcısına otomatik kaydedilir.</p>`}`);
}

// ---------- Maç önü & canlı maç (tek oyunculu) ----------
function openPrematch(fx) {
  const uid = state.userTeamId;
  const { lineup } = prepareLineup(state, uid);
  const t = me();
  const changed = (t.lineup || []).filter((id, i) => id !== lineup[i]).length;
  openModal(`${sheetHead(`${fx.round}. hafta · Maç günü`)}
    <div class="vs">${teamCol(fx.home)}<div class="vs-mid">VS<small>${esc(T(fx.home).stadium)}</small></div>${teamCol(fx.away)}</div>
    <div class="note small">Diziliş: <b>${t.formation}</b> · Anlayış: <b>${MENTALITIES[t.mentality].label}</b>${changed ? `<br>⚠️ İlk 11'deki ${changed} eksik oyuncunun yerine otomatik seçim yapılacak.` : ''}</div>
    <div class="btns">
      <button class="btn" data-act="goTactics">Taktik & kadro</button>
    </div>
    <div class="btns">
      <button class="btn primary" data-act="live" data-id="${fx.id}">▶ Canlı izle</button>
      <button class="btn" data-act="quick" data-id="${fx.id}">⏩ Hızlı sonuç</button>
    </div>`);
}

function startLive(fid) {
  const fx = state.fixtures.find((f) => f.id === fid);
  closeModal();
  seedRng(state.rng);
  live = { m: new Match(state, fx, { autoUser: false }), speed: 1, paused: false, timer: null, done: false };
  renderMatch();
  schedule();
}

function schedule() {
  clearTimeout(live?.timer);
  if (!live || live.paused || live.m.finished) return;
  const delay = { 1: 650, 2: 280, 4: 80 }[live.speed];
  live.timer = setTimeout(() => {
    if (!live) return;
    const evs = live.m.step();
    if (evs.some((e) => e.type === 'half')) live.paused = true;
    if (live.paused || live.m.finished || evs.some((e) => e.type === 'goal') || Date.now() - (live.lastSave || 0) > 4000) {
      save();
      live.lastSave = Date.now();
    }
    renderMatch();
    schedule();
  }, delay);
}

function finishLive() {
  const m = live.m;
  clearTimeout(live.timer);
  const result = m.apply();
  state.rng = getRngState();
  live = null;
  onUserMatchPlayed(state, m.fx, result);
  save();
  const fid = m.fx.id;
  render();
  openReport(fid);
}

function quickMatch(fid) {
  const fx = state.fixtures.find((f) => f.id === fid);
  closeModal();
  seedRng(state.rng);
  const m = new Match(state, fx, { autoUser: true });
  m.playToEnd();
  const result = m.apply();
  state.rng = getRngState();
  onUserMatchPlayed(state, fx, result);
  save();
  render();
  openReport(fid);
}

function renderMatch() {
  const m = live.m;
  const [h, a] = m.sides;
  const st = m.stats;
  const possTotal = Math.max(1, st[0].poss + st[1].poss);
  const hp = Math.round((st[0].poss / possTotal) * 100);
  const us = m.userSide;
  const side = m.sides[us];
  const feed = m.events.slice().reverse().map((e) => `<div class="ev ${e.type}"><span class="t">${e.type === 'half' || e.type === 'end' || e.type === 'info' ? '' : `${e.t}'`}</span><span>${esc(e.text)}</span></div>`).join('');
  const visible = (colors) => {
    const n = parseInt(colors[0].slice(1), 16);
    const lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
    return lum < 0.18 ? colors[1] : colors[0];
  };
  const hc = visible(T(h.teamId).colors);
  const ac = visible(T(a.teamId).colors);
  $app.innerHTML = `
    <div class="match">
      <div class="sb">
        <div class="sb-team">${teamKit(h.teamId, 60)}<span class="ellipsis" style="max-width:100%">${esc(h.name)}</span></div>
        <div><div class="sb-score">${m.score[0]} - ${m.score[1]}</div><div class="sb-min center">${m.finished ? 'MS' : m.minute === 0 ? 'Başlıyor' : m.half === 2 && m.minute === 45 ? 'İY' : `${m.clock()}'`}</div></div>
        <div class="sb-team">${teamKit(a.teamId, 60)}<span class="ellipsis" style="max-width:100%">${esc(a.name)}</span></div>
      </div>
      <div class="poss"><div style="width:${hp}%;background:${hc}"></div><div style="flex:1;background:${ac}"></div></div>
      <div class="mstats"><span>%${hp} · ${st[0].shots} şut (${st[0].onT})</span><span>Topa sahip olma / Şut (isabet)</span><span>(${st[1].onT}) ${st[1].shots} şut · %${100 - hp}</span></div>
      ${m.finished ? `<button class="btn primary block" data-act="mFinish">Maç raporu ve devam</button>` : `
      <div class="mctl">
        <button class="btn" data-act="mPause">${live.paused ? '▶' : '⏸'}</button>
        ${[1, 2, 4].map((s) => `<button class="btn ${live.speed === s ? 'on' : ''}" data-act="mSpeed" data-v="${s}">${s}x</button>`).join('')}
        <button class="btn grow" data-act="mSubs">🔄 Değişiklik (${side.subsLeft})</button>
      </div>
      <div class="seg">${Object.entries(MENTALITIES).map(([k, v]) => `<button class="${side.mentality === k ? 'on' : ''}" data-act="mMent" data-v="${k}">${v.label}</button>`).join('')}</div>
      <button class="btn ghost block" data-act="mSkip" style="margin-top:8px">⏭ Sonuca atla</button>`}
      <div class="feed">${feed || '<div class="muted small center" style="padding:20px">Oyuncular sahaya çıkıyor…</div>'}</div>
    </div>`;
}

function openSubs(outPid = null) {
  const m = live.m;
  const us = m.userSide;
  const side = m.sides[us];
  if (side.subsLeft <= 0) return toast('Değişiklik hakkınız kalmadı.');
  live.paused = true;
  clearTimeout(live.timer);
  renderMatch();
  if (!outPid) {
    openModal(`${sheetHead('Oyundan çıkacak oyuncu')}
      <div class="list">${side.onPitch.map((o) => {
        const p = P(o.pid);
        return `<button class="item" data-act="mOut" data-id="${o.pid}">${posPill(o.slot)}<div class="grow"><div class="name ellipsis">${esc(p.name)} ${o.injured ? '🚑' : ''}</div><div class="sub">Maç puanı ${(m.rt[o.pid] || 6).toFixed(1)}</div></div>${condBar(p.condition)}</button>`;
      }).join('')}</div>`);
    return;
  }
  const out = side.onPitch.find((o) => o.pid === outPid);
  const bench = side.bench.filter((id) => !side.used.has(id)).map(P);
  openModal(`${sheetHead(`${esc(P(outPid).name)} yerine`)}
    <div class="list">${bench.map((p) => `<button class="item" data-act="mIn" data-out="${outPid}" data-id="${p.id}">${posPill(p.pos)}<div class="grow"><div class="name ellipsis">${esc(p.name)}</div><div class="sub">${POS_TR[out.slot]} mevkiinde uyum %${Math.round(posFit(p.pos, out.slot) * 100)}</div></div>${ovrPill(p.ovr)}</button>`).join('') || '<div class="muted">Yedek kulübesinde oyuncu yok.</div>'}</div>`);
}

// ---------- Sezon sonu / kovulma ----------
function renderSeasonEnd() {
  const s = state.seasonSummary;
  const table = s.table;
  const uid = state.userTeamId;
  const mine = s.humans?.[uid] || { pos: s.userPos, target: s.target, verdict: s.verdict };
  let button;
  if (isMp()) {
    const lg = session.league;
    const members = Object.values(lg.members);
    const ready = lg.members[session.uid]?.ready;
    button = `<button class="btn ${ready ? '' : 'primary'} block" data-act="ready">${ready ? 'Hazırsın ✓ Diğerleri bekleniyor' : 'Yeni sezona hazırım'} (${members.filter((m) => m.ready).length}/${members.length})</button>`;
  } else {
    button = state.gameOver ? '<button class="btn danger block" data-act="gameOverScreen">Devam</button>' : '<button class="btn primary block" data-act="newSeason">Yeni sezona başla</button>';
  }
  $app.innerHTML = `
    <div class="shell" style="padding-bottom:20px"><main>
      <div class="hero"><div class="ball">🏆</div><h1>${seasonLabel(s.season)} sezonu bitti</h1><p>Trendyol Süper Lig</p></div>
      <section class="card"><div class="row-flex">${teamKit(s.champion, 56)}<div class="grow"><div class="muted small">Şampiyon</div><b style="font-size:20px">${esc(T(s.champion).name)}</b></div></div></section>
      <section class="card">
        <div class="card-h">${esc(me().name)} <span>Hedef: ${esc(mine.target)}</span></div>
        <div style="font-size:28px;font-weight:900">${mine.pos}. sıra</div>
        <div class="note small">${esc(mine.verdict)}</div>
      </section>
      ${isMp() && s.humans ? `<section class="card"><div class="card-h">Arkadaşlar</div>${Object.entries(s.humans).sort((a, b) => a[1].pos - b[1].pos).map(([tid, h]) => `<div class="member">${teamKit(tid, 30)}<div class="grow"><b>${esc(h.manager || '')}</b><div class="muted small">${esc(T(tid).name)}</div></div><b>${h.pos}.</b></div>`).join('')}</section>` : ''}
      <section class="card small">
        ⚽ Gol kralı: <b>${esc(s.topScorer?.name || '-')}</b> (${s.topScorer?.v ?? 0})<br>
        🎯 Asist kralı: <b>${esc(s.topAssist?.name || '-')}</b> (${s.topAssist?.v ?? 0})<br>
        ⭐ Sezonun oyuncusu: <b>${esc(s.best?.name || '-')}</b> (${s.best?.v ?? '-'})<br>
        ⬇️ Küme düşen: ${s.relegated.map((id) => esc(T(id).name)).join(', ')}
        <div class="muted" style="margin-top:6px">Not: Bu sürümde lig 18 takımla devam eder; alt ligler henüz eklenmedi.</div>
      </section>
      <section class="card" style="padding:8px"><table class="tbl"><tbody>${table.map((r, i) => `<tr class="${r.id === uid ? 'me' : ''}"><td class="rank">${i + 1}</td><td class="tl"><div class="teamcell">${badge(r.id, 'sm')}${esc(T(r.id).name)}</div></td><td>${r.gd > 0 ? '+' : ''}${r.gd}</td><td><b>${r.pts}</b></td></tr>`).join('')}</tbody></table></section>
      ${button}
    </main></div>`;
}

function renderGameOver() {
  if (state.phase === 'seasonEnd' && state.seasonSummary && !view.seenSummary) return renderSeasonEnd();
  $app.innerHTML = `
    <div class="shell" style="padding-bottom:20px"><main>
      <div class="hero"><div class="ball">📋</div><h1>Görevden alındınız</h1><p>${esc(me().name)}</p></div>
      <section class="card"><div class="msg-body">${esc(state.gameOverText || '')}</div></section>
      <button class="btn primary block" data-act="newCareer">Yeni kariyer başlat</button>
    </main></div>`;
}

// ---------- Ortak kariyer bağlantısı ----------
function onMpState(s) {
  const uid = session.myTeamId();
  s.userTeamId = uid;
  state = s;
  if (pendingTactics && state.teams[uid]) Object.assign(state.teams[uid], structuredClone(pendingTactics));
  const played = new Set(state.fixtures.filter((f) => f.played && (f.home === uid || f.away === uid)).map((f) => f.id));
  const fresh = seenPlayed ? state.fixtures.filter((f) => played.has(f.id) && !seenPlayed.has(f.id)) : [];
  seenPlayed = played;
  render();
  if (fresh.length && $modal.hidden) openReport(fresh[fresh.length - 1].id);
}

async function connect(code) {
  const net = await getNet();
  session?.stop();
  state = null;
  live = null;
  pendingTactics = null;
  seenPlayed = null;
  mode = 'mp';
  mp.connecting = true;
  render();
  const s = new OnlineSession(net, code, {
    onLeague: () => {
      if (session !== s || mp.connecting) return;
      if (state) state.userTeamId = s.myTeamId();
      render();
    },
    onState: (st) => { if (session === s) onMpState(st); },
    toast,
  });
  session = s;
  loadRead(code);
  try {
    await s.start();
  } finally {
    mp.connecting = false;
  }
  if (!s.league || !s.league.members?.[net.uid]) {
    s.stop();
    session = null;
    mp.code = code;
    if (s.league) {
      mp.joinInfo = s.league;
      throw new UserError('Bu lige henüz katılmadın. Takımını seçip "Lige katıl"a bas.');
    }
    throw new UserError('Bu kodla bir lig bulunamadı.');
  }
  const store = onlineStore();
  const leagues = (store.leagues || []).filter((l) => l.code !== code);
  leagues.unshift({ code, teamId: s.myTeamId() });
  setOnlineStore({ active: code, name: s.myMember().name, leagues: leagues.slice(0, 10) });
  render();
}

async function mpRun(fn) {
  if (mp.busy) return;
  mp.busy = true;
  render();
  try {
    await fn();
  } catch (e) {
    console.error(e);
    toast(e instanceof UserError ? e.message : `Hata: ${e.message}`, 4500);
  } finally {
    mp.busy = false;
    render();
  }
}

function requireNameTeam() {
  mp.name = mp.name.trim();
  if (!mp.name) throw new UserError('Önce adını yaz.');
  if (!mp.teamId) throw new UserError('Bir takım seç.');
}

async function fetchJoinInfo() {
  try {
    const net = await getNet();
    mp.joinInfo = await net.getLeague(mp.code);
    if (!mp.joinInfo) toast('Bu kodla bir lig bulunamadı.');
    else if (mp.joinInfo.members?.[net.uid]) {
      await connect(mp.code);
      return;
    }
  } catch (e) {
    mp.joinInfo = null;
    toast(e instanceof UserError ? e.message : `Bağlantı hatası: ${e.message}`);
  }
  render();
}

async function shareInvite() {
  const code = session.code;
  const url = leagueLink(code);
  const text = `Süper Lig Menajer'de ortak kariyere katıl! Lig kodu: ${code}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Süper Lig Menajer', text, url });
      return;
    } catch (e) {
      if (e.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    toast('Davet linki kopyalandı. Arkadaşına gönder.');
  } catch {
    openModal(`${sheetHead('Arkadaş davet et')}<div class="code-big">${esc(code)}</div><div class="note small" style="word-break:break-all">${esc(url)}</div>`);
  }
}

async function toggleReady() {
  if (!session?.league) return;
  const mine = session.league.members[session.uid];
  if (!mine) return;
  try {
    if (!mine.ready) await flushTactics();
    await session.setReady(!mine.ready);
  } catch (e) {
    toast(`Bağlantı hatası: ${e.message}`);
  }
}

async function mpAction(type, payload) {
  toast('İşleniyor…', 30000);
  try {
    const r = await session.submit(type, payload, true);
    $toast.hidden = true;
    return r || { ok: true };
  } catch (e) {
    $toast.hidden = true;
    return { ok: false, text: `Bağlantı hatası: ${e.message}` };
  }
}

function leaveMp() {
  session?.stop();
  session = null;
  setOnlineStore({ active: null });
  mode = 'sp';
  mp.connecting = false;
  mp.joinInfo = null;
  pendingTactics = null;
  readIds = new Set();
  const saved = loadSave();
  state = saved?.teams?.[saved.userTeamId] ? migrateState(syncStatic(saved)) : null;
  closeModal();
  render();
}

// ---------- Olaylar ----------
function doContinue() {
  if (isMp()) return toggleReady();
  if (!state || live) return;
  closeModal();
  const res = continueGame(state);
  save();
  render();
  if (res.reason === 'userMatch') openPrematch(res.fixture);
  else if (res.reason === 'decision' || res.reason === 'news') openMessage(res.message.id);
}

const actions = {
  close: () => closeModal(),
  continue: doContinue,
  ready: () => toggleReady(),
  tab: (d) => { view.tab = d.tab; closeModal(); render(); window.scrollTo(0, 0); },
  squadTab: (d) => { view.squadTab = d.v; render(); },
  squadFilter: (d) => { view.squadFilter = d.v; render(); },
  leagueTab: (d) => { view.leagueTab = d.v; render(); },
  statTab: (d) => { view.statTab = d.v; render(); },
  transferTab: (d) => { view.transferTab = d.v; render(); },
  round: (d) => { view.round = Math.min(34, Math.max(1, (view.round || currentRound()) + Number(d.d))); render(); },
  player: (d) => openPlayer(d.id),
  team: (d) => openTeam(d.id),
  report: (d) => openReport(d.id),
  club: () => openClub(),
  msg: (d) => { openMessage(d.id); render(); },
  slot: (d) => openSlotPicker(Number(d.i)),
  pickSlot: (d) => pickSlot(Number(d.i), d.id || null),
  benchSlot: (d) => openSlotPicker(Number(d.i), true),
  pickBench: (d) => pickBench(Number(d.i), d.id || null),
  autoPick: () => {
    const t = me();
    const r = autoPick(squadOf(state, t.id), t.formation);
    t.lineup = r.lineup;
    t.bench = r.bench;
    tacticsChanged();
    render();
    toast('En iyi 11 seçildi.');
  },
  mentality: (d) => { me().mentality = d.v; tacticsChanged(); render(); },
  goTactics: () => { closeModal(); view.tab = 'squad'; view.squadTab = 'tactics'; render(); },
  bid: (d) => openBid(d.id, d.type),
  sendBid: async (d) => {
    const fee = Number(document.getElementById('fee')?.value || 0);
    const share = Number(document.getElementById('share')?.value ?? 100);
    const payload = { pid: d.id, type: d.type, fee, wageShare: share };
    const r = isMp() ? await mpAction('bid', payload) : withRng(() => makeBid(state, payload));
    if (!r.ok) return toast(r.error || r.text || 'Teklif gönderilemedi.', 4000);
    if (r.freeAgent) return openContract(d.id);
    closeModal();
    toast(isMp() ? 'Teklif gönderildi. Yanıt, lig ilerledikçe gelen kutuna düşecek.' : 'Teklif gönderildi. Kulüp 1-2 gün içinde yanıt verecek.', 3500);
    render();
  },
  contract: (d) => openContract(d.id, d.offer || null),
  sendContract: async (d) => {
    const wage = Number(document.getElementById('wage').value);
    const years = Number(document.getElementById('years').value);
    const payload = { pid: d.id, wage, years, offerId: d.offer || null };
    const r = isMp() ? await mpAction('contract', payload) : withRng(() => proposeContract(state, payload));
    const note = document.getElementById('cNote');
    if (r.result === 'accepted') {
      closeModal();
      toast(r.text, 3500);
      render();
      return;
    }
    const text = r.text || 'İşlem tamamlanamadı.';
    if (note) note.innerHTML = `<div class="note ${r.result === 'counter' ? '' : 'bad'}">${esc(text)}</div>`;
    else toast(text, 4000);
    if (r.result === 'counter' && r.wage) {
      const input = document.getElementById('wage');
      if (input && Number(input.max) < r.wage) input.max = r.wage;
    }
    if (r.result === 'walkaway') {
      document.querySelectorAll('[data-act="sendContract"]').forEach((b) => { b.disabled = true; });
      render();
    }
  },
  cancelNeg: async (d) => {
    if (isMp()) await mpAction('cancelNeg', { offerId: d.offer });
    else {
      cancelNegotiation(state, d.offer);
      save();
    }
    closeModal();
    render();
    toast('Transfer görüşmeleri sonlandırıldı.');
  },
  incoming: async (d) => {
    const fee = Number(document.getElementById('fee')?.value || 0);
    const r = isMp()
      ? await mpAction('incoming', { offerId: d.offer, action: d.a, fee })
      : withRng(() => respondIncoming(state, d.offer, d.a, fee));
    closeModal();
    render();
    toast(r.text || 'Tamam.', 3800);
  },
  counterReply: async (d) => {
    const r = isMp()
      ? await mpAction('counterReply', { offerId: d.offer, accept: d.a === '1' })
      : withRng(() => respondCounter(state, d.offer, d.a === '1'));
    closeModal();
    render();
    const m = myInbox().find((x) => x.needsAction && !x.resolved && x.offerId === d.offer);
    if (m) openMessage(m.id);
    else toast(r.text || 'Tamam.', 3500);
  },
  live: (d) => startLive(d.id),
  quick: (d) => quickMatch(d.id),
  mPause: () => { live.paused = !live.paused; save(); renderMatch(); schedule(); },
  mSpeed: (d) => { live.speed = Number(d.v); live.paused = false; renderMatch(); schedule(); },
  mSubs: () => openSubs(),
  mOut: (d) => openSubs(d.id),
  mIn: (d) => {
    const ok = live.m.substitute(live.m.userSide, d.out, d.id);
    closeModal();
    if (!ok) toast('Değişiklik yapılamadı.');
    save();
    renderMatch();
  },
  mMent: (d) => { live.m.setMentality(live.m.userSide, d.v); save(); renderMatch(); },
  mSkip: () => { clearTimeout(live.timer); live.m.playToEnd(); save(); renderMatch(); },
  mFinish: () => finishLive(),
  newSeason: () => {
    if (isMp()) return toggleReady();
    startNewSeason(state);
    save();
    view.round = null;
    view.tab = 'home';
    render();
    toast('Yeni sezon başladı! Transfer dönemi açık.');
  },
  gameOverScreen: () => { view.seenSummary = true; render(); },
  install: async () => {
    if (!deferredInstall) return;
    deferredInstall.prompt();
    try { await deferredInstall.userChoice; } catch { /* yok say */ }
    deferredInstall = null;
    render();
  },
  hideInstall: () => {
    try { localStorage.setItem('slm-install-hidden', '1'); } catch { /* yok say */ }
    render();
  },
  confirmNew: () => openModal(`${sheetHead('Yeni kariyer')}<p>Mevcut kariyeriniz silinecek. Emin misiniz?</p><div class="btns"><button class="btn" data-act="close">Vazgeç</button><button class="btn danger" data-act="newCareer">Evet, sil</button></div>`),
  newCareer: () => {
    try { localStorage.removeItem(SAVE_KEY); } catch { /* yok say */ }
    state = null;
    live = null;
    closeModal();
    pendingStart = { teamId: null, manager: '' };
    render();
  },
  pickTeam: (d) => { pendingStart.teamId = d.id; renderStart(); },
  startGame: () => {
    if (!pendingStart.teamId) return;
    state = newGame(pendingStart.teamId, pendingStart.manager.trim() || 'Teknik Direktör');
    save();
    view.tab = 'home';
    render();
    openMessage(state.inbox[0].id);
  },
  resume: () => {
    state = migrateState(syncStatic(loadSave()));
    render();
  },

  // Ortak kariyer
  mpOpen: () => {
    closeModal();
    save();
    live = null;
    state = null;
    mode = 'mp';
    render();
  },
  mpBack: () => leaveMp(),
  mpLeave: () => leaveMp(),
  mpPickTeam: (d) => { mp.teamId = d.id; render(); },
  mpCreate: () => mpRun(async () => {
    requireNameTeam();
    const net = await getNet();
    const code = await createLeague(net, { name: mp.name, teamId: mp.teamId });
    await connect(code);
  }),
  mpJoin: () => mpRun(async () => {
    requireNameTeam();
    const code = mp.code.trim().toUpperCase();
    if (code.length !== 6) throw new UserError('6 haneli lig kodunu yaz.');
    const net = await getNet();
    await joinLeague(net, code, { name: mp.name, teamId: mp.teamId });
    await connect(code);
  }),
  mpResume: (d) => mpRun(() => connect(d.code)),
  mpLobbyTeam: (d) => mpRun(() => setMemberTeam(session.net, session.code, d.id)),
  mpStart: () => mpRun(async () => {
    const ok = await startLeague(session.net, session.code);
    if (!ok) throw new UserError('Lig başlatılamadı.');
  }),
  mpShare: () => shareInvite(),
};

document.addEventListener('click', (e) => {
  if (e.target === $modal) return closeModal();
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = actions[el.dataset.act];
  if (fn) fn(el.dataset, el);
});

document.addEventListener('change', (e) => {
  const el = e.target;
  if (el.dataset.change === 'formation') changeFormation(el.value);
  if (el.dataset.change === 'tf') { view.tf[el.dataset.k] = el.value; render(); }
});

document.addEventListener('input', (e) => {
  const el = e.target;
  if (el.dataset.input === 'manager') pendingStart.manager = el.value;
  if (el.dataset.input === 'mpName') mp.name = el.value;
  if (el.dataset.input === 'mpCode') {
    const v = el.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    el.value = v;
    mp.code = v;
    mp.joinInfo = null;
    const joinBtn = document.querySelector('[data-act="mpJoin"]');
    if (joinBtn) joinBtn.disabled = v.length !== 6 || !onlineAvailable();
    if (v.length === 6) fetchJoinInfo();
  }
  if (el.dataset.input === 'fee') document.getElementById('feeLbl').textContent = fmtMoney(Number(el.value));
  if (el.dataset.input === 'wage') document.getElementById('wageLbl').textContent = fmtMoney(Number(el.value));
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$modal.hidden) closeModal();
});

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstall = e;
  if (!live && !isMp()) render();
});
window.addEventListener('appinstalled', () => {
  deferredInstall = null;
  toast('Oyun ana ekrana eklendi!');
  if (!live) render();
});

// Uygulama arka plana atılınca ya da kapatılınca anında kaydet; canlı maçı duraklat.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    if (live) {
      live.paused = true;
      clearTimeout(live.timer);
    }
    save();
    if (isMp()) flushTactics();
  } else if (live) {
    renderMatch();
  } else if (session) {
    session.tick();
  }
});
window.addEventListener('pagehide', () => save());

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// Açılış: davet linki → ortak kariyer; aktif lig → ona bağlan; yoksa tek oyunculu kayıt.
function boot() {
  const params = new URLSearchParams(location.search);
  const invite = (params.get('lig') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  if (params.has('lig')) {
    params.delete('lig');
    history.replaceState(null, '', `${location.pathname}${params.toString() ? `?${params}` : ''}`);
  }
  const store = onlineStore();
  if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});

  if (invite.length === 6 && onlineAvailable()) {
    mode = 'mp';
    mp.code = invite;
    mp.name = store.name || '';
    render();
    fetchJoinInfo();
    return;
  }
  if (store.active && onlineAvailable()) {
    mode = 'mp';
    mp.name = store.name || '';
    connect(store.active).catch((e) => {
      toast(e instanceof UserError ? e.message : `Lige bağlanılamadı: ${e.message}`, 4500);
      session = null;
      mp.connecting = false;
      render();
    });
    return;
  }

  const saved = loadSave();
  if (saved && saved.teams?.[saved.userTeamId]) {
    state = migrateState(syncStatic(saved));
    if (state.live) {
      seedRng(state.rng);
      const m = Match.restore(state, state.live);
      if (m) live = { m, speed: 1, paused: true, timer: null };
      else delete state.live;
    }
  }
  render();
  if (live) toast('Maç kaldığın dakikada duraklatıldı. Devam etmek için ▶ düğmesine dokun.', 4000);
}

boot();
