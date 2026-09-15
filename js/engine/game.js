// Oyun döngüsü: dünya, takvim, finans, yönetim ve bitmeyen sezonlar.
// Tek oyunculu kariyerde tek bir insan takımı vardır; ortak kariyerde (state.mp) birden fazla.
import { SEASON } from '../data/teams.js';
import { allClubs, clubNameIndex, generateSquadLines, moneyFactor } from '../data/world.js';
import {
  seedRng, getRngState, rand, randInt, chance, pick, clamp, addDays, daysBetween, weekday, roundMoney, fmtMoney,
} from './util.js';
import {
  parsePlayerLine, expectedWage, weeklyDevelopment, ageOneYear, shouldRetire, emptySeasonStats, avgRating,
  randomInjury, POSITIONS,
} from './players.js';
import { autoPick, teamRating } from './tactics.js';
import { simulateMatch, squadOf } from './match.js';
import { addMessage, addNews, isHuman, humansOf } from './inbox.js';
import { dailyTransfers, fillAiSquads, currentWindow, transferWindows } from './transfers.js';
import {
  COMPS, TR_LEAGUES, UEFA, buildLeagueFixtures, LEAGUE_SETUP, standings, setupSeasonComps, compDaily, afterFixture,
  endSeasonComps, applySeasonTransition, seasonEndDate, leagueRounds,
} from './comps.js';
import {
  initCareer, careerAfterMatch, careerDaily, careerSeasonEnd, fansOf, careerOf,
} from './career.js';

export const START_DATE = `${SEASON}-08-10`;
export const WORLD_VERSION = 3;
export { standings };

function emptyLedger() {
  return { gate: 0, tv: 0, sponsor: 0, prize: 0, sales: 0, wages: 0, purchases: 0, running: 0 };
}

function createWorld(seed = null) {
  seedRng(seed ?? ((Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0));
  const state = {
    version: WORLD_VERSION,
    rng: 0,
    season: SEASON,
    date: START_DATE,
    userTeamId: null,
    manager: null,
    humans: [],
    managers: {},
    boards: {},
    mp: null,
    teams: {},
    players: {},
    fixtures: [],
    leagues: { SL: [], TR1: [], TR2: [] },
    inbox: [],
    offers: [],
    news: [],
    transferLog: [],
    history: [],
    negotiations: {},
    fans: {},
    career: {},
    shortlist: {},
    press: {},
    phase: 'season',
    gameOver: false,
    nextPid: 1,
    seq: 1,
    seasonSummary: null,
  };

  const clubs = allClubs();
  const nameToId = clubNameIndex(clubs);
  for (const c of clubs) {
    const team = {
      id: c.id, name: c.name, short: c.short, city: c.city, country: c.country, league: c.league,
      stadium: c.stadium, capacity: c.capacity, colors: c.colors, kit: c.kit, rep: c.rep, coach: c.coach,
      formation: c.formation, mentality: 'balanced', lineup: null, bench: null, squad: [], form: [],
      finance: { balance: c.balance, season: emptyLedger() },
    };
    const lines = (c.players || generateSquadLines(c, rand)).trim().split('\n');
    for (const line of lines) {
      if (!line.trim()) continue;
      const p = parsePlayerLine(line, c.id, SEASON);
      p.id = `p${state.nextPid++}`;
      if (p.loanFromName) {
        const until = p.loanUntil && p.loanUntil > SEASON ? p.loanUntil : SEASON + 1;
        p.loan = { fromTeam: nameToId[p.loanFromName] || null, fromName: p.loanFromName, until: `${until}-06-30`, wageShare: 100 };
        delete p.loanFromName;
      }
      delete p.loanUntil;
      p.wage = roundMoney(expectedWage(p, c.rep, SEASON) * (0.85 + rand() * 0.3) * Math.sqrt(moneyFactor(c.country)));
      state.players[p.id] = p;
      team.squad.push(p.id);
    }
    state.teams[c.id] = team;
    if (TR_LEAGUES.includes(c.league)) state.leagues[c.league].push(c.id);
  }
  buildSeasonFixtures(state);
  setupSeasonComps(state);
  addNews(state, `${SEASON}-${String(SEASON + 1).slice(2)} sezonu başlıyor! Süper Lig'de 18, 1. Lig'de 20 takım mücadele edecek. Galatasaray Şampiyonlar Ligi'ne doğrudan katılıyor, Fenerbahçe, Beşiktaş ve Trabzonspor ön elemelerde.`, 'league', ['gs', 'fb', 'bjk', 'ts'], 'Yeni sezon başlıyor');
  return state;
}

function buildSeasonFixtures(state) {
  state.fixtures = [];
  for (const lg of TR_LEAGUES) {
    const s = LEAGUE_SETUP[lg];
    state.fixtures.push(...buildLeagueFixtures(state, lg, state.leagues[lg], state.season, s.start, s.breaks));
  }
  sortFixtures(state);
}

export function sortFixtures(state) {
  state.fixtures.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : (a.round || 0) - (b.round || 0)));
}

