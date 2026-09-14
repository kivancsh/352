// Oyun döngüsü: yeni oyun, takvim, fikstür, finans, yönetim ve sezon geçişi.
// Tek oyunculu kariyerde tek bir insan takımı vardır; ortak kariyerde (state.mp) birden fazla.
import { TEAMS, SEASON } from '../data/teams.js';
import {
  seedRng, getRngState, rand, randInt, chance, pick, shuffle, clamp, addDays, daysBetween, weekday, roundMoney, fmtMoney,
} from './util.js';
import {
  parsePlayerLine, expectedWage, weeklyDevelopment, ageOneYear, shouldRetire, emptySeasonStats, avgRating,
  randomInjury, POSITIONS,
} from './players.js';
import { autoPick, teamRating } from './tactics.js';
import { simulateMatch, squadOf } from './match.js';
import { addMessage, addNews, isHuman, humansOf } from './inbox.js';
import { dailyTransfers, fillAiSquads, currentWindow, transferWindows } from './transfers.js';

export const START_DATE = `${SEASON}-08-10`;

function emptyLedger() {
  return { gate: 0, tv: 0, sponsor: 0, prize: 0, sales: 0, wages: 0, purchases: 0, running: 0 };
}

function createWorld() {
  seedRng((Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0);
  const state = {
    version: 2,
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
    inbox: [],
    offers: [],
    news: [],
    transferLog: [],
    history: [],
    negotiations: {},
    phase: 'season',
    gameOver: false,
    nextPid: 1,
    seq: 1,
    seasonSummary: null,
  };

  const nameToId = Object.fromEntries(TEAMS.map((t) => [t.name, t.id]));
  for (const t of TEAMS) {
    const team = {
      id: t.id, name: t.name, short: t.short, city: t.city, stadium: t.stadium, capacity: t.capacity,
      colors: t.colors, kit: t.kit, rep: t.rep, coach: t.coach, formation: t.formation, mentality: 'balanced',
      lineup: null, bench: null, squad: [], form: [],
      finance: { balance: t.balance, season: emptyLedger() },
    };
    for (const line of t.players.trim().split('\n')) {
      if (!line.trim()) continue;
      const p = parsePlayerLine(line, t.id, SEASON);
      p.id = `p${state.nextPid++}`;
      if (p.loanFromName) {
        p.loan = { fromTeam: nameToId[p.loanFromName] || null, fromName: p.loanFromName, until: `${SEASON + 1}-06-30`, wageShare: 100 };
        delete p.loanFromName;
      }
      p.wage = roundMoney(expectedWage(p, t.rep, SEASON) * (0.85 + rand() * 0.3));
      state.players[p.id] = p;
      team.squad.push(p.id);
    }
    state.teams[t.id] = team;
  }
  state.fixtures = buildFixtures(state, SEASON);
  return state;
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
  if (!state.boards[teamId]) state.boards[teamId] = makeBoard(state, teamId);
  const w = currentWindow(state);
  addMessage(state, {
    teamId,
    title: `${team.name} yönetimine hoş geldiniz`,
    body: `Sayın ${name}, ${team.name} teknik direktörlüğüne getirildiniz. Yönetimin bu sezonki hedefi: ${state.boards[teamId].label}. `
      + `${w ? `${w.label} ${fmtDateShort(w.end)} tarihine kadar açık. ` : ''}Bütçeniz: ${fmtMoney(team.finance.balance)}. Başarılar!`,
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
export function newMultiplayerGame(members, code) {
  const state = createWorld();
  state.mp = { code };
  state.userTeamId = members[0].teamId;
  for (const m of members) addHuman(state, m.teamId, m.name);
  state.rng = getRngState();
  return state;
}

// Eski kayıtları güncel veri yapısına taşır.
export function migrateState(s) {
  if (!s.humans) s.humans = s.userTeamId ? [s.userTeamId] : [];
  if (!s.managers) s.managers = s.userTeamId ? { [s.userTeamId]: s.manager || 'Teknik Direktör' } : {};
  if (!s.boards) s.boards = {};
  if (s.board && s.userTeamId && !s.boards[s.userTeamId]) s.boards[s.userTeamId] = s.board;
  delete s.board;
  for (const t of s.humans) if (!s.boards[t]) s.boards[t] = makeBoard(s, t);
  if (s.mp === undefined) s.mp = null;
  for (const m of s.inbox) if (!m.teamId) m.teamId = s.userTeamId;
  if (s.negotiations) {
    for (const k of Object.keys(s.negotiations)) {
      if (!k.includes(':')) {
        s.negotiations[`${s.userTeamId}:${k}`] = s.negotiations[k];
        delete s.negotiations[k];
      }
    }
  }
  return s;
}

function fmtDateShort(iso) {
  const [, m, d] = iso.split('-').map(Number);
  const aylar = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  return `${d} ${aylar[m - 1]}`;
}

// Çift devreli lig fikstürü (34 hafta), milli ara ve devre arası boşluklarıyla.
export function buildFixtures(state, season) {
  const ids = shuffle(Object.keys(state.teams));
  const n = ids.length;
  const arr = ids.slice();
  const firstHalf = [];
  for (let r = 0; r < n - 1; r++) {
    const pairs = [];
    for (let i = 0; i < n / 2; i++) {
      let h = arr[i];
      let a = arr[n - 1 - i];
      if ((r + i) % 2 === 1) [h, a] = [a, h];
      pairs.push([h, a]);
    }
    firstHalf.push(pairs);
    arr.splice(1, 0, arr.pop());
  }
  const rounds = [...firstHalf, ...firstHalf.map((ps) => ps.map(([h, a]) => [a, h]))];

  const breaks = [
    [`${season}-10-08`, `${season}-10-14`],
    [`${season}-11-12`, `${season}-11-18`],
    [`${season}-12-24`, `${season + 1}-01-14`],
    [`${season + 1}-03-24`, `${season + 1}-03-30`],
  ];
  let sat = `${season}-08-15`;
  while (weekday(sat) !== 6) sat = addDays(sat, 1);
  const dates = [];
  while (dates.length < rounds.length) {
    if (!breaks.some(([a, b]) => sat >= a && sat <= b)) dates.push(sat);
    sat = addDays(sat, 7);
  }

  const fixtures = [];
  rounds.forEach((pairs, r) => {
    const offsets = shuffle([-1, 0, 0, 0, 1, 1, 1, 2, 2]);
    pairs.forEach(([home, away], i) => {
      fixtures.push({
        id: `f${season}_${r + 1}_${i}`, round: r + 1, date: addDays(dates[r], offsets[i]), home, away, played: false, hg: 0, ag: 0,
      });
    });
  });
  return fixtures.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.round - b.round));
}

function makeBoard(state, teamId) {
  const sorted = Object.values(state.teams).sort((a, b) => b.rep - a.rep);
  const rank = sorted.findIndex((t) => t.id === teamId) + 1;
  let target;
  let label;
  if (rank <= 2) { target = 1; label = 'Şampiyonluk'; }
  else if (rank <= 4) { target = 3; label = 'İlk 3 (Avrupa kupaları)'; }
  else if (rank <= 7) { target = 6; label = 'İlk 6'; }
  else if (rank <= 11) { target = 10; label = 'İlk 10'; }
  else { target = 15; label = 'Ligde kalmak'; }
  return { confidence: 65, target, label };
}

export function standings(state) {
  const rows = {};
  for (const id of Object.keys(state.teams)) rows[id] = { id, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
  for (const f of state.fixtures) {
    if (!f.played) continue;
    const h = rows[f.home];
    const a = rows[f.away];
    h.p++; a.p++;
    h.gf += f.hg; h.ga += f.ag; a.gf += f.ag; a.ga += f.hg;
    if (f.hg > f.ag) { h.w++; a.l++; h.pts += 3; }
    else if (f.hg < f.ag) { a.w++; h.l++; a.pts += 3; }
    else { h.d++; a.d++; h.pts++; a.pts++; }
  }
  return Object.values(rows).sort(
    (x, y) => y.pts - x.pts || (y.gf - y.ga) - (x.gf - x.ga) || y.gf - x.gf
      || state.teams[x.id].name.localeCompare(state.teams[y.id].name, 'tr'),
  );
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
// Duraklar: insan takımlarının yeni maç haftası, 7 günlük ara, sezon sonu ve yeni sezon.
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
        const round = Math.max(...hfx.map((f) => f.round));
        const key = `${state.season}-${round}`;
        if (state.mpConfirmed !== key) {
          if (state.mpStop?.reason === 'matchday' && state.mpStop.key === key) state.mpConfirmed = key;
          else return setStop('matchday', { key, round });
        }
      }
      if (i > 0 && daysBetween(startDate, state.date) >= 7) return setStop('week');
      if (hfx.length) {
        // Maçlar işleyici tarafından canlı oynatılır; sonuçlar bitince uygulanır.
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
  for (const f of state.fixtures) {
    if (f.date !== state.date || f.played || isHuman(state, f.home) || isHuman(state, f.away)) continue;
    simulateMatch(state, f);
    matchFinance(state, f);
  }
}

function matchFinance(state, f) {
  const home = state.teams[f.home];
  const away = state.teams[f.away];
  const wins = (home.form || []).filter((x) => x === 'G').length;
  let fill = clamp(0.35 + home.rep / 200 + wins * 0.02, 0.3, 0.97);
  if (away.rep >= 80) fill = Math.min(0.99, fill + 0.1);
  const ticket = Math.max(6, home.rep * 0.3 - 5);
  const gate = roundMoney(home.capacity * fill * ticket);
  home.finance.balance += gate;
  home.finance.season.gate += gate;
  f.attendance = Math.round(home.capacity * fill);
}

// İnsan takımının oynadığı maçın yönetim, sakatlık ve ceza sonuçları.
function humanMatchEffects(state, f, result) {
  matchFinance(state, f);
  for (const [tid, home] of [[f.home, true], [f.away, false]]) {
    if (!isHuman(state, tid)) continue;
    const board = state.boards[tid];
    const my = home ? f.hg : f.ag;
    const their = home ? f.ag : f.hg;
    const opp = home ? f.away : f.home;
    const expected = clamp(1.35 + (teamRating(squadOf(state, tid)) - teamRating(squadOf(state, opp))) * 0.12 + (home ? 0.25 : -0.15), 0.3, 2.6);
    const pts = my > their ? 3 : my === their ? 1 : 0;
    board.confidence = clamp(board.confidence + (pts - expected) * 3.2, 0, 100);
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
    else addMessage(state, { teamId: p.teamId, title: `${p.name} sarı kart cezalısı`, body: 'Dördüncü sarı kartını gördüğü için bir sonraki maçta oynayamayacak.', pid: p.id, quiet: true });
  }
}

// Tek oyunculu kullanıcı maçı oynandıktan sonra çağrılır.
export function onUserMatchPlayed(state, f, result) {
  seedRng(state.rng);
  humanMatchEffects(state, f, result);
  state.rng = getRngState();
}

// Görevden alma yalnızca tek oyunculu kariyerde uygulanır.
function checkSacking(state, teamId) {
  if (state.mp || teamId !== state.userTeamId) return;
  const played = state.fixtures.filter((f) => f.played && (f.home === teamId || f.away === teamId)).length;
  if (played >= 8 && state.boards[teamId].confidence < 10) {
    state.gameOver = true;
    state.gameOverText = `Yönetim kurulu kötü sonuçlar nedeniyle görevinize son verdi. ${state.teams[teamId].name} ile ${played} maçlık bir serüveniniz oldu.`;
  }
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

  if (state.phase === 'season' && state.fixtures.length && state.fixtures.every((f) => f.played)) {
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
    team.finance.balance -= wages;
    team.finance.season.wages += wages;
  }
  // Kulüpte olmayan oyuncuların da gelişimi/düşüşü sürer
  for (const p of Object.values(state.players)) if (!p.teamId && !p.retired) weeklyDevelopment(p);

  const table = standings(state);
  if (state.phase === 'season' && table[0].p >= 6) {
    for (const tid of humansOf(state)) {
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
    const sponsor = roundMoney((r2 * 800) / 12);
    const running = roundMoney((r2 * 1400) / 12);
    const tv = tvMonth ? roundMoney((1.2e6 + r2 * 2200) / 10) : 0;
    team.finance.balance += sponsor + tv - running;
    team.finance.season.sponsor += sponsor;
    team.finance.season.tv += tv;
    team.finance.season.running += running;
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
        addNews(state, `${w.label} açıldı.`);
        for (const tid of humansOf(state)) {
          addMessage(state, { teamId: tid, title: `${w.label} açıldı`, body: `Transfer dönemi ${w.end.split('-').reverse().join('.')} tarihine kadar açık kalacak.`, quiet: true });
        }
      }
      if (state.date === addDays(w.end, -3)) {
        for (const tid of humansOf(state)) {
          addMessage(state, { teamId: tid, title: 'Transfer döneminin kapanmasına 3 gün kaldı', body: 'Kadronuzda eksik varsa son günleri kaçırmayın.' });
        }
      }
      if (state.date === addDays(w.end, 1)) {
        addNews(state, `${w.label} sona erdi.`);
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

function endSeason(state) {
  const table = standings(state);
  table.forEach((r, i) => {
    const team = state.teams[r.id];
    const prize = (18 - i) * 200000 + (i === 0 ? 5e6 : i === 1 ? 2.5e6 : i <= 3 ? 1e6 : 0);
    team.finance.balance += prize;
    team.finance.season.prize += prize;
    team.rep = clamp(Math.round(team.rep + (9 - i) * 0.35), 40, 95);
  });

  const league = Object.values(state.players).filter((p) => p.teamId && p.stats.apps > 0);
  const topScorer = league.slice().sort((a, b) => b.stats.goals - a.stats.goals || b.stats.assists - a.stats.assists)[0];
  const topAssist = league.slice().sort((a, b) => b.stats.assists - a.stats.assists || b.stats.goals - a.stats.goals)[0];
  const best = league.filter((p) => p.stats.apps >= 15).sort((a, b) => avgRating(b) - avgRating(a))[0];
  const label = `${state.season}-${String(state.season + 1).slice(2)}`;

  const humans = {};
  for (const tid of humansOf(state)) {
    const board = state.boards[tid];
    const pos = table.findIndex((r) => r.id === tid) + 1;
    const diff = pos - board.target;
    let verdict;
    if (diff <= 0) {
      board.confidence = clamp(board.confidence + 25, 0, 100);
      verdict = 'Yönetim hedefe ulaşmanızdan çok memnun. Yeni sezon için bütçeniz artırıldı.';
      state.teams[tid].finance.balance += 3e6;
    } else if (diff <= 2) {
      board.confidence = clamp(board.confidence + 3, 0, 100);
      verdict = 'Yönetim sezonu beklentilere yakın buldu. Yeni sezonda daha iyisini bekliyorlar.';
    } else if (!state.mp && tid === state.userTeamId && (diff >= 5 || board.confidence < 25)) {
      verdict = 'Yönetim sezonu başarısız buldu ve yollarınızı ayırma kararı aldı.';
      state.gameOver = true;
      state.gameOverText = `${label} sezonunu ${pos}. sırada bitirdiniz. Hedef ${board.label} idi. ${verdict}`;
    } else {
      board.confidence = clamp(board.confidence - 20, 0, 100);
      verdict = 'Yönetim hayal kırıklığı içinde. Yeni sezonda sonuçlar düzelmeli.';
    }
    humans[tid] = { pos, target: board.label, verdict, manager: state.managers[tid] };
  }
  const mine = humans[state.userTeamId] || Object.values(humans)[0] || { pos: 0, target: '', verdict: '' };

  const summary = {
    season: state.season,
    champion: table[0].id,
    table: table.map((r) => ({ id: r.id, pts: r.pts, gd: r.gf - r.ga })),
    relegated: table.slice(-3).map((r) => r.id),
    topScorer: topScorer ? { pid: topScorer.id, name: topScorer.name, teamId: topScorer.teamId, v: topScorer.stats.goals } : null,
    topAssist: topAssist ? { pid: topAssist.id, name: topAssist.name, teamId: topAssist.teamId, v: topAssist.stats.assists } : null,
    best: best ? { pid: best.id, name: best.name, teamId: best.teamId, v: Math.round(avgRating(best) * 100) / 100 } : null,
    humans,
    userPos: mine.pos,
    target: mine.target,
    verdict: mine.verdict,
  };
  state.history.push(summary);
  state.seasonSummary = summary;
  addNews(state, `${state.teams[table[0].id].name}, ${label} sezonunun şampiyonu oldu!`);
}

const YOUTH_FIRST = ['Emir', 'Yusuf', 'Kerem', 'Arda', 'Mert', 'Eren', 'Efe', 'Berat', 'Ömer', 'Ali', 'Deniz', 'Kaan', 'Burak', 'Emre', 'Batuhan', 'Umut', 'Can', 'Onur', 'Furkan', 'Hakan', 'Alperen', 'Barış', 'Metehan', 'Doruk', 'Egemen', 'Taha', 'Yiğit', 'Serkan', 'Tuna', 'Utku'];
const YOUTH_LAST = ['Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Yıldız', 'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara', 'Koç', 'Kurt', 'Özkan', 'Şimşek', 'Polat', 'Korkmaz', 'Erdem', 'Güneş', 'Aksoy', 'Tekin', 'Bulut', 'Ünal', 'Yavuz', 'Karaca', 'Taş', 'Uçar'];

function removeFromTeam(team, pid) {
  team.squad = team.squad.filter((id) => id !== pid);
  if (team.lineup) team.lineup = team.lineup.map((id) => (id === pid ? null : id));
  if (team.bench) team.bench = team.bench.filter((id) => id !== pid);
}

// Sezon sonu özetinden sonra yeni sezonu başlatır.
export function startNewSeason(state) {
  seedRng(state.rng);
  const newSeason = state.season + 1;
  const departures = {};
  const depart = (teamId, text) => {
    if (isHuman(state, teamId)) (departures[teamId] ||= []).push(text);
  };

  for (const p of Object.values(state.players)) {
    if (p.retired || !p.loan) continue;
    const back = p.loan.fromTeam && state.teams[p.loan.fromTeam];
    const cur = state.teams[p.teamId];
    if (cur) {
      removeFromTeam(cur, p.id);
      depart(cur.id, `${p.name} (kiralık dönüşü)`);
    }
    if (back) {
      back.squad.push(p.id);
      p.teamId = back.id;
    } else {
      p.teamId = null;
      p.abroad = p.loan.fromName;
    }
    p.loan = null;
  }

  for (const p of Object.values(state.players)) {
    if (p.retired) continue;
    if (p.teamId) p.history.push({ season: state.season, teamId: p.teamId, apps: p.stats.apps, goals: p.stats.goals, assists: p.stats.assists, avg: Math.round(avgRating(p) * 100) / 100 });
    const team = p.teamId ? state.teams[p.teamId] : null;
    if (team && p.contractEnd <= newSeason) {
      const tr = teamRating(squadOf(state, team.id));
      const renew = !isHuman(state, team.id) && p.ovr >= tr - 6 && p.age <= 33 && chance(0.7);
      if (renew) {
        p.contractEnd = newSeason + randInt(1, 3);
        p.wage = expectedWage(p, team.rep, newSeason);
      } else {
        removeFromTeam(team, p.id);
        depart(team.id, `${p.name} (sözleşme bitti)`);
        p.teamId = null;
      }
    }
    if (shouldRetire(p)) {
      if (p.teamId) {
        removeFromTeam(state.teams[p.teamId], p.id);
        depart(p.teamId, `${p.name} (futbolu bıraktı)`);
        addNews(state, `${p.name} futbolu bıraktı.`);
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

  // Altyapıdan gelen gençler
  for (const team of Object.values(state.teams)) {
    for (let i = 0; i < 2; i++) {
      const pos = pick(POSITIONS);
      const ovr = randInt(44, 52) + Math.round((team.rep - 50) / 8);
      const p = parsePlayerLine(`-|${pick(YOUTH_FIRST)} ${pick(YOUTH_LAST)}|TR|${randInt(17, 18)}|${pos}|${ovr}|${clamp(ovr + randInt(10, 26), ovr, 85)}`, team.id, newSeason);
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
  state.fixtures = buildFixtures(state, newSeason);
  state.phase = 'season';
  state.seasonSummary = null;
  state.mpConfirmed = null;
  state.offers = state.offers.filter((o) => !['pending', 'countered', 'accepted'].includes(o.status)).slice(0, 60);
  fillAiSquads(state);
  fillAiSquads(state);

  for (const tid of humansOf(state)) {
    const conf = state.boards[tid]?.confidence ?? 65;
    state.boards[tid] = makeBoard(state, tid);
    state.boards[tid].confidence = clamp(Math.round((conf + 65) / 2), 30, 90);
    if (departures[tid]?.length) addMessage(state, { teamId: tid, title: 'Takımdan ayrılan oyuncular', body: departures[tid].join(', '), quiet: true });
    addMessage(state, {
      teamId: tid,
      title: `${newSeason}-${String(newSeason + 1).slice(2)} sezonu başlıyor`,
      body: `Yönetimin yeni sezon hedefi: ${state.boards[tid].label}. Kasadaki para: ${fmtMoney(state.teams[tid].finance.balance)}.`,
      quiet: true,
    });
  }
  state.rng = getRngState();
}

export { currentWindow, humanMatchEffects as applyHumanMatch };
