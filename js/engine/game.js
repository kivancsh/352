// Oyun döngüsü: yeni oyun, takvim, fikstür, finans, yönetim ve sezon geçişi.
import { TEAMS, SEASON } from '../data/teams.js';
import {
  seedRng, getRngState, rand, randInt, chance, pick, shuffle, clamp, addDays, weekday, roundMoney, fmtMoney,
} from './util.js';
import {
  parsePlayerLine, expectedWage, weeklyDevelopment, ageOneYear, shouldRetire, emptySeasonStats, avgRating,
  randomInjury, POSITIONS,
} from './players.js';
import { autoPick, teamRating } from './tactics.js';
import { simulateMatch, squadOf } from './match.js';
import { addMessage, addNews } from './inbox.js';
import { dailyTransfers, fillAiSquads, currentWindow, transferWindows } from './transfers.js';

export const START_DATE = `${SEASON}-08-10`;

function emptyLedger() {
  return { gate: 0, tv: 0, sponsor: 0, prize: 0, sales: 0, wages: 0, purchases: 0, running: 0 };
}

export function newGame(userTeamId, manager) {
  seedRng((Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0);
  const state = {
    version: 1,
    rng: 0,
    season: SEASON,
    date: START_DATE,
    userTeamId,
    manager: manager || 'Teknik Direktör',
    teams: {},
    players: {},
    fixtures: [],
    inbox: [],
    offers: [],
    news: [],
    transferLog: [],
    history: [],
    negotiations: {},
    board: null,
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
      colors: t.colors, rep: t.rep, coach: t.coach, formation: t.formation, mentality: 'balanced',
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

  const user = state.teams[userTeamId];
  user.coach = state.manager;
  const picked = autoPick(squadOf(state, userTeamId), user.formation);
  user.lineup = picked.lineup;
  user.bench = picked.bench;

  state.fixtures = buildFixtures(state, SEASON);
  state.board = makeBoard(state);
  addMessage(state, {
    title: `${user.name} yönetimine hoş geldiniz`,
    body: `Sayın ${state.manager}, ${user.name} teknik direktörlüğüne getirildiniz. Yönetimin bu sezonki hedefi: ${state.board.label}. `
      + `Yaz transfer dönemi ${fmtDateShort(transferWindows(SEASON)[0].end)} tarihine kadar açık. Bütçeniz: ${fmtMoney(user.finance.balance)}. Başarılar!`,
    quiet: true,
  });
  state.rng = getRngState();
  return state;
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

function makeBoard(state) {
  const sorted = Object.values(state.teams).sort((a, b) => b.rep - a.rep);
  const rank = sorted.findIndex((t) => t.id === state.userTeamId) + 1;
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

// "Devam" düğmesi: kullanıcının dikkat etmesi gereken bir şey olana kadar günleri ilerletir.
export function continueGame(state) {
  seedRng(state.rng);
  try {
    for (let i = 0; i < 400; i++) {
      if (state.gameOver) return { reason: 'sacked' };
      if (state.phase === 'seasonEnd') return { reason: 'seasonEnd' };
      const pending = state.inbox.find((m) => m.needsAction && !m.resolved);
      if (pending) return { reason: 'decision', message: pending };
      const fx = userFixtureToday(state);
      if (fx) return { reason: 'userMatch', fixture: fx };

      const before = state.seq;
      playOtherMatchesToday(state);
      endOfDay(state);
      if (state.gameOver) return { reason: 'sacked' };
      if (state.phase === 'seasonEnd') return { reason: 'seasonEnd' };
      const fresh = state.inbox.filter((m) => Number(m.id.slice(1)) >= before && !m.quiet);
      if (fresh.length) return { reason: 'news', message: fresh[0] };
    }
    return { reason: 'limit' };
  } finally {
    state.rng = getRngState();
  }
}

function playOtherMatchesToday(state) {
  const uid = state.userTeamId;
  for (const f of state.fixtures) {
    if (f.date !== state.date || f.played || f.home === uid || f.away === uid) continue;
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

// Kullanıcı maçı oynandıktan sonra çağrılır.
export function onUserMatchPlayed(state, f, result) {
  seedRng(state.rng);
  const uid = state.userTeamId;
  matchFinance(state, f);
  const home = f.home === uid;
  const my = home ? f.hg : f.ag;
  const their = home ? f.ag : f.hg;
  const opp = home ? f.away : f.home;
  const myR = teamRating(squadOf(state, uid));
  const opR = teamRating(squadOf(state, opp));
  const expected = clamp(1.35 + (myR - opR) * 0.12 + (home ? 0.25 : -0.15), 0.3, 2.6);
  const pts = my > their ? 3 : my === their ? 1 : 0;
  state.board.confidence = clamp(state.board.confidence + (pts - expected) * 3.2, 0, 100);

  for (const pid of result.injured) {
    const p = state.players[pid];
    if (p.teamId === uid && p.injury) {
      addMessage(state, { title: `${p.name} sakatlandı`, body: `Sağlık ekibinin raporuna göre: ${p.injury.name}. Tahmini ${p.injury.days} gün sahalardan uzak kalacak.`, pid, quiet: true });
    }
  }
  for (const s of result.suspended || []) {
    const p = state.players[s.pid];
    if (p.teamId !== uid) continue;
    if (s.reason === 'red') addMessage(state, { title: `${p.name} cezalı duruma düştü`, body: `Gördüğü kırmızı kart nedeniyle ${s.games} maç forma giyemeyecek.`, pid: p.id, quiet: true });
    else addMessage(state, { title: `${p.name} sarı kart cezalısı`, body: 'Dördüncü sarı kartını gördüğü için bir sonraki maçta oynayamayacak.', pid: p.id, quiet: true });
  }
  checkSacking(state);
  state.rng = getRngState();
}

function checkSacking(state) {
  const played = state.fixtures.filter((f) => f.played && (f.home === state.userTeamId || f.away === state.userTeamId)).length;
  if (played >= 8 && state.board.confidence < 10) {
    state.gameOver = true;
    state.gameOverText = `Yönetim kurulu kötü sonuçlar nedeniyle görevinize son verdi. ${state.teams[state.userTeamId].name} ile ${played} maçlık bir serüveniniz oldu.`;
  }
}

function endOfDay(state) {
  const d = state.date;
  const uid = state.userTeamId;
  for (const p of Object.values(state.players)) {
    if (!p.teamId) continue;
    p.condition = Math.min(100, p.condition + 9);
    if (p.injury) {
      p.injury.days--;
      if (p.injury.days <= 0) {
        const name = p.injury.name;
        p.injury = null;
        p.condition = Math.min(p.condition, 85);
        if (p.teamId === uid) addMessage(state, { title: `${p.name} sakatlığını atlattı`, body: `${name} sonrası takımla çalışmalara başladı.`, pid: p.id, quiet: true });
      }
    } else if (chance(0.00035 * (p.age > 30 ? 1.4 : 1))) {
      p.injury = randomInjury();
      if (p.teamId === uid) {
        addMessage(state, { title: `Antrenmanda sakatlık: ${p.name}`, body: `${p.injury.name}. Tahmini ${p.injury.days} gün sahalardan uzak kalacak.`, pid: p.id });
      }
    }
  }

  dailyTransfers(state);
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
  const uid = state.userTeamId;
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
  const pos = table.findIndex((r) => r.id === uid) + 1;
  const played = table[0].p;
  if (state.phase === 'season' && played >= 6) {
    const diff = pos - state.board.target;
    if (diff > 3) state.board.confidence = clamp(state.board.confidence - Math.min(3, (diff - 3) * 0.6), 0, 100);
    else if (diff <= 0) state.board.confidence = clamp(state.board.confidence + 0.8, 0, 100);
    checkSacking(state);
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
  const uid = state.userTeamId;
  if (state.date === `${state.season + 1}-03-01` || state.date === `${state.season + 1}-05-01`) {
    const expiring = squadOf(state, uid).filter((p) => !p.loan && p.contractEnd <= state.season + 1);
    if (expiring.length) {
      addMessage(state, {
        title: 'Sözleşmesi bitmek üzere olan oyuncular',
        body: `Sezon sonunda sözleşmesi bitecek oyuncularınız: ${expiring.map((p) => p.name).join(', ')}. Uzatmazsanız bedelsiz olarak ayrılacaklar.`,
      });
    }
  }
  const balance = state.teams[uid].finance.balance;
  if (balance < 0) {
    state.board.confidence = clamp(state.board.confidence - 4, 0, 100);
    addMessage(state, { title: 'Yönetim mali durumdan endişeli', body: `Kulübün kasası ekside (${fmtMoney(balance)}). Maaş yükünü azaltmanız ya da oyuncu satmanız bekleniyor.` });
  }
}

function windowMessages(state) {
  for (const s of [state.season - 1, state.season]) {
    for (const w of transferWindows(s)) {
      if (state.date === w.start) {
        addNews(state, `${w.label} açıldı.`);
        addMessage(state, { title: `${w.label} açıldı`, body: `Transfer dönemi ${w.end.split('-').reverse().join('.')} tarihine kadar açık kalacak.`, quiet: true });
      }
      if (state.date === addDays(w.end, -3)) {
        addMessage(state, { title: 'Transfer döneminin kapanmasına 3 gün kaldı', body: 'Kadronuzda eksik varsa son günleri kaçırmayın.' });
      }
      if (state.date === addDays(w.end, 1)) {
        addNews(state, `${w.label} sona erdi.`);
        for (const o of state.offers) {
          if (['pending', 'countered', 'accepted'].includes(o.status) && o.type !== undefined) {
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
  const uid = state.userTeamId;
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

  const userPos = table.findIndex((r) => r.id === uid) + 1;
  const diff = userPos - state.board.target;
  let verdict;
  if (diff <= 0) {
    state.board.confidence = clamp(state.board.confidence + 25, 0, 100);
    verdict = 'Yönetim hedefe ulaşmanızdan çok memnun. Sözleşmeniz güvende, yeni sezon için bütçeniz artırıldı.';
    state.teams[uid].finance.balance += 3e6;
  } else if (diff <= 2) {
    state.board.confidence = clamp(state.board.confidence + 3, 0, 100);
    verdict = 'Yönetim sezonu beklentilere yakın buldu. Yeni sezonda daha iyisini bekliyorlar.';
  } else if (diff >= 5 || state.board.confidence < 25) {
    verdict = 'Yönetim sezonu başarısız buldu ve yollarınızı ayırma kararı aldı.';
    state.gameOver = true;
    state.gameOverText = `${state.season}-${String(state.season + 1).slice(2)} sezonunu ${userPos}. sırada bitirdiniz. Hedef ${state.board.label} idi. ${verdict}`;
  } else {
    state.board.confidence = clamp(state.board.confidence - 20, 0, 100);
    verdict = 'Yönetim hayal kırıklığı içinde. Yeni sezonda sonuçlar düzelmezse görevinize son verilebilir.';
  }

  const summary = {
    season: state.season,
    champion: table[0].id,
    table: table.map((r) => ({ id: r.id, pts: r.pts, gd: r.gf - r.ga })),
    relegated: table.slice(-3).map((r) => r.id),
    topScorer: topScorer ? { pid: topScorer.id, name: topScorer.name, teamId: topScorer.teamId, v: topScorer.stats.goals } : null,
    topAssist: topAssist ? { pid: topAssist.id, name: topAssist.name, teamId: topAssist.teamId, v: topAssist.stats.assists } : null,
    best: best ? { pid: best.id, name: best.name, teamId: best.teamId, v: Math.round(avgRating(best) * 100) / 100 } : null,
    userPos,
    target: state.board.label,
    verdict,
  };
  state.history.push(summary);
  state.seasonSummary = summary;
  addNews(state, `${state.teams[table[0].id].name}, ${state.season}-${String(state.season + 1).slice(2)} sezonunun şampiyonu oldu!`);
}

const YOUTH_FIRST = ['Emir', 'Yusuf', 'Kerem', 'Arda', 'Mert', 'Eren', 'Efe', 'Berat', 'Ömer', 'Ali', 'Deniz', 'Kaan', 'Burak', 'Emre', 'Batuhan', 'Umut', 'Can', 'Onur', 'Furkan', 'Hakan', 'Alperen', 'Barış', 'Metehan', 'Doruk', 'Egemen', 'Taha', 'Yiğit', 'Serkan', 'Tuna', 'Utku'];
const YOUTH_LAST = ['Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Yıldız', 'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara', 'Koç', 'Kurt', 'Özkan', 'Şimşek', 'Polat', 'Korkmaz', 'Erdem', 'Güneş', 'Aksoy', 'Tekin', 'Bulut', 'Ünal', 'Yavuz', 'Karaca', 'Taş', 'Uçar'];

// Sezon sonu özetinden sonra kullanıcı "Yeni sezon" dediğinde çağrılır.
export function startNewSeason(state) {
  seedRng(state.rng);
  const uid = state.userTeamId;
  const newSeason = state.season + 1;
  const departures = [];

  for (const p of Object.values(state.players)) {
    if (p.retired) continue;
    if (p.loan) {
      const back = p.loan.fromTeam && state.teams[p.loan.fromTeam];
      const cur = state.teams[p.teamId];
      if (cur) {
        cur.squad = cur.squad.filter((id) => id !== p.id);
        if (cur.lineup) cur.lineup = cur.lineup.map((id) => (id === p.id ? null : id));
        if (cur.bench) cur.bench = cur.bench.filter((id) => id !== p.id);
      }
      if (back) {
        back.squad.push(p.id);
        p.teamId = back.id;
      } else {
        p.teamId = null;
        p.abroad = p.loan.fromName;
      }
      if (cur && cur.id === uid) departures.push(`${p.name} (kiralık dönüşü)`);
      p.loan = null;
    }
  }

  for (const p of Object.values(state.players)) {
    if (p.retired) continue;
    if (p.teamId) p.history.push({ season: state.season, teamId: p.teamId, apps: p.stats.apps, goals: p.stats.goals, assists: p.stats.assists, avg: Math.round(avgRating(p) * 100) / 100 });
    const team = p.teamId ? state.teams[p.teamId] : null;
    if (team && p.contractEnd <= newSeason) {
      const tr = teamRating(squadOf(state, team.id));
      const renew = team.id !== uid && p.ovr >= tr - 6 && p.age <= 33 && chance(0.7);
      if (renew) {
        p.contractEnd = newSeason + randInt(1, 3);
        p.wage = expectedWage(p, team.rep, newSeason);
      } else {
        team.squad = team.squad.filter((id) => id !== p.id);
        if (team.lineup) team.lineup = team.lineup.map((id) => (id === p.id ? null : id));
        if (team.bench) team.bench = team.bench.filter((id) => id !== p.id);
        if (team.id === uid) departures.push(`${p.name} (sözleşme bitti)`);
        p.teamId = null;
      }
    }
    if (shouldRetire(p)) {
      if (p.teamId) {
        const t = state.teams[p.teamId];
        t.squad = t.squad.filter((id) => id !== p.id);
        if (t.lineup) t.lineup = t.lineup.map((id) => (id === p.id ? null : id));
        if (t.bench) t.bench = t.bench.filter((id) => id !== p.id);
        if (t.id === uid) departures.push(`${p.name} (futbolu bıraktı)`);
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
      if (team.id === uid) addMessage(state, { title: `Altyapıdan yeni oyuncu: ${p.name}`, body: `${p.age} yaşındaki genç oyuncu A takıma yükseltildi.`, pid: p.id, quiet: true });
    }
    team.form = [];
    team.finance.season = emptyLedger();
  }

  if (departures.length) {
    addMessage(state, { title: 'Takımdan ayrılan oyuncular', body: departures.join(', '), quiet: true });
  }

  state.season = newSeason;
  state.date = `${newSeason}-07-01`;
  state.fixtures = buildFixtures(state, newSeason);
  const conf = state.board.confidence;
  state.board = makeBoard(state);
  state.board.confidence = clamp(Math.round((conf + 65) / 2), 30, 90);
  state.phase = 'season';
  state.seasonSummary = null;
  state.offers = state.offers.filter((o) => ['pending', 'countered', 'accepted'].includes(o.status) === false).slice(0, 60);
  fillAiSquads(state);
  fillAiSquads(state);
  const user = state.teams[uid];
  addMessage(state, {
    title: `${newSeason}-${String(newSeason + 1).slice(2)} sezonu başlıyor`,
    body: `Yönetimin yeni sezon hedefi: ${state.board.label}. Kasadaki para: ${fmtMoney(user.finance.balance)}.`,
    quiet: true,
  });
  state.rng = getRngState();
}

export { currentWindow };