// Bir takımın yönetimini insan bir teknik direktöre verir.
export function addHuman(state, teamId, name) {
  const team = state.teams[teamId];
  if (!state.humans.includes(teamId)) state.humans.push(teamId);
  state.managers[teamId] = name;
  team.coach = name;
  if (!team.lineup) {
    const picked = autoPick(squadOf(state, teamId), team.formation);
    team.lineup = picked.lineup;
    team.bench = picked.bench;
  }
  state.boards[teamId] = makeBoard(state, teamId);
  initCareer(state, teamId);
  const w = currentWindow(state);
  addMessage(state, {
    teamId,
    title: `${team.name} yönetimine hoş geldiniz`,
    body: `Sayın ${name}, ${team.name} teknik direktörlüğüne getirildiniz. Yönetimin bu sezonki hedefi: ${state.boards[teamId].label}. `
      + `${w ? `${w.label} ${fmtDateShort(w.end)} tarihine kadar açık. ` : ''}Bütçeniz: ${fmtMoney(team.finance.balance)}. `
      + 'Gündem sekmesinden lig, kupa ve Avrupa gelişmelerini takip edebilirsiniz. Başarılar!',
    quiet: true,
  });
}

export function newGame(userTeamId, manager) {
  const state = createWorld();
  state.userTeamId = userTeamId;
  state.manager = manager || 'Teknik Direktör';
  addHuman(state, userTeamId, state.manager);
  state.rng = getRngState();
  return state;
}

// Ortak kariyer: members = [{ teamId, name }]
export function newMultiplayerGame(members, code, seed = null) {
  const state = createWorld(seed);
  state.mp = { code };
  state.userTeamId = members[0].teamId;
  for (const m of members) addHuman(state, m.teamId, m.name);
  state.rng = getRngState();
  return state;
}

// Eski kayıtları güncel veri yapısına taşır. Dünya sürümü eskiyse (Avrupa ve alt ligler öncesi) null döner.
export function migrateState(s) {
  if (!s || (s.version || 0) < WORLD_VERSION || !s.leagues) return null;
  s.fans ||= {};
  s.career ||= {};
  s.shortlist ||= {};
  s.press ||= {};
  if (s.mp === undefined) s.mp = null;
  for (const t of s.humans) {
    if (!s.boards[t]) s.boards[t] = makeBoard(s, t);
    initCareer(s, t);
  }
  return s;
}

// Eski sürümden gelen ortak kariyer: aynı teknik direktörler ve takımlarla yeni dünyada baştan başlar.
export function rebuildFromOld(old) {
  const members = (old.humans || []).map((tid) => ({ teamId: tid, name: old.managers?.[tid] || 'Teknik Direktör' }));
  if (!members.length) return null;
  const s = newMultiplayerGame(members, old.mp?.code || null, old.rng || 1);
  if (!old.mp) {
    s.mp = null;
    s.manager = old.manager || members[0].name;
    // Tek oyunculu kariyerde kariyer kaydı takım yerine "me" anahtarında tutulur.
    const tid = members[0].teamId;
    if (s.career[tid] && !s.career.me) s.career.me = s.career[tid];
    delete s.career[tid];
    initCareer(s, tid);
  }
  return s;
}

function fmtDateShort(iso) {
  const [, m, d] = iso.split('-').map(Number);
  const aylar = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  return `${d} ${aylar[m - 1]}`;
}

export function makeBoard(state, teamId) {
  const team = state.teams[teamId];
  const lg = team.league;
  const ids = state.leagues[lg] || [];
  const rank = ids.slice().sort((a, b) => state.teams[b].rep - state.teams[a].rep).indexOf(teamId) + 1;
  let target;
  let label;
  if (lg === 'SL') {
    if (rank <= 2) { target = 1; label = 'Şampiyonluk'; }
    else if (rank <= 4) { target = 3; label = 'İlk 3 (Avrupa kupaları)'; }
    else if (rank <= 7) { target = 6; label = 'İlk 6'; }
    else if (rank <= 11) { target = 10; label = 'İlk 10'; }
    else { target = 15; label = 'Ligde kalmak'; }
  } else if (lg === 'TR1') {
    if (rank <= 4) { target = 2; label = 'Süper Lig\'e doğrudan yükselmek'; }
    else if (rank <= 10) { target = 6; label = 'Play-off\'a kalmak'; }
    else { target = 16; label = 'Ligde kalmak'; }
  } else {
    if (rank <= 5) { target = 6; label = '1. Lig\'e yükselme yarışı'; }
    else { target = 10; label = 'İlk 10'; }
  }
  return { confidence: 65, target, label, league: lg };
}

export function userFixtureToday(state) {
  const uid = state.userTeamId;
  return state.fixtures.find((f) => f.date === state.date && !f.played && (f.home === uid || f.away === uid)) || null;
}

export function nextUserFixture(state) {
  const uid = state.userTeamId;
  return state.fixtures.find((f) => !f.played && (f.home === uid || f.away === uid)) || null;
}

export function humanFixturesToday(state) {
  return state.fixtures.filter((f) => f.date === state.date && !f.played && (isHuman(state, f.home) || isHuman(state, f.away)));
}

// Tek oyunculu "Devam" düğmesi: kullanıcının dikkat etmesi gereken bir şey olana kadar günleri ilerletir.
export function continueGame(state) {
  seedRng(state.rng);
  const uid = state.userTeamId;
  try {
    for (let i = 0; i < 400; i++) {
      if (state.gameOver) return { reason: 'sacked' };
      if (state.phase === 'seasonEnd') return { reason: 'seasonEnd' };
      const pending = state.inbox.find((m) => m.teamId === uid && m.needsAction && !m.resolved);
      if (pending) return { reason: 'decision', message: pending };
      const fx = userFixtureToday(state);
      if (fx) return { reason: 'userMatch', fixture: fx };

      const before = state.seq;
      playOtherMatchesToday(state);
      endOfDay(state);
      if (state.gameOver) return { reason: 'sacked' };
      if (state.phase === 'seasonEnd') return { reason: 'seasonEnd' };
      const fresh = state.inbox.filter((m) => m.teamId === uid && Number(m.id.slice(1)) >= before && !m.quiet);
      if (fresh.length) return { reason: 'news', message: fresh[0] };
    }
    return { reason: 'limit' };
  } finally {
    state.rng = getRngState();
  }
}

