// Arayüz: ekranlar, modallar, canlı maç, kayıt ve ortak kariyer.
import { TEAMS } from './data/teams.js';
import { COUNTRY_NAMES_TR } from './data/europe.js';
import { LEAGUE_LABEL } from './data/world.js';
import {
  newGame, continueGame, standings, nextUserFixture, onUserMatchPlayed, startNewSeason, currentWindow, migrateState,
  addHuman, makeBoard, leagueRounds,
} from './engine/game.js';
import { Match, squadOf, prepareLineup } from './engine/match.js';
import { FORMATIONS, MENTALITIES, autoPick, teamRating } from './engine/tactics.js';
import {
  POS_TR, POS_LONG, POS_GROUP, POSITIONS, posFit, playerValue, avgRating, moraleLabel, isAvailable,
} from './engine/players.js';
import {
  makeBid, proposeContract, contractDemand, respondIncoming, respondCounter, cancelNegotiation, playerRole, ROLE_TR,
} from './engine/transfers.js';
import { isHuman, NEWS_CATS } from './engine/inbox.js';
import { COMPS, UEFA, TR_LEAGUES, STAGE_TR, fixtureLabel, tieScore } from './engine/comps.js';
import {
  ACHIEVEMENTS, TALKS, careerOf, fansOf, fansLabel, needsPress, pressConference, answerPress, talkToPlayer, toggleShortlist,
  jobOffers, takeJob, managerRep,
} from './engine/career.js';
import { fmtDate, fmtMoney, daysBetween, seedRng, getRngState, roundMoney } from './engine/util.js';
import {
  OnlineSession, getNet, onlineAvailable, createLeague, joinLeague, setMemberTeam, startLeague, leagueLink, UserError, MAX_MEMBERS,
  gzipB64, gunzipB64,
} from './online/online.js';

const SAVE_KEY = 'slm-save-v3';
const OLD_SAVE_KEY = 'slm-save-v1';
const ONLINE_KEY = 'slm-online';
const $app = document.getElementById('app');
const $modal = document.getElementById('modal');
const $toast = document.getElementById('toast');

let state = null;
let live = null;
let savedGame = null; // { state } veya { old } (önceki sürümden kayıt)
let pendingStart = { teamId: null, manager: '' };
const view = {
  tab: 'home',
  squadTab: 'list',
  squadFilter: 'ALL',
  comp: null,
  compTab: 'table',
  statTab: 'goals',
  round: null,
  country: null,
  newsCat: 'all',
  transferTab: 'search',
  tf: { pos: '', maxAge: '', minOvr: '', maxVal: '', team: '', country: '', q: '' },
  press: null,
};

// Ortak kariyer
let mode = 'sp';
let session = null;
const mp = { name: '', teamId: null, code: '', joinInfo: null, busy: false, connecting: false };
let pendingTactics = null;
let tacticsTimer = null;
let seenPlayed = null;
let readIds = new Set();
let mpLive = { open: false, fid: null, data: null, autoOpened: null };

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
const compShort = (c) => COMPS[c]?.short || c;

const FLAG_SPECIAL = {
  EN: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}',
  SC: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}',
  WL: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}',
  NX: '🇬🇧',
};
function flag(code) {
  if (!code || !/^[A-Z]{2}$/.test(code)) return '';
  if (FLAG_SPECIAL[code]) return FLAG_SPECIAL[code];
  return String.fromCodePoint(...[...code].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));
}
const COUNTRY = {
  ...COUNTRY_NAMES_TR,
  BR: 'Brezilya', NG: 'Nijerya', SN: 'Senegal', CI: 'Fildişi Sahili', CM: 'Kamerun', GH: 'Gana', ML: 'Mali', GN: 'Gine',
  MA: 'Fas', TN: 'Tunus', EG: 'Mısır', XK: 'Kosova', MK: 'Kuzey Makedonya', ME: 'Karadağ', UZ: 'Özbekistan', KR: 'Güney Kore',
  IS: 'İzlanda', IE: 'İrlanda', CO: 'Kolombiya', AR: 'Arjantin', UY: 'Uruguay', CL: 'Şili', VE: 'Venezuela', PA: 'Panama',
  HN: 'Honduras', JM: 'Jamaika', CW: 'Curaçao', SR: 'Surinam', GW: 'Gine-Bissau', CV: 'Yeşil Burun', AO: 'Angola', CD: 'Kongo DC',
  CG: 'Kongo', GM: 'Gambiya', TD: 'Çad', BJ: 'Benin', LR: 'Liberya', TZ: 'Tanzanya', MG: 'Madagaskar', KM: 'Komorlar', AE: 'BAE',
  JO: 'Ürdün', SY: 'Suriye', QA: 'Katar', DZ: 'Cezayir', AU: 'Avustralya', BI: 'Burundi', BF: 'Burkina Faso', BY: 'Belarus',
  CF: 'Orta Afrika Cumhuriyeti', CA: 'Kanada', CU: 'Küba', DO: 'Dominik Cumhuriyeti', EC: 'Ekvador', EE: 'Estonya',
  FO: 'Faroe Adaları', GA: 'Gabon', GP: 'Guadeloupe', GT: 'Guatemala', HT: 'Haiti', ID: 'Endonezya', IR: 'İran', IQ: 'Irak',
  JP: 'Japonya', KE: 'Kenya', LY: 'Libya', LU: 'Lüksemburg', MD: 'Moldova', MX: 'Meksika', MZ: 'Mozambik', MR: 'Moritanya',
  MQ: 'Martinik', NE: 'Nijer', NI: 'Nikaragua', NX: 'Kuzey İrlanda', NZ: 'Yeni Zelanda', PK: 'Pakistan', PE: 'Peru',
  PH: 'Filipinler', PS: 'Filistin', PY: 'Paraguay', RW: 'Ruanda', SL: 'Sierra Leone', TG: 'Togo', TT: 'Trinidad ve Tobago',
  UG: 'Uganda', WL: 'Galler', ZA: 'Güney Afrika', ZM: 'Zambiya', ZW: 'Zimbabve', GQ: 'Ekvator Ginesi', CR: 'Kosta Rika',
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
  else if (kit.pattern === 'hoops') for (let y = 20; y < 100; y += 18) body += `<rect x="0" y="${y}" width="100" height="9" fill="${c2}"/>`;
  else if (kit.pattern === 'halves') body = `<rect x="50" y="0" width="50" height="100" fill="${c2}"/>`;
  else if (kit.pattern === 'band') body = `<rect x="0" y="42" width="100" height="16" fill="${c2}"/>`;
  else if (kit.pattern === 'vband') body = `<rect x="40" y="0" width="20" height="100" fill="${c2}"/>`;
  const stroke = kit.pattern === 'plain' ? c2 : 'rgba(0,0,0,.35)';
  return `<svg class="kit" width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true">`
    + `<defs><clipPath id="${id}"><path d="${shirt}"/></clipPath></defs>`
    + `<g clip-path="url(#${id})"><rect width="100" height="100" fill="${c1}"/>${body}</g>`
    + `<path d="${shirt}" fill="none" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`
    + `<path d="M42 5 Q50 13 58 5" fill="none" stroke="${c2}" stroke-width="4"/></svg>`;
}
const teamKit = (teamId, size) => kitSvg((state && T(teamId)?.kit) || TEAMS.find((t) => t.id === teamId)?.kit, size);
const teamNameStatic = (teamId) => (state && T(teamId)?.name) || TEAMS.find((t) => t.id === teamId)?.name || '';

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
  if (p.injury) s += '<span title="Sakat">🚑</span>';
  if (p.susp > 0) s += '<span title="Cezalı">🟥</span>';
  if (p.loan) s += '<span title="Kiralık">🔁</span>';
  if (!p.loan && p.teamId && p.contractEnd <= state.season + 1) s += '<span title="Sözleşmesi bitiyor">📄</span>';
  if (state.shortlist?.[state.userTeamId]?.includes(p.id)) s += '<span title="Takip listende">⭐</span>';
  return s;
}
const seasonLabel = (s) => `${s}-${String(s + 1).slice(2)}`;
const teamLeagueLabel = (t) => (t.country === 'TR' ? LEAGUE_LABEL[t.league] || '' : `${flag(t.country)} ${LEAGUE_LABEL[t.country] || COUNTRY[t.country] || t.country}`);

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

// ---------- Kayıt (sıkıştırılmış) ----------
let saveTimer = null;
let saving = false;
let saveAgain = false;
function save() {
  if (!state || isMp()) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flushSave, 350);
}
async function flushSave() {
  clearTimeout(saveTimer);
  if (!state || isMp()) return;
  if (saving) {
    saveAgain = true;
    return;
  }
  saving = true;
  try {
    if (live) state.live = live.m.snapshot();
    else delete state.live;
    const text = JSON.stringify(state);
    const b64 = await gzipB64(text);
    localStorage.setItem(SAVE_KEY, `gz1:${b64}`);
    try { localStorage.removeItem(OLD_SAVE_KEY); } catch { /* yok say */ }
    savedGame = { state };
  } catch (e) {
    console.warn(e);
    toast('Oyun kaydedilemedi (tarayıcı depolaması dolu olabilir).');
  } finally {
    saving = false;
    if (saveAgain) {
      saveAgain = false;
      flushSave();
    }
  }
}

async function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw && raw.startsWith('gz1:')) {
      const s = migrateState(JSON.parse(await gunzipB64(raw.slice(4))));
      if (s) return { state: s };
    }
    const old = localStorage.getItem(OLD_SAVE_KEY);
    if (old) {
      const o = JSON.parse(old);
      if (o?.userTeamId) return { old: o };
    }
  } catch (e) {
    console.warn('kayıt okunamadı', e);
  }
  return null;
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
  if (mpLive.open && mpLive.data && !mpLive.data.finished) return renderMpLive();
  if (state.phase === 'seasonEnd' && state.seasonSummary) return renderSeasonEnd();
  return renderGame();
}