// Ortak kariyer: herkes hazır olduğunda bir sonraki durağa kadar ilerler.
export function advanceMultiplayer(state) {
  seedRng(state.rng);
  const setStop = (reason, extra = {}) => {
    state.mpStop = { reason, date: state.date, ...extra };
    return state.mpStop;
  };
  try {
    if (state.phase === 'seasonEnd') {
      state.rng = getRngState();
      startNewSeason(state);
      seedRng(state.rng);
      return setStop('newSeason');
    }
    const startDate = state.date;
    for (let i = 0; i < 400; i++) {
      if (state.phase === 'seasonEnd') return setStop('seasonEnd');
      const hfx = humanFixturesToday(state);
      if (hfx.length) {
        const key = `${state.season}-${[...new Set(hfx.map((f) => `${f.comp}${f.round || f.stage}${f.leg || ''}`))].sort().join('+')}`;
        if (state.mpConfirmed !== key) {
          if (state.mpStop?.reason === 'matchday' && state.mpStop.key === key) state.mpConfirmed = key;
          else return setStop('matchday', { key, round: hfx[0].round || 0 });
        }
      }
      if (i > 0 && daysBetween(startDate, state.date) >= 7) return setStop('week');
      if (hfx.length) {
        if (state.mp?.liveMatches !== false) return setStop('live', { fixtures: hfx.map((f) => f.id) });
        for (const f of hfx) humanMatchEffects(state, f, simulateMatch(state, f));
      }
      playOtherMatchesToday(state);
      endOfDay(state);
    }
    return setStop('week');
  } finally {
    state.rng = getRngState();
  }
}

function playOtherMatchesToday(state) {
  const today = state.fixtures.filter((f) => f.date === state.date && !f.played && !isHuman(state, f.home) && !isHuman(state, f.away));
  for (const f of today) {
    if (f.played) continue;
    simulateMatch(state, f);
    matchFinance(state, f);
    afterFixture(state, f);
  }
}

function matchFinance(state, f) {
  if (f.neutral) return;
  const home = state.teams[f.home];
  const away = state.teams[f.away];
  const wins = (home.form || []).filter((x) => x === 'G').length;
  let fill = clamp(0.35 + home.rep / 200 + wins * 0.02 + (isHuman(state, home.id) ? (fansOf(state, home.id) - 60) / 400 : 0), 0.25, 0.98);
  if (away.rep >= 80) fill = Math.min(0.99, fill + 0.1);
  const big = UEFA.includes(f.comp) ? 1.6 : f.comp === 'ZTK' ? 0.8 : 1;
  if (UEFA.includes(f.comp)) fill = Math.min(0.99, fill + 0.15);
  const ticket = Math.max(6, home.rep * 0.3 - 5) * big * Math.sqrt(moneyFactor(home.country));
  const gate = roundMoney(home.capacity * fill * ticket);
  home.finance.balance += gate;
  home.finance.season.gate += gate;
  f.attendance = Math.round(home.capacity * fill);
}

// İnsan takımının oynadığı maçın yönetim, taraftar, sakatlık ve ceza sonuçları.
function humanMatchEffects(state, f, result) {
  matchFinance(state, f);
  const league = TR_LEAGUES.includes(f.comp);
  for (const [tid, home] of [[f.home, true], [f.away, false]]) {
    if (!isHuman(state, tid)) continue;
    const board = state.boards[tid];
    const my = home ? f.hg : f.ag;
    const their = home ? f.ag : f.hg;
    const opp = home ? f.away : f.home;
    const expected = clamp(1.35 + (teamRating(squadOf(state, tid)) - teamRating(squadOf(state, opp))) * 0.12 + (f.neutral ? 0 : home ? 0.25 : -0.15), 0.3, 2.6);
    const pts = my > their ? 3 : my === their ? 1 : 0;
    board.confidence = clamp(board.confidence + (pts - expected) * (league ? 3.2 : 1.6), 0, 100);
    checkSacking(state, tid);
  }
  for (const pid of result.injured) {
    const p = state.players[pid];
    if (p.injury && isHuman(state, p.teamId)) {
      addMessage(state, { teamId: p.teamId, title: `${p.name} sakatlandı`, body: `Sağlık ekibinin raporuna göre: ${p.injury.name}. Tahmini ${p.injury.days} gün sahalardan uzak kalacak.`, pid, quiet: true });
    }
  }
  for (const s of result.suspended || []) {
    const p = state.players[s.pid];
    if (!isHuman(state, p.teamId)) continue;
    if (s.reason === 'red') addMessage(state, { teamId: p.teamId, title: `${p.name} cezalı duruma düştü`, body: `Gördüğü kırmızı kart nedeniyle ${s.games} maç forma giyemeyecek.`, pid: p.id, quiet: true });
    else addMessage(state, { teamId: p.teamId, title: `${p.name} sarı kart cezalısı`, body: 'Dördüncü sarı kartını gördüğü için bir sonraki lig maçında oynayamayacak.', pid: p.id, quiet: true });
  }
  afterFixture(state, f);
  careerAfterMatch(state, f);
}

// Tek oyunculu kullanıcı maçı oynandıktan sonra çağrılır.
export function onUserMatchPlayed(state, f, result) {
  seedRng(state.rng);
  humanMatchEffects(state, f, result);
  state.rng = getRngState();
}

// Görevden alma yalnızca tek oyunculu kariyerde uygulanır.
function checkSacking(state, teamId) {
  if (state.mp || teamId !== state.userTeamId || state.gameOver) return;
  const lg = state.teams[teamId].league;
  const played = state.fixtures.filter((f) => f.played && f.comp === lg && (f.home === teamId || f.away === teamId)).length;
  if (played >= 8 && state.boards[teamId].confidence < 10) {
    sack(state, `Yönetim kurulu kötü sonuçlar nedeniyle görevinize son verdi. ${state.teams[teamId].name} ile ${played} lig maçlık bir serüveniniz oldu.`);
  }
}

function sack(state, text) {
  state.gameOver = true;
  state.gameOverText = text;
  const c = careerOf(state, state.userTeamId);
  if (c) c.sackings = (c.sackings || 0) + 1;
  addNews(state, `${state.teams[state.userTeamId].name}'da ${state.managers[state.userTeamId]} dönemi sona erdi.`, 'club', [state.userTeamId], 'Teknik direktör görevden alındı');
}

// Ortak kariyerde kimse diğerlerini bekletmesin diye yanıtlanmayan kararlar düşer.
function expireDecisions(state) {
  for (const m of state.inbox) {
    if (!m.needsAction || m.resolved || !m.expires || m.expires > state.date) continue;
    m.resolved = true;
    const o = m.offerId ? state.offers.find((x) => x.id === m.offerId) : null;
    if (o && ['pending', 'countered', 'accepted'].includes(o.status)) o.status = 'expired';
    addMessage(state, { teamId: m.teamId, title: 'Süre doldu', body: `"${m.title}" konusunda zamanında karar verilmediği için görüşme düştü.`, quiet: true });
    if (o && o.user && o.from !== m.teamId && isHuman(state, o.from)) {
      addMessage(state, { teamId: o.from, title: 'Teklifiniz yanıtsız kaldı', body: `${state.players[o.pid]?.name || 'Oyuncu'} için yaptığınız teklife zamanında yanıt verilmedi.`, quiet: true });
    }
  }
}

function endOfDay(state) {
  const d = state.date;
  // Güvenlik ağı: tarihi geçmiş ama oynanmamış maç kalmasın (gecikmeli kuralar vb.)
  for (const f of state.fixtures.filter((x) => !x.played && x.date < d)) {
    if (f.played) continue;
    if (isHuman(state, f.home) || isHuman(state, f.away)) humanMatchEffects(state, f, simulateMatch(state, f));
    else {
      simulateMatch(state, f);
      matchFinance(state, f);
      afterFixture(state, f);
    }
  }
  for (const p of Object.values(state.players)) {
    if (!p.teamId) continue;
    p.condition = Math.min(100, p.condition + 9);
    if (p.injury) {
      p.injury.days--;
      if (p.injury.days <= 0) {
        const name = p.injury.name;
        p.injury = null;
        p.condition = Math.min(p.condition, 85);
        if (isHuman(state, p.teamId)) addMessage(state, { teamId: p.teamId, title: `${p.name} sakatlığını atlattı`, body: `${name} sonrası takımla çalışmalara başladı.`, pid: p.id, quiet: true });
      }
    } else if (chance(0.00035 * (p.age > 30 ? 1.4 : 1))) {
      p.injury = randomInjury();
      if (isHuman(state, p.teamId)) {
        addMessage(state, { teamId: p.teamId, title: `Antrenmanda sakatlık: ${p.name}`, body: `${p.injury.name}. Tahmini ${p.injury.days} gün sahalardan uzak kalacak.`, pid: p.id });
      }
    }
  }

  dailyTransfers(state);
  if (state.mp) expireDecisions(state);
  if (weekday(d) === 1) weekly(state);
  if (d.endsWith('-01')) monthly(state);
  windowMessages(state);
  compDaily(state);
  sortFixtures(state);
  careerDaily(state);

  // Sezon, tüm maçlar (play-off finalleri dahil) oynanınca kapanır; takvim takılırsa 25 gün sonra zorla kapanır.
  const endDate = seasonEndDate(state.season);
  if (state.phase === 'season' && d >= endDate && (!state.fixtures.some((f) => !f.played) || d >= addDays(endDate, 25))) {
    endSeason(state);
    state.phase = 'seasonEnd';
  }
  state.date = addDays(d, 1);
}