function readyButton() {
  if (mpLive.data && !mpLive.data.finished && mpLive.data.matches?.length) return '<button class="btn-continue live" data-act="mpLiveOpen">🔴 Canlı</button>';
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
  else if (view.tab === 'comps') body = compsHtml();
  else if (view.tab === 'transfer') body = transferHtml();
  else if (view.tab === 'news') body = newsHtml();
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
        ${navBtn('comps', '🏆', 'Turnuvalar')}
        ${navBtn('transfer', '💱', 'Transfer')}
        ${navBtn('news', '📰', 'Gündem')}
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
  const saved = savedGame?.state;
  const old = savedGame?.old;
  const teams = TEAMS.slice().sort((a, b) => b.rep - a.rep);
  const stars = (rep) => '★'.repeat(Math.max(1, Math.round((rep - 40) / 10)));
  const savedTeam = saved?.teams?.[saved.userTeamId];
  $app.innerHTML = `
    <div class="shell" style="padding-bottom:0">
      <main>
        <div class="hero">
          <img class="logo" src="icons/logo.svg" alt="3-5-2 logosu" width="96" height="96">
          <h1>3-5-2</h1>
          <p>Süper Lig, 1. Lig, Türkiye Kupası ve Avrupa kupaları · Gerçek kulüpler ve kadrolar</p>
        </div>
        ${installBanner()}
        ${savedTeam ? `
          <section class="card">
            <div class="card-h">Kayıtlı kariyer</div>
            <div class="row-flex">
              ${kitSvg(savedTeam.kit, 48)}
              <div class="grow">
                <div style="font-weight:700">${esc(saved.managers?.[saved.userTeamId] || saved.manager)} · ${esc(savedTeam.name)}</div>
                <div class="muted small">${fmtDate(saved.date)} · ${seasonLabel(saved.season)} sezonu</div>
              </div>
            </div>
            <button class="btn primary block" data-act="resume">Kaldığın yerden devam et</button>
          </section>` : ''}
        ${old && !savedTeam ? `
          <section class="card">
            <div class="card-h">Önceki sürümden kariyer</div>
            <div class="small">Oyun büyük bir güncelleme aldı: Avrupa kupaları, Türkiye Kupası, alt ligler, gerçek Avrupa kadroları ve Gündem eklendi. Eski kayıt bu dünyaya aktarılamıyor.</div>
            <button class="btn primary block" data-act="oldRestart">${esc(old.managers?.[old.userTeamId] || old.manager || 'Teknik Direktör')} · ${esc(teamNameStatic(old.userTeamId))} ile yeni sürümde başla</button>
          </section>` : ''}
        <section class="card online">
          <div class="row-flex"><span style="font-size:26px">👥</span><div class="grow"><b>Arkadaşlarınla ortak kariyer</b><div class="muted small">Aynı dünyada her biriniz bir takımı yönetir, birbirinize transfer teklifi yaparsınız.</div></div></div>
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
          Kadrolar Eylül 2026 itibarıyla Wikipedia/Wikidata ve kulüp duyurularından derlenmiştir. Oyuncu güç değerleri bu oyuna özel tahminlerdir.<br>
          Resmî bir ürün değildir; kulüp, lig ve UEFA markalarıyla bağlantısı yoktur. Açık kaynak: <a href="https://github.com/kivancsh/352" target="_blank" rel="noopener">GitHub</a>
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
    <div class="hero"><div class="ball">👥</div><h1>Ortak Kariyer</h1><p>Aynı dünyada arkadaşlarınla teknik direktörlük</p></div>
    ${!avail ? '<section class="card"><div class="note bad small">Çevrimiçi mod henüz ayarlanmadı. Birazdan tekrar dene.</div></section>' : ''}
    ${leagues.length ? `<section class="card"><div class="card-h">Liglerim</div><div class="list">${leagues.map((l) => `
      <button class="item" data-act="mpResume" data-code="${esc(l.code)}">${kitSvg(TEAMS.find((t) => t.id === l.teamId)?.kit, 32)}
        <div class="grow"><b>${esc(l.code)}</b><div class="sub">${esc(teamNameStatic(l.teamId))}</div></div><span class="tag ok">Aç</span></button>`).join('')}</div></section>` : ''}
    <section class="card">
      <div class="card-h">Nasıl çalışır?</div>
      <div class="small muted">Biri lig kurar ve kodu paylaşır, diğerleri kodla katılır. Herkes kendi takımını yönetir; herkes "Hazırım" dediğinde oyun bir sonraki maç gününe ilerler. Lig, kupa ve Avrupa maçları canlı oynanır.</div>
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
  const hasMatchSoon = state.fixtures.some((f) => !f.played && f.date >= state.date && (f.home === myTeam || f.away === myTeam) && daysBetween(state.date, f.date) <= 3);
  let text = 'Herkes "Hazırım" dediğinde oyun bir sonraki durağa kadar ilerler.';
  if (stop?.reason === 'matchday') text = hasMatchSoon ? '⚽ Maç günü! Kadronu ve taktiğini ayarla, sonra Hazırım\'a bas.' : '⚽ Maç günü. Hazır olduğunda Hazırım\'a bas.';
  else if (stop?.reason === 'week') text = '📅 Bir hafta geçti. Transferlerini ve kadronu gözden geçir, sonra Hazırım\'a bas.';
  else if (stop?.reason === 'newSeason') text = '🆕 Yeni sezon başladı, transfer dönemi açık.';
  const liveNow = mpLive.data && !mpLive.data.finished && mpLive.data.matches?.length;
  if (liveNow) text = '🔴 Maçlar şu an canlı oynanıyor.';
  const processing = lg.processor && lg.processor.until > Date.now();
  const members = Object.entries(lg.members).sort((a, b) => a[1].joinedAt - b[1].joinedAt);
  return `<section class="card online">
    <div class="card-h">Ortak kariyer <span>Kod: <b>${esc(lg.code)}</b></span></div>
    <div class="small" style="margin-bottom:6px">${text}</div>
    ${liveNow ? '<button class="btn primary block" data-act="mpLiveOpen" style="margin:4px 0 8px">🔴 Canlı maçı izle</button>' : ''}
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

// Kullanıcının bu sezon katıldığı organizasyonlardaki durumu
function seasonStatusHtml(tid) {
  const t = T(tid);
  const rows = [];
  const lt = standings(state, t.league);
  const pos = lt.findIndex((r) => r.id === tid) + 1;
  rows.push([COMPS[t.league].icon, compShort(t.league), lt[pos - 1]?.p ? `${pos}. sıra · ${lt[pos - 1].pts} puan` : 'Sezon başlıyor', t.league]);
  const cupFx = state.fixtures.filter((f) => f.comp === 'ZTK' && (f.home === tid || f.away === tid));
  const Z = state.cups?.ZTK;
  if (cupFx.length || Z?.entry) {
    let txt;
    const nextCup = cupFx.find((f) => !f.played);
    const last = nextCup || cupFx[cupFx.length - 1];
    const tie = last && state.ties[last.tie];
    if (Z?.winner === tid) txt = '🏆 Şampiyon';
    else if (tie?.winner && tie.winner !== tid) txt = `${STAGE_TR[tie.stage]} turunda elendi`;
    else if (last && !last.played) txt = `${STAGE_TR[last.stage]}: ${esc(T(last.home === tid ? last.away : last.home).name)} (${fmtDate(last.date).slice(0, -5)})`;
    else if (tie?.winner === tid) txt = `${STAGE_TR[tie.stage]} geçildi, kura bekleniyor`;
    else {
      const entry = Z.entry?.R3?.includes(tid) ? '3. Tur' : Z.entry?.R4?.includes(tid) ? '4. Tur' : Z.entry?.R16?.includes(tid) ? 'Son 16' : '1. Tur';
      txt = `${entry} turunda kupaya katılacak`;
    }
    rows.push([COMPS.ZTK.icon, compShort('ZTK'), txt, 'ZTK']);
  }
  for (const c of UEFA) {
    const fx = state.fixtures.filter((f) => f.comp === c && (f.home === tid || f.away === tid));
    const U = state.uefa?.[c];
    const inLP = U?.teams?.includes(tid);
    const queued = Object.entries(state.qual?.[c] || {}).find(([k, v]) => Array.isArray(v) && v.includes(tid) && k !== 'foreign');
    if (!fx.length && !inLP && !queued) continue;
    let txt;
    const nextFx = fx.find((f) => !f.played);
    const last = nextFx || fx[fx.length - 1];
    const tie = last?.tie && state.ties[last.tie];
    if (U?.winner === tid) txt = '🏆 Şampiyon';
    else if (last && !last.played && !(inLP && U.stage === 'LP' && last.stage === 'LP')) txt = `${STAGE_TR[last.stage]}: ${esc(T(last.home === tid ? last.away : last.home).name)} (${fmtDate(last.date).slice(0, -5)})`;
    else if (tie?.winner && tie.winner !== tid) txt = `${STAGE_TR[tie.stage]} turunda elendi`;
    else if (inLP && U.stage === 'LP') {
      const tb = standings(state, c);
      const i = tb.findIndex((r) => r.id === tid);
      const nx = last && !last.played ? ` · Sıradaki: ${esc(T(last.home === tid ? last.away : last.home).name)} (${fmtDate(last.date).slice(0, -5)})` : '';
      txt = tb[i]?.p ? `Lig aşaması ${i + 1}. sıra · ${tb[i].pts} puan${nx}` : `Lig aşaması${nx}`;
    } else if (inLP && U.table) {
      const i = U.table.indexOf(tid);
      txt = i >= 24 ? `Lig aşamasında ${i + 1}. sırada elendi` : 'Eleme turlarında';
    } else if (queued) txt = queued[0] === 'LP' ? 'Lig aşaması kurası bekleniyor' : `${STAGE_TR[queued[0]]} kurası bekleniyor`;
    else txt = 'Kura bekleniyor';
    rows.push([COMPS[c].icon, compShort(c), txt, c]);
  }
  return rows.map(([ic, name, txt, c]) => `<button class="status-line item" data-act="goComp" data-v="${c}" style="width:100%;background:none;border:0;border-bottom:1px solid var(--line);color:inherit;text-align:left"><span>${ic}</span><b style="width:118px">${esc(name)}</b><span class="grow muted">${txt}</span></button>`).join('');
}

function upcomingEvents(limit = 3) {
  const LABEL = { uefaDraw: (e) => `${compShort(e.comp)} lig aşaması kurası`, qualDraw: (e) => `UEFA ${STAGE_TR[e.stage]} kuraları`, uefaKPO: (e) => `${compShort(e.comp)} play-off kurası`, uefaR16: (e) => `${compShort(e.comp)} son 16 kurası`, cupDraw: (e) => `Türkiye Kupası ${STAGE_TR[e.stage]} kurası`, cupFinal: () => 'Türkiye Kupası finali belirleniyor', seasonEnd: () => 'Sezon sonu' };
  const seen = new Set();
  return (state.cal || []).filter((e) => !e.done && LABEL[e.kind]).map((e) => ({ date: e.date, text: LABEL[e.kind](e) }))
    .filter((e) => { const k = `${e.date}${e.text}`; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, limit);
}

function newsItem(n, mineId = state.userTeamId) {
  const cat = NEWS_CATS[n.cat] || NEWS_CATS.general;
  const mine = n.teams?.includes(mineId);
  return `<div class="news-row ${mine ? 'mine' : ''}"><span class="ic">${cat.icon}</span><div class="grow">${n.title ? `<b>${esc(n.title)}</b>` : ''}${esc(n.text)}<small>${fmtDate(n.date)} · ${cat.label}</small></div></div>`;
}

function homeHtml() {
  const t = me();
  const fx = nextUserFixture(state);
  const table = standings(state, t.league);
  const pos = table.findIndex((r) => r.id === t.id) + 1;
  const row = table[pos - 1] || { p: 0, pts: 0, gf: 0, ga: 0 };
  const win = currentWindow(state);
  const board = myBoard();
  const confCls = board.confidence < 30 ? 'bad' : board.confidence < 55 ? 'warn' : '';
  const fans = fansOf(state, t.id);
  const fansCls = fans < 30 ? 'bad' : fans < 50 ? 'warn' : '';

  let next = '';
  if (fx) {
    const days = daysBetween(state.date, fx.date);
    const oppId = fx.home === t.id ? fx.away : fx.home;
    const press = needsPress(state, t.id, fx) && days <= 3;
    next = `
      <section class="card">
        <div class="card-h">Sıradaki maç <span>${esc(fixtureLabel(fx))} · ${fmtDate(fx.date, true)}</span></div>
        <div class="vs">
          ${teamCol(fx.home)}
          <div class="vs-mid">${days <= 0 ? 'BUGÜN' : days === 1 ? 'Yarın' : `${days} gün`}<small>${fx.neutral ? 'Tarafsız saha' : fx.home === t.id ? 'İç saha' : 'Deplasman'}</small></div>
          ${teamCol(fx.away)}
        </div>
        <div class="muted small center">${esc(fx.venue || T(fx.home).stadium)}${isMp() && isHuman(state, oppId) ? ` · Rakip teknik direktör: <b>${esc(managerName(oppId))}</b>` : ''}</div>
        ${press ? '<button class="btn block" data-act="press" style="border-color:var(--warn)">🎤 Basın toplantısına katıl</button>' : ''}
        ${isMp()
          ? '<button class="btn block" data-act="goTactics">Kadro ve taktiği ayarla</button>'
          : `<button class="btn primary block" data-act="continue">${days <= 0 ? 'Maç önü' : 'Maç gününe ilerle'}</button>`}
      </section>`;
  }

  const sq = squadOf(state, t.id);
  const out = sq.filter((p) => p.injury || p.susp > 0);
  const recent = state.fixtures.filter((f) => f.played && (f.home === t.id || f.away === t.id)).slice(-3).reverse();
  const myNews = state.news.filter((n) => n.teams?.includes(t.id) || ['europe', 'cup', 'award'].includes(n.cat)).slice(0, 5);
  const up = upcomingEvents();

  return `
    ${win ? `<section class="card" style="padding:10px 14px"><div class="row-flex"><span>💱</span><div class="grow small"><b>${win.label} açık</b> · ${Math.max(0, daysBetween(state.date, win.end))} gün kaldı</div><button class="btn" style="padding:6px 10px" data-act="tab" data-tab="transfer">Pazara git</button></div></section>` : ''}
    ${next}
    <section class="card">
      <div class="kpis">
        <div class="kpi"><b>${row.p ? `${pos}.` : '–'}</b><span>${esc(compShort(t.league))}</span></div>
        <div class="kpi"><b>${row.pts}</b><span>Puan</span></div>
        <div class="kpi"><b>${row.gf}:${row.ga}</b><span>Gol</span></div>
      </div>
      <div class="spacer"></div>
      <div class="row-flex small"><span class="muted grow">Son maçlar</span>${(t.form || []).map((f) => `<span class="form-chip form-${f}">${f}</span>`).join('') || '<span class="muted">Henüz maç yok</span>'}</div>
    </section>
    <section class="card"><div class="card-h">Bu sezon <span>${seasonLabel(state.season)}</span></div>${seasonStatusHtml(t.id)}</section>
    <section class="card" data-act="club" style="cursor:pointer">
      <div class="card-h">Yönetim <span>Hedef: ${esc(board.label)}</span></div>
      <div class="row-flex"><div class="grow"><div class="bar ${confCls}"><i style="width:${Math.round(board.confidence)}%"></i></div></div><b class="small">%${Math.round(board.confidence)}</b></div>
      <div class="card-h" style="margin-top:12px">Taraftar <span>${fansLabel(fans)}</span></div>
      <div class="row-flex"><div class="grow"><div class="bar ${fansCls}"><i style="width:${Math.round(fans)}%"></i></div></div><b class="small">%${Math.round(fans)}</b></div>
      <div class="muted small" style="margin-top:6px">Kulüp, kariyer, kupa dolabı ve başarımlar için dokunun</div>
    </section>
    ${recent.length ? `<section class="card"><div class="card-h">Son sonuçlar</div>${recent.map((f) => fxRow(f, true)).join('')}</section>` : ''}
    ${out.length ? `<section class="card"><div class="card-h">Eksikler <span>${out.length} oyuncu</span></div><div class="list">${out.map((p) => `
      <button class="item" data-act="player" data-id="${p.id}">${posPill(p.pos)}<div class="grow"><div class="name ellipsis">${esc(p.name)}</div><div class="sub">${p.injury ? `🚑 ${esc(p.injury.name)} · ${p.injury.days} gün` : `🟥 ${p.susp} maç ceza`}</div></div>${ovrPill(p.ovr)}</button>`).join('')}</div></section>` : ''}
    <section class="card">
      <div class="card-h">Gündem <span><button class="btn" style="padding:4px 10px" data-act="tab" data-tab="news">Tümü</button></span></div>
      ${up.length ? `<div class="upcoming" style="margin-bottom:6px">Yaklaşan: ${up.map((e) => `<b>${fmtDate(e.date).slice(0, -5)}</b> ${esc(e.text)}`).join(' · ')}</div>` : ''}
      ${myNews.map((n) => newsItem(n)).join('') || '<div class="muted small">Henüz haber yok.</div>'}
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
  const loanedOut = Object.values(state.players).filter((p) => p.loan?.fromTeam === t.id);
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
    </section>
    ${loanedOut.length ? `<section class="card" style="padding:4px 12px"><div class="card-h" style="padding-top:8px">Kiralıkta olan oyuncularımız</div><div class="list">${loanedOut.map((p) => `
      <button class="item" data-act="player" data-id="${p.id}">${posPill(p.pos)}<div class="grow"><div class="name ellipsis">${esc(p.name)}</div><div class="sub">${esc(T(p.teamId)?.name || p.abroad || '')} · ${p.loan.until.slice(0, 4)} yazında dönecek</div></div>${ovrPill(p.ovr)}</button>`).join('')}</div></section>` : ''}`;
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
          <div class="sub">${p.loan ? `Kiralık (%${p.loan.wageShare ?? 100} sizde) · ${esc(p.loan.fromName)} · ${p.loan.until.slice(0, 4)} yazına kadar` : `Sözleşme: Haziran ${p.contractEnd}`}</div></div>
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
      <div class="muted small" style="margin-top:8px">Değiştirmek için bir oyuncuya dokunun. Çerçeve rengi mevki uyumunu gösterir: yeşil iyi, sarı idare eder, kırmızı zayıf. Yoğun fikstürde yorgun oyuncuları dinlendirmeyi unutmayın.</div>
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
      <div class="list">${reserves.map((p) => `<button class="item" data-act="player" data-id="${p.id}">${posPill(p.pos)}<div class="grow"><div class="name ellipsis">${esc(p.name)} ${statusIcons(p)}</div></div>${condBar(p.condition)}${ovrPill(p.ovr)}</button>`).join('') || '<div class="muted small">Herkes maç kadrosunda.</div>'}</div>
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
            <div class="sub">${!isAvailable(p) ? (p.injury ? `🚑 ${p.injury.days} gün` : `🟥 ${p.susp} maç`) : `Kondisyon %${Math.round(p.condition)} · Moral ${moraleLabel(p.morale)}`}${slotPos && posFit(p.pos, slotPos) < 1 ? ` · Uyum %${Math.round(posFit(p.pos, slotPos) * 100)}` : ''}</div></div>
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
    if (li >= 0) { t.lineup[li] = cur; t.lineup[i] = pid; } else if (bi >= 0) {
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

// ---------- Turnuvalar ----------
function fxRow(f, showLabel = false) {
  const uid = state.userTeamId;
  const mine = f.home === uid || f.away === uid;
  const extra = f.pens ? `<span class="fx-pens">pen. ${f.pens[0]}-${f.pens[1]}</span>` : f.et ? '<span class="fx-pens">uzt.</span>' : '';
  const sc = f.played ? `<span class="sc">${f.hg} - ${f.ag}${extra}</span>` : `<span class="sc tbd">${fmtDate(f.date).slice(0, -5)}</span>`;
  return `${showLabel ? `<div class="fx-label">${esc(fixtureLabel(f))}</div>` : ''}<button class="fx ${mine ? 'me' : ''}" ${f.played ? `data-act="report" data-id="${f.id}"` : `data-act="team" data-id="${f.home === uid ? f.away : f.home}"`}>
    <span class="h"><span class="ellipsis">${esc(T(f.home).name)}</span>${badge(f.home, 'sm')}</span>${sc}<span class="a">${badge(f.away, 'sm')}<span class="ellipsis">${esc(T(f.away).name)}</span></span>
  </button>`;
}

function compChips() {
  const t = me();
  const order = [t.league, ...TR_LEAGUES.filter((x) => x !== t.league), 'ZTK', ...UEFA, 'WORLD', 'HIST'];
  const label = { WORLD: '🌍 Avrupa kulüpleri', HIST: '📜 Geçmiş' };
  return `<div class="chips">${order.map((c) => `<button class="chip ${view.comp === c ? 'on' : ''}" data-act="goComp" data-v="${c}">${label[c] || `${COMPS[c].icon} ${esc(compShort(c))}`}</button>`).join('')}</div>`;
}

function subTabs(list) {
  return `<div class="tabs">${list.map(([k, v]) => `<button class="${view.compTab === k ? 'on' : ''}" data-act="compTab" data-v="${k}">${v}</button>`).join('')}</div>`;
}

function compsHtml() {
  if (!view.comp) view.comp = me().league;
  const c = view.comp;
  let body;
  if (c === 'WORLD') body = worldHtml();
  else if (c === 'HIST') body = historyHtml();
  else if (TR_LEAGUES.includes(c)) body = leagueCompHtml(c);
  else if (c === 'ZTK') body = cupHtml();
  else body = uefaHtml(c);
  return compChips() + body;
}

function tableHtml(comp, rows, zone, title) {
  return `<section class="card" style="padding:8px">
    <div class="muted small" style="padding:4px 6px 8px">${esc(title)}</div>
    <div class="table-wrap"><table class="tbl">
      <thead><tr><th>#</th><th class="tl">Takım</th><th>O</th><th>G</th><th>B</th><th>M</th><th>AV</th><th>P</th></tr></thead>
      <tbody>${rows.map((r, i) => `
        <tr class="${r.id === state.userTeamId ? 'me' : ''} ${zone(i, rows.length)}" data-act="team" data-id="${r.id}">
          <td class="rank">${i + 1}</td>
          <td class="tl"><div class="teamcell">${badge(r.id, 'sm')}<span class="ellipsis">${esc(T(r.id).name)}</span>${isHuman(state, r.id) && isMp() ? `<span class="tag human">${esc(managerName(r.id))}</span>` : ''}</div></td>
          <td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf - r.ga > 0 ? '+' : ''}${r.gf - r.ga}</td><td><b>${r.pts}</b></td>
        </tr>`).join('')}</tbody>
    </table></div>
  </section>`;
}

function statsForComp(comp) {
  const idx = view.statTab === 'assists' ? 2 : view.statTab === 'rating' ? 3 : 1;
  let rows = Object.values(state.players).filter((p) => p.teamId && p.stats.c?.[comp]?.[0] > 0);
  const val = (p) => (idx === 3 ? (p.stats.c[comp][3] / p.stats.c[comp][0]).toFixed(2) : p.stats.c[comp][idx]);
  if (idx === 3) {
    const minApps = Math.max(1, Math.floor(Math.max(...rows.map((p) => p.stats.c[comp][0]), 0) / 3));
    rows = rows.filter((p) => p.stats.c[comp][0] >= minApps).sort((a, b) => val(b) - val(a));
  } else rows.sort((a, b) => b.stats.c[comp][idx] - a.stats.c[comp][idx] || b.stats.c[comp][3 - idx] - a.stats.c[comp][3 - idx]);
  rows = rows.slice(0, 25);
  return `
    <div class="seg" style="margin-bottom:12px">${[['goals', 'Gol'], ['assists', 'Asist'], ['rating', 'Ort. puan']].map(([k, v]) => `<button class="${view.statTab === k ? 'on' : ''}" data-act="statTab" data-v="${k}">${v}</button>`).join('')}</div>
    <section class="card" style="padding:4px 12px"><div class="list">
      ${rows.map((p, i) => `<button class="item" data-act="player" data-id="${p.id}"><b class="muted" style="width:20px">${i + 1}</b>${badge(p.teamId, 'sm')}<div class="grow"><div class="name ellipsis">${esc(p.name)}</div><div class="sub">${esc(T(p.teamId).name)} · ${p.stats.c[comp][0]} maç</div></div><b style="font-size:17px">${val(p)}</b></button>`).join('') || '<div class="muted small" style="padding:12px 0">Henüz maç oynanmadı.</div>'}
    </div></section>`;
}

function roundNav(comp, max, label) {
  const r = view.round;
  return `<div class="round-nav"><button data-act="round" data-d="-1" data-max="${max}" ${r <= 1 ? 'disabled' : ''}>‹</button><b>${label(r)}</b><button data-act="round" data-d="1" data-max="${max}" ${r >= max ? 'disabled' : ''}>›</button></div>`;
}

function leagueCompHtml(comp) {
  const tabs = subTabs([['table', 'Puan durumu'], ['fixtures', 'Fikstür'], ['stats', 'İstatistikler']]);
  const max = leagueRounds(comp, state);
  if (view.compTab === 'fixtures') {
    if (!view.round) view.round = state.fixtures.find((f) => f.comp === comp && !f.played)?.round || max;
    view.round = Math.min(view.round, max);
    return `${tabs}<section class="card">${roundNav(comp, max, (r) => `${r}. Hafta`)}${state.fixtures.filter((f) => f.comp === comp && f.round === view.round).map((f) => fxRow(f)).join('')}</section>`;
  }
  if (view.compTab === 'stats') return tabs + statsForComp(comp);
  const rows = standings(state, comp);
  const zone = comp === 'SL'
    ? (i, n) => (i === 0 ? 'z-cl' : i === 1 ? 'z-po' : i <= 3 ? 'z-el' : i >= n - 3 ? 'z-rel' : '')
    : (i, n) => (i <= 1 ? 'z-up' : i <= 5 ? 'z-po' : comp === 'TR1' && i >= n - 4 ? 'z-rel' : '');
  const legend = comp === 'SL'
    ? '<span><i style="background:var(--info)"></i>ŞL lig aşaması / 2. ön eleme</span><span><i style="background:var(--warn)"></i>Avrupa Ligi / Konferans Ligi</span><span><i style="background:var(--bad)"></i>Küme düşme</span>'
    : `<span><i style="background:var(--accent)"></i>Doğrudan yükselme</span><span><i style="background:var(--info)"></i>Play-off</span>${comp === 'TR1' ? '<span><i style="background:var(--bad)"></i>Küme düşme</span>' : ''}`;
  return `${tabs}${tableHtml(comp, rows, zone, `${COMPS[comp].name} ${seasonLabel(state.season)}`).replace('</section>', `<div class="legend">${legend}</div></section>`)}${playoffHtml(comp)}`;
}

function playoffHtml(comp) {
  const po = state.playoffs?.[comp === 'TR1' ? 'PO1' : 'PO2'];
  if (!po || !po.ties?.length) return '';
  const ties = [...po.ties, po.final].filter(Boolean).map((id) => state.ties[id]);
  return `<section class="card"><div class="card-h">Play-off</div>${ties.map(tieRow).join('')}</section>`;
}

function tieRow(tie) {
  const [a, b] = tie.teams;
  const legs = tie.legs.map((id) => state.fixtures.find((f) => f.id === id)).filter(Boolean);
  const played = legs.some((f) => f.played);
  const [sa, sb] = tieScore(state, tie);
  const last = legs[legs.length - 1];
  const mine = a === state.userTeamId || b === state.userTeamId;
  const sub = !played ? fmtDate(legs[0].date).slice(0, -5) : last.pens ? `pen. ${last.home === a ? last.pens.join('-') : last.pens.slice().reverse().join('-')}` : legs.length > 1 ? (legs[1].played ? 'toplam' : '1. maç') : last.et ? 'uzt.' : '';
  return `<button class="tie item" style="width:100%;background:${mine ? 'rgba(47,210,122,.07)' : 'none'};border:0;border-bottom:1px solid var(--line);color:inherit" data-act="${played ? 'report' : 'team'}" data-id="${played ? legs.filter((f) => f.played).pop().id : a}">
    <span class="t r ${tie.winner === a ? 'win' : ''}"><span class="ellipsis">${esc(T(a).name)}</span>${badge(a, 'sm')}</span>
    <span class="s">${played ? `${sa} - ${sb}` : 'vs'}<small>${sub}</small></span>
    <span class="t ${tie.winner === b ? 'win' : ''}">${badge(b, 'sm')}<span class="ellipsis">${esc(T(b).name)}</span></span>
  </button>`;
}

function tiesByStage(comp, stages) {
  const ties = Object.values(state.ties || {}).filter((t) => t.comp === comp);
  const html = stages.slice().reverse().map((st) => {
    const list = ties.filter((t) => t.stage === st);
    if (!list.length) return '';
    return `<div class="stage-h">${STAGE_TR[st]}</div>${list.map(tieRow).join('')}`;
  }).join('');
  return html;
}

function uefaHtml(comp) {
  const U = state.uefa?.[comp];
  const tabs = subTabs([['table', 'Lig aşaması'], ['fixtures', 'Maçlar'], ['ko', 'Eleme turları'], ['stats', 'İstatistikler']]);
  if (!U || !U.teams.length) {
    const draw = (state.cal || []).find((e) => e.kind === 'uefaDraw' && e.comp === comp && !e.done);
    const q = tiesByStage(comp, ['Q2', 'Q3', 'PO']);
    return `<section class="card"><div class="card-h">${esc(COMPS[comp].name)} ${seasonLabel(state.season)}</div><div class="small muted">${draw ? `Lig aşaması kurası ${fmtDate(draw.date)} tarihinde çekilecek. 36 takım her torbadan rakiplerle eşleşecek.` : 'Kura henüz çekilmedi.'}</div>${q ? `<div class="hr"></div>${q}` : ''}</section>`;
  }
  if (view.compTab === 'fixtures') {
    const mds = comp === 'UECL' ? 6 : 8;
    if (!view.round || view.round > mds) view.round = state.fixtures.find((f) => f.comp === comp && f.stage === 'LP' && !f.played)?.round || mds;
    const mine = state.fixtures.filter((f) => f.comp === comp && (f.home === state.userTeamId || f.away === state.userTeamId));
    return `${tabs}${mine.length ? `<section class="card"><div class="card-h">Maçlarım</div>${mine.map((f) => fxRow(f, true)).join('')}</section>` : ''}
      <section class="card">${roundNav(comp, mds, (r) => `${r}. maç günü`)}${state.fixtures.filter((f) => f.comp === comp && f.stage === 'LP' && f.round === view.round).map((f) => fxRow(f)).join('')}</section>`;
  }
  if (view.compTab === 'ko') {
    const html = tiesByStage(comp, ['Q2', 'Q3', 'PO', 'KPO', 'R16', 'QF', 'SF', 'F']);
    return `${tabs}<section class="card">${U.winner ? `<div class="row-flex" style="margin-bottom:8px">${teamKit(U.winner, 44)}<div class="grow"><div class="muted small">Şampiyon</div><b>🏆 ${esc(T(U.winner).name)}</b></div></div>` : ''}${html || '<div class="muted small">Eleme turları lig aşamasından sonra başlar: ilk 8 doğrudan son 16\'ya, 9-24 arası eleme play-off turuna kalır.</div>'}</section>`;
  }
  if (view.compTab === 'stats') return tabs + statsForComp(comp);
  const rows = standings(state, comp);
  const zone = (i) => (i < 8 ? 'z-up' : i < 24 ? 'z-po' : 'z-rel');
  return `${tabs}${tableHtml(comp, rows, zone, `${COMPS[comp].name} ${seasonLabel(state.season)} · Lig aşaması`).replace('</section>', '<div class="legend"><span><i style="background:var(--accent)"></i>Son 16</span><span><i style="background:var(--info)"></i>Eleme play-off</span><span><i style="background:var(--bad)"></i>Elendi</span></div></section>')}`;
}

function cupHtml() {
  const Z = state.cups?.ZTK;
  const tabs = subTabs([['table', 'Turlar'], ['stats', 'İstatistikler']]);
  if (view.compTab === 'stats') return tabs + statsForComp('ZTK');
  const html = tiesByStage('ZTK', ['R1', 'R2', 'R3', 'R4', 'R16', 'QF', 'SF', 'F']);
  const next = (state.cal || []).find((e) => (e.kind === 'cupDraw' || e.kind === 'cupFinal') && !e.done);
  return `${tabs}<section class="card">
    <div class="card-h">Ziraat Türkiye Kupası ${seasonLabel(state.season)}</div>
    ${Z?.winner ? `<div class="row-flex" style="margin-bottom:8px">${teamKit(Z.winner, 44)}<div class="grow"><div class="muted small">Kupa şampiyonu</div><b>🏆 ${esc(T(Z.winner).name)}</b></div></div>` : ''}
    <div class="small muted">Süper Lig takımları 3. turda (6 takım), 4. turda (7 takım) ve son 16'da (Avrupa'da mücadele eden kulüpler ile son şampiyon) kupaya katılır. Tek maç eleme; yarı final çift maç, final tarafsız sahada oynanır.${next ? ` Sıradaki kura: ${fmtDate(next.date)}.` : ''}</div>
    ${html || ''}
  </section>`;
}

function worldHtml() {
  const byCountry = {};
  for (const t of Object.values(state.teams)) (byCountry[t.country] ||= []).push(t);
  const countries = Object.keys(byCountry).sort((a, b) => (a === 'TR' ? -1 : b === 'TR' ? 1 : byCountry[b].length - byCountry[a].length || (COUNTRY[a] || a).localeCompare(COUNTRY[b] || b, 'tr')));
  if (!view.country) view.country = 'EN';
  const list = (byCountry[view.country] || []).sort((a, b) => b.rep - a.rep);
  return `<div class="chips">${countries.map((c) => `<button class="chip ${view.country === c ? 'on' : ''}" data-act="country" data-v="${c}">${flag(c)} ${esc(COUNTRY[c] || c)} <span class="muted">${byCountry[c].length}</span></button>`).join('')}</div>
    <section class="card" style="padding:4px 12px"><div class="list">${list.map((t) => {
      const sq = squadOf(state, t.id);
      const euro = UEFA.filter((c) => state.uefa?.[c]?.teams?.includes(t.id)).map(compShort).join(', ');
      return `<button class="item" data-act="team" data-id="${t.id}">${teamKit(t.id, 34)}<div class="grow"><div class="name ellipsis">${esc(t.name)}</div><div class="sub">${esc(teamLeagueLabel(t))}${euro ? ` · ${esc(euro)}` : ''} · ${sq.length} oyuncu</div></div>${ovrPill(teamRating(sq))}</button>`;
    }).join('')}</div></section>`;
}

function historyHtml() {
  if (!state.history.length) return '<section class="card muted small">Tamamlanan sezon yok. Sezon sonunda tüm organizasyonların şampiyonları ve ödüller burada listelenecek.</section>';
  const uid = state.userTeamId;
  const nm = (id) => (id && T(id) ? esc(T(id).name) : '-');
  return state.history.slice().reverse().map((h) => `
    <section class="card">
      <div class="card-h">${seasonLabel(h.season)} ${h.humans?.[uid] ? `<span>${esc(compShort(h.humans[uid].league))}: ${h.humans[uid].pos}.</span>` : ''}</div>
      <div class="row-flex">${badge(h.champion)}<div class="grow"><b>🏆 ${nm(h.champion)}</b><div class="muted small">Süper Lig şampiyonu</div></div></div>
      <div class="hr"></div>
      <div class="small">${h.champions ? `🏅 Türkiye Kupası: <b>${nm(h.champions.ZTK)}</b><br>⭐ Şampiyonlar Ligi: <b>${nm(h.champions.UCL)}</b><br>🟠 Avrupa Ligi: <b>${nm(h.champions.UEL)}</b><br>🟢 Konferans Ligi: <b>${nm(h.champions.UECL)}</b><br>🥈 1. Lig: <b>${nm(h.champions.TR1)}</b><br>` : ''}
      ⬇️ Düşenler: ${(h.relegated || []).map(nm).join(', ')}${h.promoted ? `<br>⬆️ Yükselenler: ${h.promoted.map(nm).join(', ')}` : ''}<br>
      ⚽ Gol kralı: <b>${esc(h.topScorer?.name || '-')}</b> (${h.topScorer?.v ?? 0}) · 🎯 Asist kralı: <b>${esc(h.topAssist?.name || '-')}</b> (${h.topAssist?.v ?? 0})</div>
    </section>`).join('');
}

function openTeam(id) {
  const t = T(id);
  if (!t) return;
  const sq = squadOf(state, id).sort((a, b) => POSITIONS.indexOf(a.pos) - POSITIONS.indexOf(b.pos) || b.ovr - a.ovr);
  let posText = '—';
  if (TR_LEAGUES.includes(t.league)) {
    const table = standings(state, t.league);
    posText = `${table.findIndex((r) => r.id === id) + 1}.`;
  }
  const euro = UEFA.filter((c) => state.uefa?.[c]?.teams?.includes(id)).map((c) => `${COMPS[c].icon} ${compShort(c)}`).join(' · ');
  const recent = state.fixtures.filter((f) => f.played && (f.home === id || f.away === id)).slice(-3).reverse();
  openModal(`${sheetHead(esc(t.name), teamKit(id, 44))}
    <div class="grid3">
      <div class="stat"><span>${TR_LEAGUES.includes(t.league) ? 'Lig sırası' : 'İtibar'}</span><b>${TR_LEAGUES.includes(t.league) ? posText : t.rep}</b></div>
      <div class="stat"><span>Güç</span><b>${teamRating(sq)}</b></div>
      <div class="stat"><span>Kadro</span><b>${sq.length}</b></div>
    </div>
    <div class="spacer"></div>
    <div class="muted small">${esc(teamLeagueLabel(t))}${t.city ? ` · ${esc(t.city)}` : ''} · ${esc(t.stadium)} (${(t.capacity || 0).toLocaleString('tr-TR')}) · Teknik direktör: ${esc(t.coach)}${isMp() && isHuman(state, id) ? ' <span class="tag human">oyuncu</span>' : ''}${euro ? `<br>Avrupa: ${euro}` : ''}</div>
    ${recent.length ? `<div class="hr"></div>${recent.map((f) => fxRow(f, true)).join('')}` : ''}
    <div class="hr"></div>
    <div class="list">${sq.map((p) => `<button class="item" data-act="player" data-id="${p.id}">${posPill(p.pos)}<div class="grow"><div class="name ellipsis">${p.num ? `<span class="muted">${p.num}</span> ` : ''}${esc(p.name)}</div><div class="sub">${flag(p.nat)} ${p.age} yaş · ${fmtMoney(playerValue(p, state.season))} ${statusIcons(p)}</div></div>${ovrPill(p.ovr)}</button>`).join('')}</div>`);
}

function openReport(fid) {
  const f = state.fixtures.find((x) => x.id === fid);
  if (!f || !f.played) return;
  const side = (i) => (f.events || []).filter((e) => e.side === i && e.type === 'goal').map((e) => `${esc(P(e.pid)?.name || '')} ${e.t}'${e.pen ? ' (P)' : ''}`).join('<br>');
  const reds = (f.events || []).filter((e) => e.type === 'red');
  const statRow = (label, arr, suffix = '') => `<div class="row-flex small" style="padding:5px 0;border-bottom:1px solid var(--line)"><b style="width:50px">${arr[0]}${suffix}</b><span class="grow center muted">${label}</span><b style="width:50px;text-align:right">${arr[1]}${suffix}</b></div>`;
  const ratingsHtml = (teamId) => {
    const rows = Object.entries(f.ratings || {}).map(([pid, r]) => ({ p: P(pid), r })).filter((x) => x.p && x.p.teamId === teamId).sort((a, b) => b.r - a.r);
    if (!rows.length) return '';
    return `<div class="card-h" style="margin-top:12px">${esc(T(teamId).name)} oyuncu puanları</div>${rows.map(({ p, r }) => `<div class="row-flex small" style="padding:4px 0">${posPill(p.pos)}<span class="grow ellipsis">${esc(p.name)}${f.motm === p.id ? ' ⭐' : ''}</span><b>${r.toFixed(1)}</b></div>`).join('')}`;
  };
  const tie = f.tie && state.ties?.[f.tie];
  let tieNote = '';
  if (tie && tie.legs.length > 1 && f.leg === 2) {
    const [sa, sb] = tieScore(state, tie);
    tieNote = `Toplam skor: ${esc(T(tie.teams[0]).name)} ${sa}-${sb} ${esc(T(tie.teams[1]).name)}${tie.winner ? ` · Turu geçen: <b>${esc(T(tie.winner).name)}</b>` : ''}`;
  } else if (tie?.winner && tie.legs.length === 1) tieNote = `Turu geçen: <b>${esc(T(tie.winner).name)}</b>`;
  openModal(`${sheetHead(`${esc(fixtureLabel(f))} · ${fmtDate(f.date)}`)}
    <div class="vs">
      <div class="vs-team">${teamKit(f.home, 64)}<div class="nm">${esc(T(f.home).name)}</div></div>
      <div class="vs-mid" style="font-size:32px">${f.hg} - ${f.ag}<small>${f.pens ? `Penaltılar ${f.pens[0]}-${f.pens[1]}` : f.et ? 'Uzatmalar sonucu' : ''}${f.attendance ? ` ${f.attendance.toLocaleString('tr-TR')} seyirci` : f.neutral ? ` ${esc(f.venue || 'Tarafsız saha')}` : ''}</small></div>
      <div class="vs-team">${teamKit(f.away, 64)}<div class="nm">${esc(T(f.away).name)}</div></div>
    </div>
    ${tieNote ? `<div class="note small center">${tieNote}</div>` : ''}
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
  const listed = state.shortlist?.[uid]?.includes(p.id);
  const comps = Object.entries(s.c || {});

  let actions = '';
  if (!p.retired) {
    if (own && !p.loan) actions = `<button class="btn" data-act="contract" data-id="${p.id}">Sözleşme uzat</button>`;
    else if (!p.teamId && !p.abroad) actions = `<button class="btn primary" data-act="contract" data-id="${p.id}">Sözleşme teklif et</button>`;
    else if (p.teamId && !own) {
      actions = `<button class="btn primary" data-act="bid" data-id="${p.id}" data-type="transfer">Transfer teklifi</button>
        <button class="btn" data-act="bid" data-id="${p.id}" data-type="loan">Kiralama teklifi</button>`;
    }
  }
  const talk = own ? `<div class="card-h" style="margin-top:14px">Birebir görüşme <span>Moral: ${moraleLabel(p.morale)}</span></div>
    <div class="btns" style="flex-wrap:wrap">${Object.entries(TALKS).map(([k, v]) => `<button class="btn" style="flex:1 1 45%" data-act="talk" data-id="${p.id}" data-v="${k}">${v.icon} ${v.label}</button>`).join('')}</div>
    ${p.promise ? `<div class="muted small">🤝 Forma sözü verildi (${fmtDate(p.promise.until)} tarihine kadar)</div>` : ''}` : '';

  openModal(`${sheetHead(esc(p.name), team ? badge(team.id) : '')}
    <div class="row-flex" style="margin-bottom:12px">
      ${ovrPill(p.ovr)} ${posPill(p.pos)}
      <div class="grow small">${flag(p.nat)} ${esc(COUNTRY[p.nat] || p.nat)} · ${p.age} yaş · ${POS_LONG[p.pos]}<br>
        <span class="muted">${team ? `${esc(team.name)} (${esc(teamLeagueLabel(team))})` : p.abroad ? esc(p.abroad) : 'Serbest oyuncu'}${p.num ? ` · #${p.num}` : ''}${p.loan ? ` · ${esc(p.loan.fromName)} kulübünden ${p.loan.until.slice(0, 4)} yazına kadar kiralık` : ''}${isMp() && team && isHuman(state, team.id) && !own ? ` · TD: ${esc(managerName(team.id))}` : ''}</span></div>
      ${!own && !p.retired ? `<button class="btn star-btn ${listed ? 'on' : ''}" style="padding:6px 10px" data-act="shortlist" data-id="${p.id}" title="Takip listesi">${listed ? '⭐' : '☆'}</button>` : ''}
    </div>
    <div class="grid3">
      <div class="stat"><span>Potansiyel</span><b>${potText}</b></div>
      <div class="stat"><span>Piyasa değeri</span><b>${fmtMoney(value)}</b></div>
      <div class="stat"><span>Maaş / yıl</span><b>${p.teamId ? fmtMoney(p.wage) : '—'}</b></div>
      <div class="stat"><span>Sözleşme</span><b>${p.teamId ? (p.loan ? `Kiralık ${p.loan.until.slice(0, 4)}` : `Haz ${p.contractEnd}`) : '—'}</b></div>
      <div class="stat"><span>Kondisyon</span><b>%${Math.round(p.condition)}</b></div>
      <div class="stat"><span>Moral</span><b>${moraleLabel(p.morale)}</b></div>
    </div>
    <div class="note small">${status}${p.teamId ? ` · Kulüpteki rolü: ${ROLE_TR[playerRole(state, p)]}` : ''}</div>
    <div class="card-h" style="margin-top:14px">${seasonLabel(state.season)} sezonu</div>
    <div class="grid3">
      <div class="stat"><span>Maç (ilk 11)</span><b>${s.apps} (${s.starts})</b></div>
      <div class="stat"><span>Gol / Asist</span><b>${s.goals} / ${s.assists}</b></div>
      <div class="stat"><span>Ort. puan</span><b>${s.rN ? avgRating(p).toFixed(2) : '—'}</b></div>
    </div>
    ${comps.length ? `<div class="small muted" style="margin-top:6px">${comps.map(([c, v]) => `${esc(compShort(c))}: ${v[0]} maç, ${v[1]} gol, ${v[2]} asist`).join(' · ')}</div>` : ''}
    ${talk}
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
      <label class="lbl">Bonservis bedeli: <b id="feeLbl">${fmtMoney(Math.min(value, max))}</b></label>
      <input type="range" id="fee" min="0" max="${max}" step="${step}" value="${Math.min(value, max)}" data-input="fee">
      <div class="muted small">Kasanız: ${fmtMoney(balance)} · ${who}${humanSeller ? '' : ' Anlaşılırsa oyuncuyla sözleşme görüşürsünüz.'}</div>
      <button class="btn primary block" data-act="sendBid" data-id="${pid}" data-type="transfer">Teklifi gönder</button>`);
  } else {
    openModal(`${sheetHead('Kiralama teklifi')}
      <div class="row-flex">${ovrPill(p.ovr)}<div class="grow"><b>${esc(p.name)}</b><div class="muted small">${esc(T(p.teamId).name)} · Yıllık maaş ${fmtMoney(p.wage)}</div></div></div>
      <div class="spacer"></div>
      <label class="lbl">Kiralama süresi</label>
      <select class="sel" id="loanYears"><option value="1">1 sezon</option><option value="2">2 sezon</option></select>
      <div class="spacer"></div>
      <label class="lbl">Maaşın ne kadarını ödeyeceksiniz?</label>
      <select class="sel" id="share">${[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v) => `<option value="${v}" ${v === 50 ? 'selected' : ''}>%${v}</option>`).join('')}</select>
      <div class="spacer"></div>
      <label class="lbl">Kiralama bedeli: <b id="feeLbl">€0</b></label>
      <input type="range" id="fee" min="0" max="${Math.max(roundMoney(value * 0.3), 100000)}" step="25000" value="0" data-input="fee">
      <div class="muted small">Kiralama süresi dolunca oyuncu kulübüne geri döner. ${who}</div>
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
    <label class="lbl">Yıllık maaş: <b id="wageLbl">${fmtMoney(Math.min(Math.max(start, min), max))}</b></label>
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
function playerRowT(p) {
  return `<button class="item" data-act="player" data-id="${p.id}">
    ${posPill(p.pos)}
    <div class="grow"><div class="name ellipsis">${esc(p.name)} ${statusIcons(p)}</div>
      <div class="sub">${flag(p.nat)} ${p.age} · ${p.teamId ? `${esc(T(p.teamId).name)}${T(p.teamId).country !== 'TR' ? ` ${flag(T(p.teamId).country)}` : ''}` : p.abroad ? esc(p.abroad) : '<span style="color:var(--accent)">Serbest</span>'}${p.loan ? ' · kiralık' : ''}</div></div>
    <div style="text-align:right">${ovrPill(p.ovr)}<div class="sub small">${fmtMoney(playerValue(p, state.season))}</div></div>
  </button>`;
}

function transferHtml() {
  const win = currentWindow(state);
  const tabs = `<div class="tabs">
    ${[['search', 'Oyuncu ara'], ['shortlist', 'Takip listem'], ['offers', 'Teklifler'], ['news', 'Transferler']].map(([k, v]) => `<button class="${view.transferTab === k ? 'on' : ''}" data-act="transferTab" data-v="${k}">${v}</button>`).join('')}
  </div>`;
  const banner = `<div class="note small ${win ? 'ok' : ''}" style="margin:0 0 12px">${win ? `✅ ${win.label} açık · ${fmtDate(win.end)} tarihinde kapanıyor` : '⛔ Transfer dönemi kapalı. Serbest oyuncularla her zaman anlaşabilirsiniz.'} · Kasa: <b>${fmtMoney(me().finance.balance)}</b></div>`;
  const uid = state.userTeamId;
  if (view.transferTab === 'offers') return tabs + banner + offersHtml();
  if (view.transferTab === 'shortlist') {
    const list = (state.shortlist?.[uid] || []).map(P).filter((p) => p && !p.retired);
    return `${tabs}${banner}<section class="card" style="padding:4px 12px"><div class="list">${list.map(playerRowT).join('') || '<div class="muted small" style="padding:12px 0">Takip listen boş. Bir oyuncunun profilinde ☆ düğmesine dokunarak ekleyebilirsin.</div>'}</div></section>`;
  }
  if (view.transferTab === 'news') {
    return `${tabs}<section class="card">${state.transferLog.slice(0, 80).map((x) => `<div class="news-item"><b>${esc(x.name)}</b>: ${esc(x.from)} → ${esc(x.to)} · ${x.loan ? `Kiralık${x.until ? ` (${x.until.slice(0, 4)})` : ''}` : x.fee ? fmtMoney(x.fee) : 'Bedelsiz'}<small>${fmtDate(x.date)}</small></div>`).join('') || '<div class="muted small">Henüz transfer yok.</div>'}</section>`;
  }

  const f = view.tf;
  let rows = Object.values(state.players).filter((p) => !p.retired && !p.abroad && p.teamId !== uid);
  if (f.team === 'FREE') rows = rows.filter((p) => !p.teamId);
  else if (f.team) rows = rows.filter((p) => p.teamId === f.team);
  if (f.country) rows = rows.filter((p) => p.teamId && T(p.teamId).country === f.country);
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
  const sel = (k, opts) => `<select class="sel" data-change="tf" data-k="${k}">${opts.map(([v, l]) => `<option value="${v}" ${String(f[k]) === String(v) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
  const countries = [...new Set(Object.values(state.teams).map((t) => t.country))].sort((a, b) => (a === 'TR' ? -1 : b === 'TR' ? 1 : (COUNTRY[a] || a).localeCompare(COUNTRY[b] || b, 'tr')));
  const teamOpts = Object.values(state.teams).filter((t) => t.id !== uid && (!f.country || t.country === f.country)).sort((a, b) => a.name.localeCompare(b.name, 'tr')).map((t) => [t.id, t.name]);

  return `${tabs}${banner}
    <section class="card">
      <div class="filters">
        <div class="full"><input class="inp" placeholder="Oyuncu adı ara…" value="${esc(f.q)}" data-change="tf" data-k="q"></div>
        <div>${sel('country', [['', 'Tüm ülkeler'], ...countries.map((c) => [c, `${COUNTRY[c] || c}`])])}</div>
        <div>${sel('team', [['', 'Tüm kulüpler'], ['FREE', 'Serbest oyuncular'], ...teamOpts])}</div>
        <div>${sel('pos', [['', 'Tüm mevkiler'], ...POSITIONS.map((p) => [p, POS_LONG[p]])])}</div>
        <div>${sel('maxAge', [['', 'Her yaş'], [21, '21 ve altı'], [24, '24 ve altı'], [27, '27 ve altı'], [30, '30 ve altı']])}</div>
        <div>${sel('minOvr', [['', 'Her güç'], [60, '60+'], [65, '65+'], [70, '70+'], [75, '75+'], [80, '80+'], [85, '85+']])}</div>
        <div>${sel('maxVal', [['', 'Her değer'], [500000, '€500 B altı'], [1000000, '€1 M altı'], [3000000, '€3 M altı'], [5000000, '€5 M altı'], [10000000, '€10 M altı'], [20000000, '€20 M altı'], [50000000, '€50 M altı']])}</div>
      </div>
    </section>
    <section class="card" style="padding:4px 12px">
      <div class="muted small" style="padding:8px 0">${total} oyuncu bulundu${total > 80 ? ' · en güçlü 80 gösteriliyor' : ''}</div>
      <div class="list">${rows.map(playerRowT).join('')}</div>
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
    if (!p) return '';
    const other = dir === 'out' ? T(o.to)?.name : o.fromForeign || T(o.from)?.name;
    const [label, cls] = OFFER_STATUS[o.status] || [o.status, ''];
    return `<button class="item" data-act="player" data-id="${o.pid}">
      ${posPill(p.pos)}<div class="grow"><div class="name ellipsis">${esc(p.name)}</div>
      <div class="sub">${dir === 'out' ? '→' : '←'} ${esc(other || '')} · ${o.type === 'loan' ? `Kiralık ${o.loanYears || 1} sezon (%${o.wageShare})` : fmtMoney(o.fee)} · ${fmtDate(o.created)}</div></div>
      <span class="tag ${cls}">${label}</span></button>`;
  };
  return `<section class="card"><div class="card-h">Yaptığım teklifler</div><div class="list">${mine.map((o) => row(o, 'out')).join('') || '<div class="muted small">Henüz teklif yapmadınız. Oyuncu ara sekmesinden bir oyuncu seçin.</div>'}</div></section>
    <section class="card"><div class="card-h">Oyuncularıma gelen teklifler</div><div class="list">${incoming.map((o) => row(o, 'in')).join('') || '<div class="muted small">Henüz teklif gelmedi.</div>'}</div></section>`;
}

// ---------- Gündem ----------
function newsHtml() {
  const uid = state.userTeamId;
  const cats = [['all', 'Tümü'], ['mine', 'Kulübüm'], ['league', 'Lig'], ['europe', 'Avrupa'], ['cup', 'Kupa'], ['transfer', 'Transfer'], ['award', 'Ödüller']];
  let list = state.news;
  if (view.newsCat === 'mine') list = list.filter((n) => n.teams?.includes(uid));
  else if (view.newsCat !== 'all') list = list.filter((n) => n.cat === view.newsCat || (view.newsCat === 'league' && n.cat === 'club'));
  const up = upcomingEvents(5);
  return `<div class="chips">${cats.map(([k, v]) => `<button class="chip ${view.newsCat === k ? 'on' : ''}" data-act="newsCat" data-v="${k}">${v}</button>`).join('')}</div>
    ${up.length ? `<section class="card"><div class="card-h">Takvim</div>${up.map((e) => `<div class="status-line"><b style="width:70px">${fmtDate(e.date).slice(0, -5)}</b><span class="grow">${esc(e.text)}</span></div>`).join('')}</section>` : ''}
    <section class="card" style="padding:4px 14px">${list.slice(0, 120).map((n) => newsItem(n)).join('') || '<div class="muted small" style="padding:12px 0">Bu kategoride henüz haber yok.</div>'}</section>`;
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
  if (m.needsAction && !m.resolved && m.kind === 'job') {
    actions = `<div class="btns"><button class="btn primary" data-act="jobMsg" data-id="${m.id}" data-a="1">Teklifi kabul et</button><button class="btn" data-act="jobMsg" data-id="${m.id}" data-a="0">Kulübümde kalıyorum</button></div>`;
  } else if (m.needsAction && !m.resolved && o) {
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

// ---------- Kulüp ve kariyer ----------
function openClub() {
  const t = me();
  const f = t.finance.season;
  const board = myBoard();
  const income = f.gate + f.tv + f.sponsor + f.prize + f.sales;
  const expense = f.wages + f.purchases + f.running;
  const line = (l, v) => `<div class="row-flex small" style="padding:5px 0;border-bottom:1px solid var(--line)"><span class="grow muted">${l}</span><b>${fmtMoney(v)}</b></div>`;
  const c = careerOf(state, t.id);
  openModal(`${sheetHead(esc(t.name), badge(t.id))}
    <div class="grid2">
      <div class="stat"><span>Kasa</span><b>${fmtMoney(t.finance.balance)}</b></div>
      <div class="stat"><span>İtibar</span><b>${t.rep}/100</b></div>
      <div class="stat"><span>Yönetim hedefi</span><b>${esc(board.label)}</b></div>
      <div class="stat"><span>Yönetim güveni</span><b>%${Math.round(board.confidence)}</b></div>
      <div class="stat"><span>Taraftar</span><b>${fansLabel(fansOf(state, t.id))} (%${Math.round(fansOf(state, t.id))})</b></div>
      <div class="stat"><span>Kupa dolabı</span><b>🏆 ${c?.trophies.length || 0}</b></div>
    </div>
    <button class="btn primary block" data-act="career">🏆 Kariyer, kupa dolabı ve başarımlar</button>
    <div class="muted small" style="margin-top:8px">Teknik direktör: ${esc(managerName())} · ${esc(t.stadium)} (${t.capacity.toLocaleString('tr-TR')} kişilik) · ${esc(LEAGUE_LABEL[t.league] || '')}</div>
    <div class="card-h" style="margin-top:14px">Bu sezon gelirler <span>${fmtMoney(income)}</span></div>
    ${line('Bilet gelirleri', f.gate)}${line('Yayın gelirleri', f.tv)}${line('Sponsorluk', f.sponsor)}${line('Ödüller (lig, kupa, UEFA)', f.prize)}${line('Oyuncu satışları', f.sales)}
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

function openCareer() {
  const tid = state.userTeamId;
  const c = careerOf(state, tid);
  if (!c) return;
  const m = c.matches;
  const total = m.w + m.d + m.l;
  const unlocked = Object.keys(c.achv).length;
  openModal(`${sheetHead(`${esc(managerName())} · Kariyer`)}
    <div class="grid3">
      <div class="stat"><span>Maç</span><b>${total}</b></div>
      <div class="stat"><span>G / B / M</span><b>${m.w}/${m.d}/${m.l}</b></div>
      <div class="stat"><span>Galibiyet %</span><b>${total ? Math.round((m.w / total) * 100) : 0}</b></div>
      <div class="stat"><span>Gol</span><b>${m.gf}:${m.ga}</b></div>
      <div class="stat"><span>En uzun seri</span><b>${c.bestStreak} maç</b></div>
      <div class="stat"><span>TD itibarı</span><b>${managerRep(state, tid)}</b></div>
    </div>
    <div class="card-h" style="margin-top:14px">Kupa dolabı <span>${c.trophies.length}</span></div>
    ${c.trophies.map((x) => `<div class="trophy"><span class="big">${COMPS[x.comp]?.icon || '🏆'}</span><div class="grow"><b>${esc(x.name)}</b><div class="muted small">${seasonLabel(x.season)} · ${esc(T(x.teamId)?.name || '')}</div></div></div>`).join('') || '<div class="muted small">Henüz kupa yok. İlk kupa seni bekliyor!</div>'}
    ${c.awards.length ? `<div class="card-h" style="margin-top:14px">Ödüller</div>${c.awards.map((a) => `<div class="small" style="padding:3px 0">🎩 ${esc(a.name)} · ${seasonLabel(a.season)}</div>`).join('')}` : ''}
    ${c.seasons.length ? `<div class="card-h" style="margin-top:14px">Sezonlar</div>${c.seasons.slice().reverse().map((s) => `<div class="row-flex small" style="padding:4px 0">${badge(s.teamId, 'sm')}<span class="grow">${seasonLabel(s.season)} · ${esc(compShort(s.league))} ${s.pos}.</span><span class="muted">${s.cup ? `Kupa: ${esc(s.cup)}` : ''}${s.europe ? ` · ${esc(s.europe)}` : ''}</span></div>`).join('')}` : ''}
    <div class="card-h" style="margin-top:14px">Başarımlar <span>${unlocked}/${ACHIEVEMENTS.length}</span></div>
    <div class="achv">${ACHIEVEMENTS.map((a) => `<div class="a ${c.achv[a.id] ? 'on' : ''}"><span style="font-size:20px">${a.icon}</span><b>${esc(a.title)}</b>${esc(a.desc)}${c.achv[a.id] ? `<div class="muted" style="margin-top:3px">${fmtDate(c.achv[a.id])}</div>` : ''}</div>`).join('')}</div>`);
}

// ---------- Maç önü, basın toplantısı & canlı maç (tek oyunculu) ----------
function openPrematch(fx) {
  const uid = state.userTeamId;
  const { lineup } = prepareLineup(state, uid);
  const t = me();
  const changed = (t.lineup || []).filter((id, i) => id !== lineup[i]).length;
  const press = needsPress(state, uid, fx);
  let agg = '';
  if (fx.leg === 2 && state.ties?.[fx.tie]) {
    const [sa, sb] = tieScore(state, state.ties[fx.tie]);
    const [a, b] = state.ties[fx.tie].teams;
    agg = `<br>İlk maç: ${esc(T(a).name)} ${sa}-${sb} ${esc(T(b).name)}`;
  }
  openModal(`${sheetHead(`${esc(fixtureLabel(fx))} · Maç günü`)}
    <div class="vs">${teamCol(fx.home)}<div class="vs-mid">VS<small>${esc(fx.venue || T(fx.home).stadium)}</small></div>${teamCol(fx.away)}</div>
    <div class="note small">Diziliş: <b>${t.formation}</b> · Anlayış: <b>${MENTALITIES[t.mentality].label}</b>${fx.ko ? '<br>Eleme maçı: eşitlikte uzatma ve penaltılar oynanır.' : ''}${agg}${changed ? `<br>⚠️ İlk 11'deki ${changed} eksik oyuncunun yerine otomatik seçim yapılacak.` : ''}</div>
    ${press ? '<button class="btn block" data-act="press" style="border-color:var(--warn)">🎤 Basın toplantısına katıl</button>' : ''}
    <div class="btns">
      <button class="btn" data-act="goTactics">Taktik & kadro</button>
    </div>
    <div class="btns">
      <button class="btn primary" data-act="live" data-id="${fx.id}">▶ Canlı izle</button>
      <button class="btn" data-act="quick" data-id="${fx.id}">⏩ Hızlı sonuç</button>
    </div>`);
}

function openPress() {
  const fx = nextUserFixture(state);
  if (!fx || !needsPress(state, state.userTeamId, fx)) return toast('Şu an basın toplantısı yok.');
  const pc = pressConference(state, state.userTeamId, fx);
  if (!view.press || view.press.fid !== fx.id) view.press = { fid: fx.id, answers: [] };
  const ans = view.press.answers;
  openModal(`${sheetHead(`🎤 ${esc(pc.title)}`)}
    <div class="muted small">Gazetecilerin sorularını yanıtla. Söylediklerin takımın moralini, taraftarı ve yönetimi etkiler.</div>
    ${pc.questions.map((q, qi) => `<div class="press-q">${esc(q.q)}</div>${q.a.map((a) => `<button class="opt ${ans[qi] === a.id ? 'on' : ''}" data-act="pressPick" data-q="${qi}" data-v="${a.id}">${esc(a.t)}<small>${esc(a.hint)}</small></button>`).join('')}`).join('')}
    <button class="btn primary block" data-act="pressSend" ${ans.filter(Boolean).length < pc.questions.length ? 'disabled' : ''}>Basın toplantısını bitir</button>`);
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
  const delay = live.m.half === 5 ? 900 : { 1: 650, 2: 280, 4: 80 }[live.speed];
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
  $app.innerHTML = matchScreenHtml(live.m, { sp: true });
}

// Maç ekranı: tek oyunculu kariyerde yerel maç, ortak kariyerde işleyiciden gelen canlı durum.
function matchScreenHtml(m, opts = {}) {
  const [h, a] = m.sides;
  const st = m.stats;
  const possTotal = Math.max(1, st[0].poss + st[1].poss);
  const hp = Math.round((st[0].poss / possTotal) * 100);
  const us = m.userSide;
  const side = us >= 0 ? m.sides[us] : null;
  const feed = m.events.slice().reverse().map((e) => `<div class="ev ${e.type}"><span class="t">${['half', 'end', 'info', 'pen-goal', 'pen-miss'].includes(e.type) ? '' : `${e.t}'`}</span><span>${esc(e.text)}</span></div>`).join('');
  const visible = (colors) => {
    const n = parseInt(colors[0].slice(1), 16);
    const lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
    return lum < 0.18 ? colors[1] : colors[0];
  };
  const hc = visible(T(h.teamId).colors);
  const ac = visible(T(a.teamId).colors);
  const mentSeg = (act) => `<div class="seg">${Object.entries(MENTALITIES).map(([k, v]) => `<button class="${side.mentality === k ? 'on' : ''}" data-act="${act}" data-v="${k}">${v.label}</button>`).join('')}</div>`;
  const clock = m.finished ? 'MS' : m.half === 5 ? 'Penaltılar' : m.minute === 0 ? 'Başlıyor' : m.half === 2 && m.minute === 45 ? 'İY' : m.half === 3 && m.minute === 90 ? 'Uzatma' : `${m.clock()}'`;
  const sub = [m.pens ? `Penaltılar ${m.pens.score[0]}-${m.pens.score[1]}` : '', m.agg ? `Toplam ${m.score[0] + m.agg[0]}-${m.score[1] + m.agg[1]}` : ''].filter(Boolean).join(' · ');

  let top = '';
  let controls;
  if (opts.sp) {
    controls = m.finished ? '<button class="btn primary block" data-act="mFinish">Maç raporu ve devam</button>' : `
      <div class="mctl">
        <button class="btn" data-act="mPause">${live.paused ? '▶' : '⏸'}</button>
        ${[1, 2, 4].map((s) => `<button class="btn ${live.speed === s ? 'on' : ''}" data-act="mSpeed" data-v="${s}">${s}x</button>`).join('')}
        <button class="btn grow" data-act="mSubs" ${m.half === 5 ? 'disabled' : ''}>🔄 Değişiklik (${side.subsLeft})</button>
      </div>
      ${mentSeg('mMent')}
      <button class="btn ghost block" data-act="mSkip" style="margin-top:8px">⏭ Sonuca atla</button>`;
  } else {
    const members = Object.values(session.league.members);
    const votes = members.filter((x) => x.skipLive === opts.liveId).length;
    const myVote = session.league.members[session.uid]?.skipLive === opts.liveId;
    if (opts.all.length > 1) {
      top = `<div class="tabs">${opts.all.map((x) => `<button class="${x.fxId === m.fx.id ? 'on' : ''}" data-act="mpLiveSwitch" data-id="${x.fxId}">${esc(T(x.sides[0].teamId).short)} ${x.score[0]}-${x.score[1]} ${esc(T(x.sides[1].teamId).short)}</button>`).join('')}</div>`;
    }
    controls = m.finished
      ? '<div class="note small center" style="margin-top:10px"><span class="spin"></span> Maç bitti, sonuçlar işleniyor…</div>'
      : `${side
        ? `<div class="mctl"><button class="btn grow" data-act="mpSubs">🔄 Değişiklik (${side.subsLeft})</button></div>${mentSeg('mpMent')}`
        : '<div class="note small center" style="margin-top:10px">Bu maçı izleyici olarak takip ediyorsun.</div>'}
      <div class="btns"><button class="btn" data-act="mpSkip" ${myVote ? 'disabled' : ''}>⏭ Sonuca geç (${votes}/${members.length})</button><button class="btn ghost" data-act="mpLiveClose">Ana sayfa</button></div>`;
  }

  return `
    <div class="match">
      ${top}
      <div class="muted small center" style="margin-bottom:4px">${esc(fixtureLabel(m.fx))}</div>
      <div class="sb">
        <div class="sb-team">${teamKit(h.teamId, 60)}<span class="ellipsis" style="max-width:100%">${esc(h.name)}</span></div>
        <div><div class="sb-score">${m.score[0]} - ${m.score[1]}</div><div class="sb-min center">${opts.sp ? '' : '🔴 '}${clock}</div>${sub ? `<div class="muted small center">${sub}</div>` : ''}</div>
        <div class="sb-team">${teamKit(a.teamId, 60)}<span class="ellipsis" style="max-width:100%">${esc(a.name)}</span></div>
      </div>
      <div class="poss"><div style="width:${hp}%;background:${hc}"></div><div style="flex:1;background:${ac}"></div></div>
      <div class="mstats"><span>%${hp} · ${st[0].shots} şut (${st[0].onT})</span><span>Topa sahip olma / Şut (isabet)</span><span>(${st[1].onT}) ${st[1].shots} şut · %${100 - hp}</span></div>
      ${controls}
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
  const bench = side.bench.filter((id) => !side.used.has(id)).map(P).filter(Boolean);
  openModal(`${sheetHead(`${esc(P(outPid).name)} yerine`)}
    <div class="list">${bench.map((p) => `<button class="item" data-act="mIn" data-out="${outPid}" data-id="${p.id}">${posPill(p.pos)}<div class="grow"><div class="name ellipsis">${esc(p.name)}</div><div class="sub">${POS_TR[out.slot]} mevkiinde uyum %${Math.round(posFit(p.pos, out.slot) * 100)}</div></div>${ovrPill(p.ovr)}</button>`).join('') || '<div class="muted">Yedek kulübesinde oyuncu yok.</div>'}</div>`);
}

// ---------- Ortak kariyer canlı maç ----------
function currentLiveSnap() {
  const d = mpLive.data;
  if (!d || !d.matches?.length) return null;
  return d.matches.find((x) => x.fxId === mpLive.fid) || d.matches[0];
}

function renderMpLive() {
  const snap = currentLiveSnap();
  const m = snap && Match.restore(state, snap);
  if (!m) {
    mpLive.open = false;
    return renderGame();
  }
  mpLive.fid = snap.fxId;
  m.userSide = m.sides.findIndex((s) => s.teamId === state.userTeamId);
  $app.innerHTML = matchScreenHtml(m, { liveId: mpLive.data.id, all: mpLive.data.matches });
}

function openLiveView() {
  const d = mpLive.data;
  if (!d || d.finished || !d.matches?.length) return toast('Şu an canlı maç yok.');
  const mine = d.matches.find((x) => x.sides.some((s) => s.teamId === state.userTeamId));
  mpLive.fid = (mine || d.matches[0]).fxId;
  mpLive.open = true;
  closeModal();
  render();
}

function onMpLive(d) {
  const prev = mpLive.data;
  mpLive.data = d;
  if (!state || !session) return;
  const isLive = !!(d && !d.finished && d.matches?.length);
  const wasLive = !!(prev && !prev.finished && prev.matches?.length);
  if (isLive && mpLive.autoOpened !== d.id) {
    mpLive.autoOpened = d.id;
    if (d.matches.some((x) => x.sides.some((s) => s.teamId === state.userTeamId))) {
      toast('🔴 Maçın canlı başladı!');
      openLiveView();
      return;
    }
  }
  if (!isLive) mpLive.open = false;
  if (mpLive.open || isLive !== wasLive || (view.tab === 'home' && $modal.hidden)) render();
}

function openMpSubs(outPid = null) {
  const snap = currentLiveSnap();
  const m = snap && Match.restore(state, snap);
  if (!m || m.finished) return toast('Maç bitti.');
  const us = m.sides.findIndex((s) => s.teamId === state.userTeamId);
  if (us < 0) return;
  const side = m.sides[us];
  if (side.subsLeft <= 0) return toast('Değişiklik hakkınız kalmadı.');
  if (!outPid) {
    openModal(`${sheetHead('Oyundan çıkacak oyuncu')}
      <div class="muted small" style="margin-bottom:8px">Sen seçim yaparken maç devam ediyor.</div>
      <div class="list">${side.onPitch.map((o) => {
        const p = P(o.pid);
        return `<button class="item" data-act="mpOut" data-id="${o.pid}">${posPill(o.slot)}<div class="grow"><div class="name ellipsis">${esc(p.name)} ${o.injured ? '🚑' : ''}</div><div class="sub">Maç puanı ${(m.rt[o.pid] || 6).toFixed(1)}</div></div>${ovrPill(p.ovr)}</button>`;
      }).join('')}</div>`);
    return;
  }
  const out = side.onPitch.find((o) => o.pid === outPid);
  if (!out) return toast('Oyuncu artık sahada değil.');
  const bench = side.bench.filter((id) => !side.used.has(id)).map(P).filter(Boolean);
  openModal(`${sheetHead(`${esc(P(outPid).name)} yerine`)}
    <div class="list">${bench.map((p) => `<button class="item" data-act="mpIn" data-out="${outPid}" data-id="${p.id}">${posPill(p.pos)}<div class="grow"><div class="name ellipsis">${esc(p.name)}</div><div class="sub">${POS_TR[out.slot]} mevkiinde uyum %${Math.round(posFit(p.pos, out.slot) * 100)}</div></div>${ovrPill(p.ovr)}</button>`).join('') || '<div class="muted">Yedek kulübesinde oyuncu yok.</div>'}</div>`);
}

// ---------- Sezon sonu / görevden alınma ----------
function renderSeasonEnd() {
  const s = state.seasonSummary;
  const uid = state.userTeamId;
  const mine = s.humans?.[uid] || { pos: s.userPos, target: s.target, verdict: s.verdict, league: 'SL' };
  const nm = (id) => (id && T(id) ? esc(T(id).name) : '-');
  let button;
  if (isMp()) {
    const lg = session.league;
    const members = Object.values(lg.members);
    const ready = lg.members[session.uid]?.ready;
    button = `<button class="btn ${ready ? '' : 'primary'} block" data-act="ready">${ready ? 'Hazırsın ✓ Diğerleri bekleniyor' : 'Yeni sezona hazırım'} (${members.filter((m) => m.ready).length}/${members.length})</button>`;
  } else {
    button = state.gameOver ? '<button class="btn danger block" data-act="gameOverScreen">Devam</button>' : '<button class="btn primary block" data-act="newSeason">Yeni sezona başla</button>';
  }
  const euroNext = s.europeNext ? UEFA.map((c) => Object.entries(s.europeNext[c] || {}).filter(([k, v]) => Array.isArray(v) && k !== 'foreign').map(([k, v]) => v.map((id) => `${nm(id)} (${compShort(c)} ${k === 'LP' ? 'lig aşaması' : k === 'PO' ? 'play-off' : `${k.slice(1)}. ön eleme`})`)).flat(2)).flat() : [];
  $app.innerHTML = `
    <div class="shell" style="padding-bottom:20px"><main>
      <div class="hero"><div class="ball">🏆</div><h1>${seasonLabel(s.season)} sezonu bitti</h1><p>Türkiye ve Avrupa'da sezonun özeti</p></div>
      <section class="card"><div class="row-flex">${teamKit(s.champion, 56)}<div class="grow"><div class="muted small">Süper Lig şampiyonu</div><b style="font-size:20px">${nm(s.champion)}</b></div></div></section>
      <section class="card">
        <div class="card-h">${esc(me().name)} <span>Hedef: ${esc(mine.target)}</span></div>
        <div style="font-size:28px;font-weight:900">${esc(compShort(mine.league || 'SL'))} · ${mine.pos}. sıra</div>
        ${mine.promoted ? '<div class="note ok small">⬆️ Takımınız bir üst lige yükseldi!</div>' : ''}${mine.relegated ? '<div class="note bad small">⬇️ Takımınız küme düştü.</div>' : ''}
        ${mine.cup ? `<div class="small">🏅 Türkiye Kupası: <b>${esc(mine.cup)}</b></div>` : ''}${mine.europe ? `<div class="small">🌍 ${esc(mine.europe)}</div>` : ''}
        <div class="note small">${esc(mine.verdict)}</div>
      </section>
      ${isMp() && s.humans ? `<section class="card"><div class="card-h">Arkadaşlar</div>${Object.entries(s.humans).map(([tid, h]) => `<div class="member">${teamKit(tid, 30)}<div class="grow"><b>${esc(h.manager || '')}</b><div class="muted small">${esc(T(tid).name)} · ${esc(compShort(h.league))}</div></div><b>${h.pos}.</b></div>`).join('')}</section>` : ''}
      <section class="card small">
        ${s.champions ? `🏅 Türkiye Kupası: <b>${nm(s.champions.ZTK)}</b><br>⭐ Şampiyonlar Ligi: <b>${nm(s.champions.UCL)}</b><br>🟠 Avrupa Ligi: <b>${nm(s.champions.UEL)}</b><br>🟢 Konferans Ligi: <b>${nm(s.champions.UECL)}</b><br>🥈 1. Lig şampiyonu: <b>${nm(s.champions.TR1)}</b><br>` : ''}
        ⚽ Gol kralı: <b>${esc(s.topScorer?.name || '-')}</b> (${s.topScorer?.v ?? 0}) · 🎯 Asist kralı: <b>${esc(s.topAssist?.name || '-')}</b> (${s.topAssist?.v ?? 0})<br>
        ⭐ Sezonun oyuncusu: <b>${esc(s.best?.name || '-')}</b> (${s.best?.v ?? '-'})<br>
        ⬇️ Süper Lig'den düşenler: ${(s.relegated || []).map(nm).join(', ')}<br>
        ⬆️ Süper Lig'e yükselenler: ${(s.promoted || []).map(nm).join(', ')}<br>
        ${euroNext.length ? `🌍 Gelecek sezon Avrupa'da: ${euroNext.join(', ')}` : ''}
      </section>
      <section class="card" style="padding:8px"><table class="tbl"><tbody>${s.table.map((r, i) => `<tr class="${r.id === uid ? 'me' : ''}"><td class="rank">${i + 1}</td><td class="tl"><div class="teamcell">${badge(r.id, 'sm')}${nm(r.id)}</div></td><td>${r.gd > 0 ? '+' : ''}${r.gd}</td><td><b>${r.pts}</b></td></tr>`).join('')}</tbody></table></section>
      ${button}
    </main></div>`;
}

function renderGameOver() {
  if (state.phase === 'seasonEnd' && state.seasonSummary && !view.seenSummary) return renderSeasonEnd();
  const offers = jobOffers(state, state.userTeamId);
  const c = careerOf(state, state.userTeamId);
  $app.innerHTML = `
    <div class="shell" style="padding-bottom:20px"><main>
      <div class="hero"><div class="ball">📋</div><h1>Görevden alındınız</h1><p>${esc(me().name)}</p></div>
      <section class="card"><div class="msg-body">${esc(state.gameOverText || '')}</div></section>
      <section class="card">
        <div class="card-h">İş teklifleri <span>TD itibarı ${managerRep(state, state.userTeamId)}</span></div>
        <div class="small muted" style="margin-bottom:6px">Kariyerin burada bitmek zorunda değil. Seninle çalışmak isteyen kulüpler var${c?.trophies.length ? `; ${c.trophies.length} kupalık geçmişin ilgi görüyor` : ''}.</div>
        <div class="list">${offers.map((id) => {
          const t = T(id);
          const b = makeBoard(state, id);
          return `<button class="item" data-act="takeJob" data-id="${id}">${teamKit(id, 36)}<div class="grow"><div class="name">${esc(t.name)}</div><div class="sub">${esc(LEAGUE_LABEL[t.league] || '')} · Hedef: ${esc(b.label)} · Kasa ${fmtMoney(t.finance.balance)}</div></div><span class="tag ok">Kabul et</span></button>`;
        }).join('') || '<div class="muted small">Şu an teklif yok.</div>'}</div>
      </section>
      <button class="btn block" data-act="newCareer">Yeni kariyer başlat</button>
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
  mpLive = { open: false, fid: null, data: null, autoOpened: null };
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
    onLive: (d) => { if (session === s) onMpLive(d); },
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
  const text = `3-5-2'de ortak kariyere katıl! Lig kodu: ${code}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: '3-5-2', text, url });
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

async function leaveMp() {
  session?.stop();
  session = null;
  setOnlineStore({ active: null });
  mode = 'sp';
  mp.connecting = false;
  mp.joinInfo = null;
  pendingTactics = null;
  mpLive = { open: false, fid: null, data: null, autoOpened: null };
  readIds = new Set();
  savedGame = await loadSave();
  state = savedGame?.state || null;
  closeModal();
  render();
}

// Tek oyunculu ya da ortak kariyerde bir motor işlemini çalıştırır.
async function engineAction(type, payload, spFn) {
  if (isMp()) return mpAction(type, payload);
  return withRng(spFn);
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
  goComp: (d) => {
    closeModal();
    view.tab = 'comps';
    if (view.comp !== d.v) { view.comp = d.v; view.compTab = 'table'; view.round = null; }
    render();
    window.scrollTo(0, 0);
  },
  compTab: (d) => { view.compTab = d.v; view.round = null; render(); },
  country: (d) => { view.country = d.v; render(); },
  newsCat: (d) => { view.newsCat = d.v; render(); },
  statTab: (d) => { view.statTab = d.v; render(); },
  transferTab: (d) => { view.transferTab = d.v; render(); },
  round: (d) => { view.round = Math.min(Number(d.max), Math.max(1, (view.round || 1) + Number(d.d))); render(); },
  player: (d) => openPlayer(d.id),
  team: (d) => openTeam(d.id),
  report: (d) => openReport(d.id),
  club: () => openClub(),
  career: () => openCareer(),
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
    const loanYears = Number(document.getElementById('loanYears')?.value || 1);
    const payload = { pid: d.id, type: d.type, fee, wageShare: share, loanYears };
    const r = await engineAction('bid', payload, () => makeBid(state, payload));
    if (!r.ok) return toast(r.error || r.text || 'Teklif gönderilemedi.', 4000);
    if (r.freeAgent) return openContract(d.id);
    closeModal();
    toast(isMp() ? 'Teklif gönderildi. Yanıt, lig ilerledikçe gelen kutuna düşecek.' : 'Teklif gönderildi. Kulüp 1-2 gün içinde yanıt verecek.', 3500);
    render();
  },
  shortlist: async (d) => {
    const r = await engineAction('shortlist', { pid: d.id }, () => toggleShortlist(state, state.userTeamId, d.id));
    if (isMp()) state.shortlist[state.userTeamId] = state.shortlist[state.userTeamId] || [];
    toast(r.on === false ? 'Takip listesinden çıkarıldı.' : 'Takip listesine eklendi.');
    openPlayer(d.id);
  },
  talk: async (d) => {
    const r = await engineAction('talk', { pid: d.id, kind: d.v }, () => talkToPlayer(state, state.userTeamId, d.id, d.v));
    toast(r.text || 'Görüşme yapıldı.', 4500);
    if (!isMp()) openPlayer(d.id);
  },
  press: () => openPress(),
  pressPick: (d) => {
    view.press.answers[Number(d.q)] = d.v;
    openPress();
  },
  pressSend: async () => {
    const payload = { fid: view.press.fid, answers: view.press.answers };
    const r = await engineAction('press', payload, () => answerPress(state, state.userTeamId, payload.fid, payload.answers));
    view.press = null;
    closeModal();
    toast(r.text || 'Tamam.', 3500);
    render();
  },
  contract: (d) => openContract(d.id, d.offer || null),
  sendContract: async (d) => {
    const wage = Number(document.getElementById('wage').value);
    const years = Number(document.getElementById('years').value);
    const payload = { pid: d.id, wage, years, offerId: d.offer || null };
    const r = await engineAction('contract', payload, () => proposeContract(state, payload));
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
    const r = await engineAction('incoming', { offerId: d.offer, action: d.a, fee }, () => respondIncoming(state, d.offer, d.a, fee));
    closeModal();
    render();
    toast(r.text || 'Tamam.', 3800);
  },
  counterReply: async (d) => {
    const r = await engineAction('counterReply', { offerId: d.offer, accept: d.a === '1' }, () => respondCounter(state, d.offer, d.a === '1'));
    closeModal();
    render();
    const m = myInbox().find((x) => x.needsAction && !x.resolved && x.offerId === d.offer);
    if (m) openMessage(m.id);
    else toast(r.text || 'Tamam.', 3500);
  },
  jobMsg: (d) => {
    const m = state.inbox.find((x) => x.id === d.id);
    if (!m) return;
    m.resolved = true;
    if (d.a === '1' && m.data?.teamId) {
      withRng(() => takeJob(state, m.data.teamId, addHuman, makeBoard));
      closeModal();
      view.tab = 'home';
      render();
      toast(`${T(m.data.teamId).name} ile yeni bir dönem başlıyor!`, 4000);
      return;
    }
    save();
    closeModal();
    render();
    toast('Kulübünüzde kalmaya karar verdiniz. Taraftarlar bu sadakati sevdi.');
    state.fans[state.userTeamId] = Math.min(100, fansOf(state, state.userTeamId) + 5);
  },
  takeJob: (d) => {
    withRng(() => takeJob(state, d.id, addHuman, makeBoard));
    view.seenSummary = false;
    view.tab = 'home';
    render();
    toast(`${T(d.id).name} teknik direktörlüğüne getirildiniz!`, 4000);
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
    view.comp = null;
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
    try { localStorage.removeItem(SAVE_KEY); localStorage.removeItem(OLD_SAVE_KEY); } catch { /* yok say */ }
    state = null;
    live = null;
    savedGame = null;
    closeModal();
    pendingStart = { teamId: null, manager: '' };
    render();
  },
  pickTeam: (d) => { pendingStart.teamId = d.id; renderStart(); },
  startGame: () => {
    if (!pendingStart.teamId) return;
    toast('Dünya oluşturuluyor…', 2000);
    setTimeout(() => {
      state = newGame(pendingStart.teamId, pendingStart.manager.trim() || 'Teknik Direktör');
      flushSave();
      view.tab = 'home';
      view.comp = null;
      render();
      openMessage(state.inbox[0].id);
    }, 30);
  },
  oldRestart: () => {
    const old = savedGame?.old;
    if (!old) return;
    state = newGame(TEAMS.some((t) => t.id === old.userTeamId) ? old.userTeamId : 'gs', old.managers?.[old.userTeamId] || old.manager || 'Teknik Direktör');
    flushSave();
    view.tab = 'home';
    render();
    openMessage(state.inbox[0].id);
  },
  resume: () => {
    state = savedGame?.state || null;
    render();
  },

  // Ortak kariyer
  mpOpen: async () => {
    closeModal();
    await flushSave();
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
  mpLiveOpen: () => openLiveView(),
  mpLiveClose: () => { mpLive.open = false; render(); },
  mpLiveSwitch: (d) => { mpLive.fid = d.id; render(); },
  mpSubs: () => openMpSubs(),
  mpOut: (d) => openMpSubs(d.id),
  mpIn: async (d) => {
    closeModal();
    toast('Değişiklik gönderildi…', 2000);
    const r = await session.submit('liveSub', { fid: mpLive.fid, out: d.out, in: d.id }, true);
    if (r && r.ok === false) toast(r.text || 'Değişiklik yapılamadı.', 3500);
  },
  mpMent: (d) => {
    session.submit('liveMent', { fid: mpLive.fid, mentality: d.v }, false).catch((e) => toast(`Bağlantı hatası: ${e.message}`));
    toast(`Oyun anlayışı: ${MENTALITIES[d.v].label}`);
  },
  mpSkip: async () => {
    if (!mpLive.data) return;
    try {
      await session.voteSkipLive(mpLive.data.id);
    } catch (e) {
      toast(`Bağlantı hatası: ${e.message}`);
    }
  },
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
  if (el.dataset.change === 'tf') {
    view.tf[el.dataset.k] = el.value;
    if (el.dataset.k === 'country') view.tf.team = '';
    render();
  }
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
  if (!live && !isMp() && !state) render();
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
    flushSave();
    if (isMp()) flushTactics();
  } else if (live) {
    renderMatch();
  } else if (session) {
    session.tick();
  }
});
window.addEventListener('pagehide', () => flushSave());

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// Açılış: davet linki → ortak kariyer; aktif lig → ona bağlan; yoksa tek oyunculu kayıt.
async function boot() {
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

  $app.innerHTML = '<div class="shell"><main><div class="hero"><img class="logo" src="icons/logo.svg" alt="3-5-2 logosu" width="96" height="96"><h1>3-5-2</h1><p><span class="spin"></span> Yükleniyor…</p></div></main></div>';
  savedGame = await loadSave();
  if (savedGame?.state) {
    state = savedGame.state;
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

// Test ve hata ayıklama için oyun durumuna erişim
window.__slm = { get state() { return state; }, render, actions };

boot();