function weekly(state) {
  for (const team of Object.values(state.teams)) {
    const sq = squadOf(state, team.id);
    const tr = teamRating(sq);
    let wages = 0;
    for (const p of sq) {
      if (p.weekMins === 0 && p.ovr >= tr - 2 && !p.injury && p.susp <= 0) p.morale -= 3;
      p.morale = clamp(p.morale + (65 - p.morale) * 0.05, 0, 100);
      weeklyDevelopment(p);
      const share = p.loan ? (p.loan.wageShare ?? 100) / 100 : 1;
      wages += (p.wage / 52) * share;
      if (p.loan && p.loan.fromTeam && state.teams[p.loan.fromTeam] && share < 1) {
        const parent = state.teams[p.loan.fromTeam];
        const rest = (p.wage / 52) * (1 - share);
        parent.finance.balance -= rest;
        parent.finance.season.wages += rest;
      }
    }
    wages = Math.round(wages);
    team.weeklyWages = wages;
    team.finance.balance -= wages;
    team.finance.season.wages += wages;
  }
  for (const p of Object.values(state.players)) if (!p.teamId && !p.retired) weeklyDevelopment(p);

  if (state.phase === 'season') {
    for (const tid of humansOf(state)) {
      const lg = state.teams[tid].league;
      const table = standings(state, lg);
      if (!table.length || table[0].p < 6) continue;
      const board = state.boards[tid];
      const diff = table.findIndex((r) => r.id === tid) + 1 - board.target;
      if (diff > 3) board.confidence = clamp(board.confidence - Math.min(3, (diff - 3) * 0.6), 0, 100);
      else if (diff <= 0) board.confidence = clamp(board.confidence + 0.8, 0, 100);
      checkSacking(state, tid);
    }
  }
  fillAiSquads(state);
}

function monthly(state) {
  const month = Number(state.date.slice(5, 7));
  const tvMonth = month >= 8 || month <= 5;
  for (const team of Object.values(state.teams)) {
    const r2 = team.rep * team.rep;
    if (team.country === 'TR') {
      const lgF = team.league === 'SL' ? 1 : team.league === 'TR1' ? 0.35 : 0.15;
      const sponsor = roundMoney((r2 * 800 * lgF) / 12);
      const running = roundMoney((r2 * 1400 * lgF) / 12);
      const tv = tvMonth ? roundMoney(((team.league === 'SL' ? 1.2e6 : 2e5) + r2 * 2200 * lgF) / 10) : 0;
      team.finance.balance += sponsor + tv - running;
      team.finance.season.sponsor += sponsor;
      team.finance.season.tv += tv;
      team.finance.season.running += running;
    } else {
      // Avrupa kulüpleri: gelirler maaş yüküyle orantılı (yayın, sponsor ve bilet toplamı)
      const income = roundMoney(((team.weeklyWages || 0) * 52 * 1.12 + r2 * 900 * moneyFactor(team.country)) / 12);
      team.finance.balance += income;
      team.finance.season.tv += income;
    }
  }
  for (const tid of humansOf(state)) {
    if (state.date === `${state.season + 1}-03-01` || state.date === `${state.season + 1}-05-01`) {
      const expiring = squadOf(state, tid).filter((p) => !p.loan && p.contractEnd <= state.season + 1);
      if (expiring.length) {
        addMessage(state, {
          teamId: tid,
          title: 'Sözleşmesi bitmek üzere olan oyuncular',
          body: `Sezon sonunda sözleşmesi bitecek oyuncularınız: ${expiring.map((p) => p.name).join(', ')}. Uzatmazsanız bedelsiz olarak ayrılacaklar.`,
        });
      }
    }
    const balance = state.teams[tid].finance.balance;
    if (balance < 0) {
      state.boards[tid].confidence = clamp(state.boards[tid].confidence - 4, 0, 100);
      addMessage(state, { teamId: tid, title: 'Yönetim mali durumdan endişeli', body: `Kulübün kasası ekside (${fmtMoney(balance)}). Maaş yükünü azaltmanız ya da oyuncu satmanız bekleniyor.` });
    }
  }
}

function windowMessages(state) {
  for (const s of [state.season - 1, state.season]) {
    for (const w of transferWindows(s)) {
      if (state.date === w.start) {
        addNews(state, `${w.label} açıldı.`, 'transfer');
        for (const tid of humansOf(state)) {
          addMessage(state, { teamId: tid, title: `${w.label} açıldı`, body: `Transfer dönemi ${w.end.split('-').reverse().join('.')} tarihine kadar açık kalacak. Avrupa'nın dört bir yanındaki kulüplerin oyuncularına teklif yapabilirsiniz.`, quiet: true });
        }
      }
      if (state.date === addDays(w.end, -3)) {
        for (const tid of humansOf(state)) {
          addMessage(state, { teamId: tid, title: 'Transfer döneminin kapanmasına 3 gün kaldı', body: 'Kadronuzda eksik varsa son günleri kaçırmayın.' });
        }
      }
      if (state.date === addDays(w.end, 1)) {
        addNews(state, `${w.label} sona erdi.`, 'transfer');
        for (const o of state.offers) {
          if (['pending', 'countered', 'accepted'].includes(o.status)) {
            o.status = 'expired';
            for (const m of state.inbox) if (m.offerId === o.id) m.resolved = true;
          }
        }
      }
    }
  }
}

function leaguePlayersStat(state, comp, idx) {
  return Object.values(state.players).filter((p) => p.teamId && p.stats.c?.[comp]?.[0] > 0)
    .sort((a, b) => b.stats.c[comp][idx] - a.stats.c[comp][idx] || b.stats.c[comp][3 - idx] - a.stats.c[comp][3 - idx]);
}

function stageReached(state, comp, teamId) {
  const order = ['Q2', 'Q3', 'PO', 'LP', 'KPO', 'R16', 'QF', 'SF', 'F', 'R1', 'R2', 'R3', 'R4'];
  const fx = state.fixtures.filter((f) => f.comp === comp && (f.home === teamId || f.away === teamId));
  if (!fx.length) return null;
  const U = state.uefa?.[comp];
  if (U?.winner === teamId || (comp === 'ZTK' && state.cups?.ZTK?.winner === teamId)) return 'Şampiyon';
  const cupOrder = ['R1', 'R2', 'R3', 'R4', 'R16', 'QF', 'SF', 'F'];
  const list = comp === 'ZTK' ? cupOrder : order.slice(0, 9);
  const best = fx.map((f) => list.indexOf(f.stage)).reduce((a, b) => Math.max(a, b), -1);
  const st = list[best];
  const LABEL = { Q2: '2. ön eleme', Q3: '3. ön eleme', PO: 'Play-off', LP: 'Lig aşaması', KPO: 'Eleme play-off', R16: 'Son 16', QF: 'Çeyrek final', SF: 'Yarı final', F: 'Final', R1: '1. Tur', R2: '2. Tur', R3: '3. Tur', R4: '4. Tur' };
  return LABEL[st] || st;
}

function endSeason(state) {
  const table = standings(state, 'SL');
  table.forEach((r, i) => {
    const team = state.teams[r.id];
    const prize = (18 - i) * 200000 + (i === 0 ? 5e6 : i === 1 ? 2.5e6 : i <= 3 ? 1e6 : 0);
    team.finance.balance += prize;
    team.finance.season.prize += prize;
    team.rep = clamp(Math.round(team.rep + (9 - i) * 0.35), 40, 95);
  });
  for (const lg of ['TR1', 'TR2']) {
    standings(state, lg).forEach((r, i, arr) => {
      const team = state.teams[r.id];
      team.rep = clamp(Math.round(team.rep + (arr.length / 2 - i) * 0.12), 35, 70);
    });
  }

  const res = endSeasonComps(state);
  for (const id of res.relegatedSL) state.teams[id].rep = clamp(state.teams[id].rep - 3, 35, 95);
  for (const id of res.promotedTR1) state.teams[id].rep = clamp(state.teams[id].rep + 2, 35, 95);
  state.pendingTransition = res;

  const label = `${state.season}-${String(state.season + 1).slice(2)}`;
  const scorers = leaguePlayersStat(state, 'SL', 1);
  const assisters = leaguePlayersStat(state, 'SL', 2);
  const topScorer = scorers[0];
  const topAssist = assisters[0];
  const best = Object.values(state.players).filter((p) => p.teamId && (p.stats.c?.SL?.[0] || 0) >= 15)
    .sort((a, b) => b.stats.c.SL[3] / b.stats.c.SL[0] - a.stats.c.SL[3] / a.stats.c.SL[0])[0];
  const champions = {
    SL: table[0]?.id,
    TR1: standings(state, 'TR1')[0]?.id,
    TR2: standings(state, 'TR2')[0]?.id,
    ZTK: state.cups?.ZTK?.winner || null,
    UCL: state.uefa?.UCL?.winner || null,
    UEL: state.uefa?.UEL?.winner || null,
    UECL: state.uefa?.UECL?.winner || null,
  };
  for (const lg of TR_LEAGUES) {
    if (champions[lg]) state.trophyEvents = [...(state.trophyEvents || []), { comp: lg, teamId: champions[lg], season: state.season }];
  }

  const humans = {};
  for (const tid of humansOf(state)) {
    const board = state.boards[tid];
    const lg = state.teams[tid].league;
    const lt = standings(state, lg);
    const pos = lt.findIndex((r) => r.id === tid) + 1;
    const diff = pos - board.target;
    const relegated = res.relegatedSL.includes(tid) || res.relegatedTR1.includes(tid);
    const promoted = res.promotedTR1.includes(tid) || res.promotedTR2.includes(tid);
    const trophies = (state.trophyEvents || []).filter((e) => e.teamId === tid && e.season === state.season).length;
    let verdict;
    if (promoted || diff <= 0 || trophies) {
      board.confidence = clamp(board.confidence + 25, 0, 100);
      verdict = promoted ? 'Yönetim yükselişten dolayı büyük mutluluk içinde. Yeni sezon için bütçeniz artırıldı.'
        : trophies && diff > 0 ? 'Ligde hedefin gerisinde kalsanız da kazandığınız kupa yönetimi memnun etti.'
          : 'Yönetim hedefe ulaşmanızdan çok memnun. Yeni sezon için bütçeniz artırıldı.';
      state.teams[tid].finance.balance += promoted ? 5e6 : 3e6;
    } else if (diff <= 2 && !relegated) {
      board.confidence = clamp(board.confidence + 3, 0, 100);
      verdict = 'Yönetim sezonu beklentilere yakın buldu. Yeni sezonda daha iyisini bekliyorlar.';
    } else if (!state.mp && tid === state.userTeamId && (relegated || diff >= 5 || board.confidence < 25)) {
      verdict = relegated ? 'Küme düşme sonrası yönetim yollarınızı ayırma kararı aldı.' : 'Yönetim sezonu başarısız buldu ve yollarınızı ayırma kararı aldı.';
      sack(state, `${label} sezonunu ${COMPS[lg].short}'de ${pos}. sırada bitirdiniz. Hedef ${board.label} idi. ${verdict}`);
    } else {
      board.confidence = clamp(board.confidence - (relegated ? 25 : 20), 0, 100);
      verdict = relegated ? 'Takım küme düştü. Yönetim sizinle devam ediyor ama hemen geri dönüş bekliyor.' : 'Yönetim hayal kırıklığı içinde. Yeni sezonda sonuçlar düzelmeli.';
    }
    const cup = stageReached(state, 'ZTK', tid);
    const europe = UEFA.map((c) => [c, stageReached(state, c, tid)]).filter(([, s]) => s).map(([c, s]) => `${COMPS[c].short}: ${s}`).join(' · ');
    humans[tid] = { pos, league: lg, target: board.label, verdict, manager: state.managers[tid], promoted, relegated, cup, europe };
  }
  const mine = humans[state.userTeamId] || Object.values(humans)[0] || { pos: 0, target: '', verdict: '' };

  const summary = {
    season: state.season,
    champion: table[0].id,
    champions,
    table: table.map((r) => ({ id: r.id, pts: r.pts, gd: r.gf - r.ga })),
    relegated: res.relegatedSL,
    promoted: res.promotedTR1,
    relegatedTR1: res.relegatedTR1,
    promotedTR2: res.promotedTR2,
    europeNext: res.qual,
    topScorer: topScorer ? { pid: topScorer.id, name: topScorer.name, teamId: topScorer.teamId, v: topScorer.stats.c.SL[1] } : null,
    topAssist: topAssist ? { pid: topAssist.id, name: topAssist.name, teamId: topAssist.teamId, v: topAssist.stats.c.SL[2] } : null,
    best: best ? { pid: best.id, name: best.name, teamId: best.teamId, v: Math.round((best.stats.c.SL[3] / best.stats.c.SL[0]) * 100) / 100 } : null,
    humans,
    userPos: mine.pos,
    target: mine.target,
    verdict: mine.verdict,
  };
  state.history.push(summary);
  state.seasonSummary = summary;
  addNews(state, `${state.teams[table[0].id].name}, ${label} Süper Lig şampiyonu oldu! Küme düşenler: ${res.relegatedSL.map((id) => state.teams[id].name).join(', ')}. Süper Lig'e yükselenler: ${res.promotedTR1.map((id) => state.teams[id].name).join(', ')}.`, 'league', [table[0].id, ...res.relegatedSL, ...res.promotedTR1], `${label} sezonu tamamlandı`);
  careerSeasonEnd(state, summary);
}

function removeFromTeam(team, pid) {
  team.squad = team.squad.filter((id) => id !== pid);
  if (team.lineup) team.lineup = team.lineup.map((id) => (id === pid ? null : id));
  if (team.bench) team.bench = team.bench.filter((id) => id !== pid);
}

const YOUTH_FIRST = ['Emir', 'Yusuf', 'Kerem', 'Arda', 'Mert', 'Eren', 'Efe', 'Berat', 'Ömer', 'Ali', 'Deniz', 'Kaan', 'Burak', 'Emre', 'Batuhan', 'Umut', 'Can', 'Onur', 'Furkan', 'Hakan', 'Alperen', 'Barış', 'Metehan', 'Doruk', 'Egemen', 'Taha', 'Yiğit', 'Serkan', 'Tuna', 'Utku'];
const YOUTH_LAST = ['Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Yıldız', 'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara', 'Koç', 'Kurt', 'Özkan', 'Şimşek', 'Polat', 'Korkmaz', 'Erdem', 'Güneş', 'Aksoy', 'Tekin', 'Bulut', 'Ünal', 'Yavuz', 'Karaca', 'Taş', 'Uçar'];

// Sezon sonu özetinden sonra yeni sezonu başlatır.
export function startNewSeason(state) {
  seedRng(state.rng);
  const newSeason = state.season + 1;
  const departures = {};
  const arrivals = {};
  const depart = (teamId, text) => { if (isHuman(state, teamId)) (departures[teamId] ||= []).push(text); };

  if (state.pendingTransition) {
    applySeasonTransition(state, state.pendingTransition);
    state.pendingTransition = null;
  }

  // Süresi dolan kiralıklar ana kulübüne döner (çok yıllık kiralıklar süresi bitene kadar sürer).
  for (const p of Object.values(state.players)) {
    if (p.retired || !p.loan) continue;
    if (Number(p.loan.until.slice(0, 4)) > newSeason) continue;
    const back = p.loan.fromTeam && state.teams[p.loan.fromTeam];
    const cur = state.teams[p.teamId];
    if (cur) {
      removeFromTeam(cur, p.id);
      depart(cur.id, `${p.name} (kiralık süresi doldu)`);
    }
    if (back) {
      back.squad.push(p.id);
      p.teamId = back.id;
      if (isHuman(state, back.id)) (arrivals[back.id] ||= []).push(`${p.name} (kiralıktan döndü)`);
    } else {
      p.teamId = null;
      p.abroad = p.loan.fromName;
    }
    p.loan = null;
  }

  for (const p of Object.values(state.players)) {
    if (p.retired) continue;
    if (p.teamId) p.history.push({ season: state.season, teamId: p.teamId, apps: p.stats.apps, goals: p.stats.goals, assists: p.stats.assists, avg: Math.round(avgRating(p) * 100) / 100 });
    if (p.history.length > 12) p.history.splice(0, p.history.length - 12);
    const team = p.teamId ? state.teams[p.teamId] : null;
    if (team && !p.loan && p.contractEnd <= newSeason) {
      const tr = teamRating(squadOf(state, team.id));
      const renew = !isHuman(state, team.id) && p.ovr >= tr - 6 && p.age <= 33 && chance(0.7);
      if (renew) {
        p.contractEnd = newSeason + randInt(1, 3);
        p.wage = roundMoney(expectedWage(p, team.rep, newSeason) * Math.sqrt(moneyFactor(team.country)));
      } else {
        removeFromTeam(team, p.id);
        depart(team.id, `${p.name} (sözleşme bitti)`);
        p.teamId = null;
        p.freeSince = newSeason;
      }
    }
    if (shouldRetire(p)) {
      if (p.teamId) {
        removeFromTeam(state.teams[p.teamId], p.id);
        depart(p.teamId, `${p.name} (futbolu bıraktı)`);
        if (p.ovr >= 78) addNews(state, `${p.name} futbolu bıraktı.`, 'general', [p.teamId]);
      }
      p.retired = true;
      p.teamId = null;
      continue;
    }
    ageOneYear(p);
    p.stats = emptySeasonStats();
    p.yellows = 0;
    p.susp = 0;
    p.condition = 100;
    p.morale = clamp(p.morale + (65 - p.morale) * 0.5, 0, 100);
  }

  // Emekli ve uzun süredir kulüpsüz oyuncular dünyadan çıkarılır (kayıt boyutu sınırlı kalsın).
  const referenced = new Set([
    ...state.inbox.map((m) => m.pid), ...state.offers.map((o) => o.pid), ...Object.values(state.shortlist || {}).flat(),
  ]);
  for (const [id, p] of Object.entries(state.players)) {
    if (p.teamId || referenced.has(id)) continue;
    if (p.retired || (p.freeSince && p.freeSince < newSeason - 1) || (p.abroad && !p.teamId)) delete state.players[id];
  }

  // Altyapıdan gelen gençler
  for (const team of Object.values(state.teams)) {
    const n = team.country === 'TR' ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const pos = pick(POSITIONS);
      const ovr = randInt(44, 52) + Math.round((team.rep - 50) / 8);
      let name = `${pick(YOUTH_FIRST)} ${pick(YOUTH_LAST)}`;
      let nat = 'TR';
      if (team.country !== 'TR') {
        const donor = state.players[pick(team.squad.filter((pid) => state.players[pid]?.nat === team.country)) || ''];
        const other = state.players[pick(team.squad) || ''];
        if (donor && other) name = `${donor.name.split(' ')[0]} ${other.name.split(' ').slice(-1)[0]}`;
        nat = team.country;
      }
      const p = parsePlayerLine(`-|${name}|${nat}|${randInt(17, 18)}|${pos}|${ovr}|${clamp(ovr + randInt(10, 26), ovr, 88)}`, team.id, newSeason);
      p.id = `p${state.nextPid++}`;
      p.contractEnd = newSeason + 3;
      p.wage = 40000;
      state.players[p.id] = p;
      team.squad.push(p.id);
      if (isHuman(state, team.id)) addMessage(state, { teamId: team.id, title: `Altyapıdan yeni oyuncu: ${p.name}`, body: `${p.age} yaşındaki genç oyuncu A takıma yükseltildi.`, pid: p.id, quiet: true });
    }
    team.form = [];
    team.finance.season = emptyLedger();
  }

  state.season = newSeason;
  state.date = `${newSeason}-07-01`;
  buildSeasonFixtures(state);
  setupSeasonComps(state);
  state.phase = 'season';
  state.seasonSummary = null;
  state.mpConfirmed = null;
  state.trophyEvents = [];
  state.offers = state.offers.filter((o) => !['pending', 'countered', 'accepted'].includes(o.status)).slice(0, 60);
  state.transferLog.length = Math.min(state.transferLog.length, 150);
  fillAiSquads(state);
  fillAiSquads(state);

  for (const tid of humansOf(state)) {
    const conf = state.boards[tid]?.confidence ?? 65;
    state.boards[tid] = makeBoard(state, tid);
    state.boards[tid].confidence = clamp(Math.round((conf + 65) / 2), 30, 90);
    const t = state.teams[tid];
    if (departures[tid]?.length) addMessage(state, { teamId: tid, title: 'Takımdan ayrılan oyuncular', body: departures[tid].join(', '), quiet: true });
    if (arrivals[tid]?.length) addMessage(state, { teamId: tid, title: 'Kiralıktan dönen oyuncular', body: arrivals[tid].join(', '), quiet: true });
    const euro = UEFA.map((c) => Object.entries(state.qual?.[c] || {}).filter(([k, v]) => Array.isArray(v) && v.includes(tid)).map(([k]) => `${COMPS[c].short} (${k === 'LP' ? 'lig aşaması' : k === 'PO' ? 'play-off' : `${k.slice(1)}. ön eleme`})`)).flat();
    addMessage(state, {
      teamId: tid,
      title: `${newSeason}-${String(newSeason + 1).slice(2)} sezonu başlıyor`,
      body: `${COMPS[t.league].name}'de yönetimin hedefi: ${state.boards[tid].label}.${euro.length ? ` Avrupa: ${euro.join(', ')}.` : ''} Kasadaki para: ${fmtMoney(t.finance.balance)}.`,
      quiet: true,
    });
  }
  addNews(state, `${newSeason}-${String(newSeason + 1).slice(2)} sezonu başladı. Süper Lig'in yeni takımları: ${state.leagues.SL.filter((id) => state.history.at(-1)?.promoted?.includes(id)).map((id) => state.teams[id].name).join(', ') || '-'}.`, 'league', [], 'Yeni sezon');
  state.rng = getRngState();
}

export { currentWindow, humanMatchEffects as applyHumanMatch, leagueRounds, sack };
