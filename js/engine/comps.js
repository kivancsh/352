// Organizasyonlar: Türkiye ligleri (yükselme/düşme, play-off), Ziraat Türkiye Kupası ve UEFA kupaları
// (ön elemeler, 36 takımlı lig aşaması kurası, play-off, son 16'dan finale eleme turları).
import { LEAGUE_PHASE_2026 } from '../data/europe.js';
import { rand, randInt, chance, pick, shuffle, clamp, addDays, weekday, normal, roundMoney, fmtMoney } from './util.js';
import { teamRating } from './tactics.js';
import { addNews, isHuman, humansOf, addMessage } from './inbox.js';

export const COMPS = {
  SL: { name: 'Trendyol Süper Lig', short: 'Süper Lig', icon: '🏆', kind: 'league' },
  TR1: { name: 'Trendyol 1. Lig', short: '1. Lig', icon: '🥈', kind: 'league' },
  TR2: { name: 'Nesine 2. Lig', short: '2. Lig', icon: '🥉', kind: 'league' },
  ZTK: { name: 'Ziraat Türkiye Kupası', short: 'Türkiye Kupası', icon: '🏅', kind: 'cup' },
  UCL: { name: 'UEFA Şampiyonlar Ligi', short: 'Şampiyonlar Ligi', icon: '⭐', kind: 'uefa' },
  UEL: { name: 'UEFA Avrupa Ligi', short: 'Avrupa Ligi', icon: '🟠', kind: 'uefa' },
  UECL: { name: 'UEFA Konferans Ligi', short: 'Konferans Ligi', icon: '🟢', kind: 'uefa' },
  PO1: { name: '1. Lig Play-Off', short: '1. Lig Play-Off', icon: '🔼', kind: 'playoff' },
  PO2: { name: '2. Lig Play-Off', short: '2. Lig Play-Off', icon: '🔼', kind: 'playoff' },
};
export const UEFA = ['UCL', 'UEL', 'UECL'];
export const TR_LEAGUES = ['SL', 'TR1', 'TR2'];

export const STAGE_TR = {
  LP: 'Lig aşaması', Q2: '2. ön eleme', Q3: '3. ön eleme', PO: 'Play-off', KPO: 'Eleme play-off', R16: 'Son 16', QF: 'Çeyrek final',
  SF: 'Yarı final', F: 'Final', R1: '1. Tur', R2: '2. Tur', R3: '3. Tur', R4: '4. Tur',
};

const EXCLUDED_COUNTRIES = new Set(['SA', 'US', 'RU']); // UEFA kupalarına katılmayan ligler

export function fixtureLabel(f) {
  const c = COMPS[f.comp];
  if (!c) return '';
  if (c.kind === 'league') return `${c.short} · ${f.round}. hafta`;
  if (f.stage === 'LP') return `${c.short} · ${f.round}. maç günü`;
  return `${c.short} · ${STAGE_TR[f.stage] || f.stage}${f.leg ? ` (${f.leg}. maç)` : ''}`;
}

// Takvim: 2026-27 tarihleri esas alınır, sonraki sezonlarda aynı haftanın aynı gününe kaydırılır.
function dt(season, md, wd = null) {
  const [m, d] = md.split('-').map(Number);
  let iso = `${m >= 7 ? season : season + 1}-${md}`;
  if (wd == null) return iso;
  const cur = weekday(iso);
  const monBased = (x) => (x + 6) % 7;
  return addDays(iso, monBased(wd) - monBased(cur));
}

const UEFA_DATES = {
  UCL: { wd: 3, lp: ['09-09', '09-30', '10-21', '11-04', '11-25', '12-09', '01-20', '01-27'], KPO: ['02-17', '02-24'], R16: ['03-10', '03-17'], QF: ['04-07', '04-14'], SF: ['04-28', '05-05'], F: ['06-05', 6], Q2: ['07-22', '07-29'], Q3: ['08-05', '08-12'], PO: ['08-19', '08-26'] },
  UEL: { wd: 4, lp: ['09-17', '10-01', '10-22', '11-05', '11-26', '12-10', '01-21', '01-28'], KPO: ['02-18', '02-25'], R16: ['03-11', '03-18'], QF: ['04-08', '04-15'], SF: ['04-29', '05-06'], F: ['05-26', 3], Q2: ['07-23', '07-30'], Q3: ['08-06', '08-13'], PO: ['08-20', '08-27'] },
  UECL: { wd: 4, lp: ['10-15', '10-22', '11-05', '11-26', '12-10', '12-17'], KPO: ['02-18', '02-25'], R16: ['03-11', '03-18'], QF: ['04-08', '04-15'], SF: ['04-29', '05-06'], F: ['05-19', 3], Q2: ['07-23', '07-30'], Q3: ['08-06', '08-13'], PO: ['08-20', '08-27'] },
};
const UEFA_FINAL_VENUE = { UCL: 'Metropolitano (Madrid)', UEL: 'Tüpraş Stadyumu (İstanbul)', UECL: 'Red Bull Arena (Leipzig)' };

// UEFA ödülleri (2024-27 dönemi, yaklaşık)
const PRIZE = {
  UCL: { lp: 18.6e6, win: 2.1e6, draw: 0.7e6, KPO: 1e6, R16: 11e6, QF: 12.5e6, SF: 15e6, F: 18.5e6, champ: 6.5e6 },
  UEL: { lp: 4.3e6, win: 0.45e6, draw: 0.15e6, KPO: 0.3e6, R16: 1.75e6, QF: 2.5e6, SF: 4e6, F: 6e6, champ: 4e6 },
  UECL: { lp: 3.2e6, win: 0.4e6, draw: 0.13e6, KPO: 0.2e6, R16: 0.8e6, QF: 1.3e6, SF: 2.5e6, F: 4e6, champ: 3e6 },
  ZTK: { R16: 0.15e6, QF: 0.3e6, SF: 0.6e6, F: 1.2e6, champ: 2.5e6 },
};

function pay(state, teamId, amount) {
  const t = state.teams[teamId];
  if (!t || !amount) return;
  t.finance.balance += amount;
  t.finance.season.prize += amount;
}

const T = (state, id) => state.teams[id];
const nm = (state, id) => state.teams[id]?.name || id;

// ---------------- Lig fikstürleri ----------------
export function buildLeagueFixtures(state, comp, ids, season, startMd, breaks) {
  const list = shuffle(ids);
  const n = list.length;
  const arr = list.slice();
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
  const br = breaks.map(([a, b]) => [dt(season, a), dt(season, b)]);
  let sat = dt(season, startMd);
  while (weekday(sat) !== 6) sat = addDays(sat, 1);
  const dates = [];
  while (dates.length < rounds.length) {
    if (!br.some(([a, b]) => sat >= a && sat <= b)) dates.push(sat);
    sat = addDays(sat, 7);
  }
  const out = [];
  rounds.forEach((pairs, r) => {
    const offsets = shuffle([-1, 0, 0, 0, 1, 1, 1, 2, 2, 0, 1]);
    pairs.forEach(([home, away], i) => {
      out.push({ id: `${comp}${season}_${r + 1}_${i}`, comp, round: r + 1, date: addDays(dates[r], offsets[i % offsets.length]), home, away, played: false, hg: 0, ag: 0 });
    });
  });
  return out;
}

export const LEAGUE_SETUP = {
  SL: { start: '08-15', breaks: [['10-08', '10-14'], ['11-12', '11-18'], ['12-24', '01-14'], ['03-24', '03-30']] },
  TR1: { start: '08-15', breaks: [['12-26', '01-02']] },
  TR2: { start: '08-29', breaks: [['12-24', '01-09']] },
};

export function leagueRounds(comp, state) {
  const n = state.leagues[comp]?.length || 18;
  return (n - 1) * 2;
}

export function standings(state, comp = 'SL') {
  let ids;
  let pred;
  if (UEFA.includes(comp)) {
    ids = state.uefa?.[comp]?.teams || [];
    pred = (f) => f.comp === comp && f.stage === 'LP';
  } else {
    ids = state.leagues?.[comp] || [];
    pred = (f) => f.comp === comp;
  }
  const rows = {};
  for (const id of ids) rows[id] = { id, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
  for (const f of state.fixtures) {
    if (!f.played || !pred(f)) continue;
    const h = rows[f.home];
    const a = rows[f.away];
    if (!h || !a) continue;
    h.p++; a.p++;
    h.gf += f.hg; h.ga += f.ag; a.gf += f.ag; a.ga += f.hg;
    if (f.hg > f.ag) { h.w++; a.l++; h.pts += 3; } else if (f.hg < f.ag) { a.w++; h.l++; a.pts += 3; } else { h.d++; a.d++; h.pts++; a.pts++; }
  }
  return Object.values(rows).sort(
    (x, y) => y.pts - x.pts || (y.gf - y.ga) - (x.gf - x.ga) || y.gf - x.gf
      || (state.teams[x.id]?.name || '').localeCompare(state.teams[y.id]?.name || '', 'tr'),
  );
}

export function teamComps(state, teamId) {
  const out = [];
  const t = state.teams[teamId];
  if (t && TR_LEAGUES.includes(t.league)) out.push(t.league);
  if (state.cups?.ZTK?.alive?.includes(teamId) || state.fixtures.some((f) => f.comp === 'ZTK' && (f.home === teamId || f.away === teamId))) out.push('ZTK');
  for (const c of UEFA) {
    if (state.uefa?.[c]?.teams?.includes(teamId) || state.fixtures.some((f) => f.comp === c && (f.home === teamId || f.away === teamId))) out.push(c);
  }
  return out;
}

// ---------------- Kupa eşleşmeleri (tek maç / çift maç) ----------------
function createTie(state, { comp, stage, a, b, dates, neutral = false, single = false, venue = null, next = null }) {
  const id = `t${state.seq++}`;
  const tie = { id, comp, stage, teams: [a, b], legs: [], winner: null, next };
  const leg = (home, away, date, n, ko) => {
    const f = { id: `${id}_${n}`, comp, stage, tie: id, leg: single ? 0 : n, date, home, away, played: false, hg: 0, ag: 0, ko, neutral, venue };
    state.fixtures.push(f);
    tie.legs.push(f.id);
  };
  if (single) leg(a, b, dates[0], 1, true);
  else {
    leg(a, b, dates[0], 1, false);
    leg(b, a, dates[1], 2, true);
  }
  state.ties[id] = tie;
  return tie;
}

// İkinci maçta toplam skor (UEFA kuralı: deplasman golü yok, eşitlikte uzatma ve penaltılar)
export function aggregateBefore(state, f) {
  if (!f.tie || f.leg !== 2) return null;
  const tie = state.ties[f.tie];
  const l1 = tie && state.fixtures.find((x) => x.id === tie.legs[0]);
  if (!l1 || !l1.played) return [0, 0];
  return [l1.ag, l1.hg];
}

function tieWinner(state, tie) {
  const legs = tie.legs.map((id) => state.fixtures.find((f) => f.id === id));
  if (legs.some((f) => !f || !f.played)) return null;
  const last = legs[legs.length - 1];
  if (legs.length === 1) {
    if (last.hg !== last.ag) return last.hg > last.ag ? last.home : last.away;
    return last.pens ? (last.pens[0] > last.pens[1] ? last.home : last.away) : last.home;
  }
  const [a, b] = tie.teams;
  const ga = legs[0].hg + legs[1].ag;
  const gb = legs[0].ag + legs[1].hg;
  if (ga !== gb) return ga > gb ? a : b;
  if (last.pens) return last.pens[0] > last.pens[1] ? last.home : last.away;
  return last.hg >= last.ag ? last.home : last.away;
}

export function tieScore(state, tie) {
  const legs = tie.legs.map((id) => state.fixtures.find((f) => f.id === id)).filter(Boolean);
  const [a] = tie.teams;
  let ga = 0;
  let gb = 0;
  for (const f of legs) {
    if (!f.played) continue;
    if (f.home === a) { ga += f.hg; gb += f.ag; } else { ga += f.ag; gb += f.hg; }
  }
  return [ga, gb];
}

// ---------------- Lig aşaması kurası ----------------
function drawBudget() {
  return { n: 0, max: 60000 };
}

function makeGraph(state, ids, sameCountryMax) {
  const C = (id) => state.teams[id].country;
  const adj = new Map(ids.map((id) => [id, new Set()]));
  const cc = new Map(ids.map((id) => [id, {}]));
  return {
    can(u, v) {
      if (u === v || C(u) === C(v) || adj.get(u).has(v)) return false;
      return (cc.get(u)[C(v)] || 0) < sameCountryMax && (cc.get(v)[C(u)] || 0) < sameCountryMax;
    },
    add(u, v) {
      adj.get(u).add(v); adj.get(v).add(u);
      cc.get(u)[C(v)] = (cc.get(u)[C(v)] || 0) + 1;
      cc.get(v)[C(u)] = (cc.get(v)[C(u)] || 0) + 1;
    },
    del(u, v) {
      adj.get(u).delete(v); adj.get(v).delete(u);
      cc.get(u)[C(v)]--; cc.get(v)[C(u)]--;
    },
  };
}

function dfsMatching(A, B, g, budget) {
  const pairs = [];
  const usedB = new Set();
  const rec = (i) => {
    if (++budget.n > budget.max) return false;
    if (i === A.length) return true;
    for (const b of shuffle(B)) {
      if (usedB.has(b) || !g.can(A[i], b)) continue;
      g.add(A[i], b); usedB.add(b); pairs.push([A[i], b]);
      if (rec(i + 1)) return true;
      pairs.pop(); usedB.delete(b); g.del(A[i], b);
    }
    return false;
  };
  return rec(0) ? pairs : null;
}

function dfsCycle(P, g, budget) {
  const order = [P[0]];
  const used = new Set([P[0]]);
  const rec = () => {
    if (++budget.n > budget.max) return false;
    const last = order[order.length - 1];
    if (order.length === P.length) {
      if (!g.can(last, order[0])) return false;
      g.add(last, order[0]);
      return true;
    }
    for (const x of shuffle(P)) {
      if (used.has(x) || !g.can(last, x)) continue;
      g.add(last, x); used.add(x); order.push(x);
      if (rec()) return true;
      order.pop(); used.delete(x); g.del(last, x);
    }
    return false;
  };
  return rec() ? order : null;
}

function dfsWithin(P, g, budget) {
  const pairs = [];
  const used = new Set();
  const rec = () => {
    if (++budget.n > budget.max) return false;
    const first = P.find((x) => !used.has(x));
    if (!first) return true;
    used.add(first);
    for (const y of shuffle(P)) {
      if (used.has(y) || !g.can(first, y)) continue;
      g.add(first, y); used.add(y); pairs.push([first, y]);
      if (rec()) return true;
      pairs.pop(); used.delete(y); g.del(first, y);
    }
    used.delete(first);
    return false;
  };
  return rec() ? pairs : null;
}

// k renkli kenar boyama (her takım her maç gününde bir kez oynasın)
function edgeColor(edges, k, budget) {
  const colorAt = new Map();
  const res = new Array(edges.length);
  const key = (v, c) => `${v}|${c}`;
  const order = edges.map((e, i) => i);
  const rec = (idx) => {
    if (++budget.n > budget.max) return false;
    if (idx === order.length) return true;
    const i = order[idx];
    const [u, v] = edges[i];
    for (const c of shuffle([...Array(k).keys()])) {
      if (colorAt.has(key(u, c)) || colorAt.has(key(v, c))) continue;
      colorAt.set(key(u, c), 1); colorAt.set(key(v, c), 1); res[i] = c;
      if (rec(idx + 1)) return true;
      colorAt.delete(key(u, c)); colorAt.delete(key(v, c));
    }
    return false;
  };
  return rec(0) ? res : null;
}

// UCL/UEL: 4 torba x 9 takım, her torbadan 2 rakip (biri iç saha biri deplasman), 8 maç günü.
function drawNinePots(state, pots) {
  for (let attempt = 0; attempt < 400; attempt++) {
    const ids = pots.flat();
    const g = makeGraph(state, ids, 2);
    const budget = drawBudget();
    const cycles = [];
    let fail = false;
    for (const p of pots) {
      const c = dfsCycle(shuffle(p), g, budget);
      if (!c) { fail = true; break; }
      cycles.push(c);
    }
    if (fail) continue;
    const M = {};
    for (const [i, j] of [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]]) {
      for (const tag of ['a', 'b']) {
        const m = dfsMatching(pots[i], pots[j], g, budget);
        if (!m) { fail = true; break; }
        M[`${i}${j}${tag}`] = m;
      }
      if (fail) break;
    }
    if (fail) continue;
    const cycEdges = (c) => c.map((x, k) => [x, c[(k + 1) % c.length]]);
    const X = [...cycEdges(cycles[0]), ...cycEdges(cycles[1]), ...M['01a'], ...M['01b']];
    const Y = [...cycEdges(cycles[2]), ...cycEdges(cycles[3]), ...M['23a'], ...M['23b']];
    const cx = edgeColor(X, 4, drawBudget());
    const cy = cx && edgeColor(Y, 4, drawBudget());
    if (!cx || !cy) continue;
    // Yön: döngüde sıradaki takıma ev sahipliği; "a" eşleşmesinde ilk torba, "b" eşleşmesinde ikinci torba ev sahibi.
    // Böylece her takım her torbadan bir rakibi iç sahada, birini deplasmanda ağırlar.
    const days = [[], [], [], [], [], [], [], []];
    const flip = (e) => [e[1], e[0]];
    X.forEach((e, i) => days[4 + cx[i]].push(M['01b'].includes(e) ? flip(e) : e));
    Y.forEach((e, i) => days[4 + cy[i]].push(M['23b'].includes(e) ? flip(e) : e));
    days[0].push(...M['02a'], ...M['13a']);
    days[1].push(...M['02b'].map(flip), ...M['13b'].map(flip));
    days[2].push(...M['03a'], ...M['12a']);
    days[3].push(...M['03b'].map(flip), ...M['12b'].map(flip));
    return shuffle(days);
  }
  return null;
}

// UECL: 6 torba x 6 takım, her torbadan 1 rakip, 6 maç günü (3 iç saha, 3 deplasman).
function drawSixPots(state, pots) {
  const rr = [[[0, 1], [2, 3], [4, 5]], [[0, 2], [1, 4], [3, 5]], [[0, 3], [1, 5], [2, 4]], [[0, 4], [1, 3], [2, 5]], [[0, 5], [1, 2], [3, 4]]];
  for (let attempt = 0; attempt < 400; attempt++) {
    const g = makeGraph(state, pots.flat(), 2);
    const budget = drawBudget();
    let fail = false;
    const days = [];
    const intra = [];
    for (const p of pots) {
      const m = dfsWithin(shuffle(p), g, budget);
      if (!m) { fail = true; break; }
      intra.push(...m);
    }
    if (fail) continue;
    for (const round of rr) {
      const day = [];
      for (const [i, j] of round) {
        const m = dfsMatching(pots[i], pots[j], g, budget);
        if (!m) { fail = true; break; }
        day.push(...m);
      }
      if (fail) break;
      days.push(day);
    }
    if (fail) continue;
    days.push(intra);
    // Euler yönlendirmesi: 6 düzenli çizgede her takıma 3 iç saha, 3 deplasman
    const all = days.flatMap((d, di) => d.map((e) => ({ e, di, used: false })));
    const inc = new Map();
    for (const x of all) for (const v of x.e) (inc.get(v) || inc.set(v, []).get(v)).push(x);
    for (const start of inc.keys()) {
      const stack = [start];
      while (stack.length) {
        const v = stack[stack.length - 1];
        const next = inc.get(v).find((x) => !x.used);
        if (!next) { stack.pop(); continue; }
        next.used = true;
        const w = next.e[0] === v ? next.e[1] : next.e[0];
        next.e = [v, w];
        stack.push(w);
      }
    }
    const out = [[], [], [], [], [], []];
    for (const x of all) out[x.di].push(x.e);
    return shuffle(out);
  }
  return null;
}

function potsByRep(state, ids, n, holder = null) {
  const sorted = ids.slice().sort((a, b) => (b === holder) - (a === holder) || state.teams[b].rep - state.teams[a].rep);
  const size = ids.length / n;
  return [...Array(n).keys()].map((i) => sorted.slice(i * size, (i + 1) * size));
}

function leaguePhaseDraw(state, comp) {
  const season = state.season;
  const U = state.uefa[comp];
  const nine = comp !== 'UECL';
  const days = nine ? drawNinePots(state, U.pots) : drawSixPots(state, U.pots);
  if (!days) return false;
  const D = UEFA_DATES[comp];
  days.forEach((pairs, di) => {
    const date = dt(season, D.lp[di], D.wd);
    pairs.forEach(([home, away], k) => {
      state.fixtures.push({ id: `${comp}${season}_md${di + 1}_${k}`, comp, stage: 'LP', round: di + 1, date, home, away, played: false, hg: 0, ag: 0 });
    });
  });
  U.stage = 'LP';
  for (const id of U.teams) pay(state, id, PRIZE[comp].lp);
  return true;
}

// ---------------- UEFA katılımcıları ----------------
function turkishInLP(state, comp) {
  return (state.qual?.[comp]?.LP || []).slice();
}

function selectParticipants(state, comp) {
  const season = state.season;
  if (season === 2026 && LEAGUE_PHASE_2026[comp]) {
    const pots = LEAGUE_PHASE_2026[comp].map((p) => p.filter((id) => state.teams[id]));
    return { teams: pots.flat(), pots };
  }
  const size = 36;
  const taken = new Set(UEFA.filter((c) => c !== comp).flatMap((c) => state.uefa[c]?.teams || []));
  const chosen = [];
  const add = (id) => { if (id && state.teams[id] && !chosen.includes(id) && !taken.has(id)) chosen.push(id); };
  if (comp === 'UCL') {
    add(state.euroHolders?.UCL);
    add(state.euroHolders?.UEL);
  }
  for (const id of turkishInLP(state, comp)) add(id);
  for (const id of state.qual?.[comp]?.foreign || []) add(id);
  const quota = {
    UCL: { EN: 5, ES: 5, DE: 4, IT: 4, FR: 3, PT: 2, NL: 2, BE: 2 },
    UEL: { EN: 2, ES: 2, DE: 2, IT: 2, FR: 2, PT: 2, NL: 2 },
    UECL: { EN: 1, ES: 1, DE: 1, IT: 1, FR: 1 },
  }[comp];
  const count = (c) => chosen.filter((id) => state.teams[id].country === c).length;
  const scores = state.euroScore || {};
  const cands = Object.values(state.teams)
    .filter((t) => t.country !== 'TR' && !EXCLUDED_COUNTRIES.has(t.country) && !taken.has(t.id) && !chosen.includes(t.id))
    .sort((a, b) => (scores[b.id] ?? b.rep) - (scores[a.id] ?? a.rep));
  for (const pass of [0, 1]) {
    for (const t of cands) {
      if (chosen.length >= size) break;
      if (chosen.includes(t.id)) continue;
      const q = quota[t.country] ?? (comp === 'UECL' ? 2 : 1);
      if (pass === 0 && count(t.country) >= q) continue;
      add(t.id);
    }
  }
  const teams = chosen.slice(0, size);
  const pots = potsByRep(state, teams, comp === 'UECL' ? 6 : 4, comp === 'UCL' ? state.euroHolders?.UCL : null);
  return { teams, pots };
}

function drawNewsLP(state, comp) {
  const U = state.uefa[comp];
  const trs = U.teams.filter((id) => state.teams[id].country === 'TR');
  const lines = trs.map((id) => {
    const opps = state.fixtures.filter((f) => f.comp === comp && f.stage === 'LP' && (f.home === id || f.away === id))
      .sort((a, b) => a.round - b.round)
      .map((f) => (f.home === id ? `${nm(state, f.away)} (iç saha)` : `${nm(state, f.home)} (deplasman)`));
    return `${nm(state, id)}: ${opps.join(', ')}`;
  });
  addNews(state, `${COMPS[comp].name} lig aşaması kurası çekildi. ${lines.join(' · ') || 'Türk temsilcisi yok.'}`, 'europe', trs, `${COMPS[comp].short} kurası çekildi`);
  for (const id of trs) {
    if (!isHuman(state, id)) continue;
    const line = lines.find((l) => l.startsWith(nm(state, id)));
    addMessage(state, { teamId: id, title: `${COMPS[comp].short} kurası: rakipleriniz belli oldu`, body: `${COMPS[comp].name} lig aşamasındaki rakipleriniz: ${line.split(': ')[1]}. Katılım primi olarak ${fmtMoney(PRIZE[comp].lp)} kasanıza girdi.` });
  }
}

// ---------------- UEFA eleme turları ----------------
function uefaKnockoutPlayoffDraw(state, comp) {
  const table = standings(state, comp);
  const U = state.uefa[comp];
  U.table = table.map((r) => r.id);
  const seeds = U.table;
  U.top8 = seeds.slice(0, 8);
  for (const id of seeds.slice(24)) addNews(state, `${nm(state, id)}, ${COMPS[comp].short} lig aşamasında ${seeds.indexOf(id) + 1}. sırada kalarak elendi.`, 'europe', [id]);
  const blocks = [[[8, 9], [22, 23]], [[10, 11], [20, 21]], [[12, 13], [18, 19]], [[14, 15], [16, 17]]];
  const D = UEFA_DATES[comp];
  U.kpo = [];
  const texts = [];
  for (const [hi, lo] of blocks) {
    const H = shuffle(hi.map((i) => seeds[i]).filter(Boolean));
    const L = shuffle(lo.map((i) => seeds[i]).filter(Boolean));
    const ties = [];
    for (let k = 0; k < Math.min(H.length, L.length); k++) {
      const tie = createTie(state, { comp, stage: 'KPO', a: L[k], b: H[k], dates: [dt(state.season, D.KPO[0], D.wd), dt(state.season, D.KPO[1], D.wd)] });
      ties.push(tie.id);
      texts.push(`${nm(state, L[k])} - ${nm(state, H[k])}`);
    }
    U.kpo.push(ties);
  }
  for (const id of U.top8) pay(state, id, PRIZE[comp].R16);
  U.stage = 'KPO';
  const trs = seeds.filter((id) => state.teams[id].country === 'TR');
  addNews(state, `${COMPS[comp].short} eleme play-off kurası çekildi: ${texts.join(', ')}. Son 16'ya doğrudan kalanlar: ${U.top8.map((id) => nm(state, id)).join(', ')}.`, 'europe', trs, `${COMPS[comp].short} play-off kurası`);
}

function uefaR16Draw(state, comp) {
  const U = state.uefa[comp];
  const D = UEFA_DATES[comp];
  const winners = U.kpo.map((ties) => shuffle(ties.map((id) => state.ties[id].winner).filter(Boolean)));
  const top = U.top8;
  const groups = [[top[6], top[7]], [top[4], top[5]], [top[2], top[3]], [top[0], top[1]]].map((g) => shuffle(g.filter(Boolean)));
  const ties = [[], [], [], []];
  groups.forEach((g, gi) => {
    const W = winners[gi] || [];
    g.forEach((seed, k) => {
      if (!W[k]) return;
      const tie = createTie(state, { comp, stage: 'R16', a: W[k], b: seed, dates: [dt(state.season, D.R16[0], D.wd), dt(state.season, D.R16[1], D.wd)] });
      ties[3 - gi].push(tie.id);
    });
  });
  // Yol haritası: yarı 1 [A0, D0, B0, C0], yarı 2 [A1, D1, B1, C1]
  const [A, B, C, Dd] = ties;
  U.bracket = { R16: [A[0], Dd[0], B[0], C[0], A[1], Dd[1], B[1], C[1]].filter(Boolean) };
  U.stage = 'R16';
  const pairs = U.bracket.R16.map((id) => state.ties[id].teams.map((t) => nm(state, t)).join(' - '));
  const trs = U.teams.filter((id) => state.teams[id].country === 'TR');
  addNews(state, `${COMPS[comp].short} son 16 kurası çekildi: ${pairs.join(', ')}.`, 'europe', trs, `${COMPS[comp].short} son 16 kurası`);
}

function uefaNextStage(state, comp, stage) {
  const U = state.uefa[comp];
  const prev = { QF: 'R16', SF: 'QF', F: 'SF' }[stage];
  const list = U.bracket?.[prev] || [];
  if (!list.length || list.some((id) => !state.ties[id].winner)) return false;
  const D = UEFA_DATES[comp];
  const W = list.map((id) => state.ties[id].winner);
  U.bracket[stage] = [];
  const texts = [];
  for (let i = 0; i + 1 < W.length; i += 2) {
    const [a, b] = shuffle([W[i], W[i + 1]]);
    let tie;
    if (stage === 'F') {
      tie = createTie(state, { comp, stage, a, b, dates: [dt(state.season, D.F[0], D.F[1])], single: true, neutral: true, venue: UEFA_FINAL_VENUE[comp] });
    } else {
      tie = createTie(state, { comp, stage, a, b, dates: [dt(state.season, D[stage][0], D.wd), dt(state.season, D[stage][1], D.wd)] });
    }
    U.bracket[stage].push(tie.id);
    texts.push(`${nm(state, a)} - ${nm(state, b)}`);
    pay(state, a, PRIZE[comp][stage]);
    pay(state, b, PRIZE[comp][stage]);
  }
  U.stage = stage;
  const involved = W.filter((id) => state.teams[id].country === 'TR');
  addNews(state, `${COMPS[comp].short} ${STAGE_TR[stage].toLocaleLowerCase('tr')} eşleşmeleri: ${texts.join(', ')}${stage === 'F' ? ` · Final ${UEFA_FINAL_VENUE[comp]}` : ''}.`, 'europe', involved, `${COMPS[comp].short} ${STAGE_TR[stage]}`);
  return true;
}

// ---------------- Ön elemeler (2027-28 sezonundan itibaren) ----------------
const QUAL_ROUTE = {
  UCL: { Q2: { win: ['UCL', 'Q3'], lose: ['UEL', 'Q3'] }, Q3: { win: ['UCL', 'PO'], lose: ['UEL', 'PO'] }, PO: { win: ['UCL', 'LP'], lose: ['UEL', 'LP'] } },
  UEL: { Q2: { win: ['UEL', 'Q3'], lose: ['UECL', 'Q3'] }, Q3: { win: ['UEL', 'PO'], lose: ['UECL', 'PO'] }, PO: { win: ['UEL', 'LP'], lose: ['UECL', 'LP'] } },
  UECL: { Q2: { win: ['UECL', 'Q3'], lose: null }, Q3: { win: ['UECL', 'PO'], lose: null }, PO: { win: ['UECL', 'LP'], lose: null } },
};
const QUAL_REP = { Q2: [58, 74], Q3: [62, 77], PO: [66, 81] };

function qualOpponent(state, comp, stage) {
  const used = new Set(state.qual.usedOpp || []);
  const [lo, hi] = QUAL_REP[stage];
  const shift = comp === 'UCL' ? 3 : comp === 'UECL' ? -5 : 0;
  const pool = Object.values(state.teams).filter((t) => t.country !== 'TR' && !EXCLUDED_COUNTRIES.has(t.country) && !used.has(t.id)
    && t.rep >= lo + shift && t.rep <= hi + shift);
  const t = pool.length ? pick(pool) : pick(Object.values(state.teams).filter((x) => x.country !== 'TR' && !EXCLUDED_COUNTRIES.has(x.country)));
  state.qual.usedOpp = [...used, t.id];
  return t.id;
}

function qualDraw(state, stage) {
  const texts = [];
  const involved = [];
  for (const comp of UEFA) {
    const list = state.qual?.[comp]?.[stage] || [];
    const D = UEFA_DATES[comp];
    for (const tr of list) {
      const opp = qualOpponent(state, comp, stage);
      const [a, b] = chance(0.5) ? [tr, opp] : [opp, tr];
      createTie(state, { comp, stage, a, b, dates: [dt(state.season, D[stage][0], D.wd), dt(state.season, D[stage][1], D.wd)] });
      texts.push(`${COMPS[comp].short} ${STAGE_TR[stage]}: ${nm(state, tr)} - ${nm(state, opp)}`);
      involved.push(tr);
      if (isHuman(state, tr)) {
        addMessage(state, { teamId: tr, title: `${COMPS[comp].short} ${STAGE_TR[stage]} kurası`, body: `Rakibiniz ${nm(state, opp)} (${state.teams[opp].country}). İlk maç ${dt(state.season, D[stage][0], D.wd).split('-').reverse().join('.')} tarihinde.` });
      }
    }
    if (state.qual?.[comp]) state.qual[comp][stage] = [];
  }
  if (texts.length) addNews(state, `UEFA ${STAGE_TR[stage]} kuraları çekildi. ${texts.join(' · ')}`, 'europe', involved, `Avrupa'da ${STAGE_TR[stage]} kurası`);
}

function onQualTie(state, tie) {
  const route = QUAL_ROUTE[tie.comp][tie.stage];
  const w = tie.winner;
  const l = tie.teams.find((x) => x !== w);
  const [sa, sb] = tieScore(state, tie);
  const score = `${nm(state, tie.teams[0])} ${sa}-${sb} ${nm(state, tie.teams[1])} (toplam)`;
  for (const [team, res] of [[w, 'win'], [l, 'lose']]) {
    const tr = state.teams[team].country === 'TR';
    const r = route[res];
    if (tr) {
      if (r) {
        const [c, st] = r;
        (state.qual[c][st] ||= []).push(team);
        const txt = st === 'LP' ? `${COMPS[c].name} lig aşamasına katıldı` : `${COMPS[c].short} ${STAGE_TR[st]} turuna yoluna devam ediyor`;
        addNews(state, `${nm(state, team)} ${res === 'win' ? 'turu geçti' : 'elendi'}: ${score}. ${nm(state, team)}, ${txt}.`, 'europe', [team]);
      } else {
        addNews(state, `${nm(state, team)}, ${COMPS[tie.comp].short} ${STAGE_TR[tie.stage]} turunda elenerek Avrupa'ya veda etti: ${score}.`, 'europe', [team]);
      }
    } else if (tie.stage === 'PO' && r && r[1] === 'LP') {
      (state.qual[r[0]].foreign ||= []).push(team);
    }
  }
}

// ---------------- Ziraat Türkiye Kupası ----------------
const ZTK_DATES = { R1: ['09-01', '09-16'], R2: ['09-22', '10-07'], R3: ['10-13', '10-28'], R4: ['11-10', '12-02'], R16: ['12-15', '01-13'], QF: ['01-20', '02-03'], SF: ['02-10', '03-03', '04-21'], F: ['05-05', '05-29'] };
const tier = (state, id) => ({ SL: 0, TR1: 1, TR2: 2 }[state.teams[id]?.league] ?? 1);

function cupDraw(state, stage) {
  const Z = state.cups.ZTK;
  const season = state.season;
  let teams = Z.alive.slice();
  if (stage === 'R3') teams.push(...Z.entry.R3);
  if (stage === 'R4') teams.push(...Z.entry.R4);
  if (stage === 'R16') teams.push(...Z.entry.R16);
  teams = shuffle([...new Set(teams)].filter((id) => state.teams[id]));
  Z.alive = [];
  const texts = [];
  if (teams.length % 2 === 1) {
    const bye = teams.sort((a, b) => tier(state, a) - tier(state, b) || state.teams[b].rep - state.teams[a].rep)[0];
    teams = shuffle(teams.filter((x) => x !== bye));
    Z.alive.push(bye);
    texts.push(`${nm(state, bye)} bay geçti`);
  }
  Z.round = stage;
  Z.ties[stage] = [];
  for (let i = 0; i + 1 < teams.length; i += 2) {
    let [a, b] = [teams[i], teams[i + 1]];
    if (tier(state, b) > tier(state, a)) [a, b] = [b, a];
    let tie;
    if (stage === 'SF') tie = createTie(state, { comp: 'ZTK', stage, a, b, dates: [dt(season, ZTK_DATES.SF[1], 3), dt(season, ZTK_DATES.SF[2], 3)] });
    else if (stage === 'F') tie = createTie(state, { comp: 'ZTK', stage, a, b, dates: [dt(season, ZTK_DATES.F[1])], single: true, neutral: true, venue: 'Tarafsız saha' });
    else tie = createTie(state, { comp: 'ZTK', stage, a, b, dates: [dt(season, ZTK_DATES[stage][1], 3)], single: true });
    Z.ties[stage].push(tie.id);
    texts.push(`${nm(state, a)} - ${nm(state, b)}`);
    if (PRIZE.ZTK[stage]) { pay(state, a, PRIZE.ZTK[stage]); pay(state, b, PRIZE.ZTK[stage]); }
    for (const id of [a, b]) {
      if (!isHuman(state, id)) continue;
      const opp = id === a ? b : a;
      addMessage(state, { teamId: id, title: `Türkiye Kupası ${STAGE_TR[stage]}: rakip ${nm(state, opp)}`, body: `Ziraat Türkiye Kupası ${STAGE_TR[stage].toLocaleLowerCase('tr')} kurasında rakibiniz ${nm(state, opp)} oldu.`, quiet: true });
    }
  }
  const involved = teams.filter((id) => tier(state, id) === 0);
  addNews(state, `Ziraat Türkiye Kupası ${STAGE_TR[stage].toLocaleLowerCase('tr')} kurası çekildi: ${texts.join(', ')}.`, 'cup', involved, `Türkiye Kupası ${STAGE_TR[stage]} kurası`);
}

function onCupTie(state, tie) {
  const Z = state.cups.ZTK;
  const w = tie.winner;
  const l = tie.teams.find((x) => x !== w);
  if (tie.stage === 'F') {
    Z.winner = w;
    pay(state, w, PRIZE.ZTK.champ);
    addNews(state, `🏆 Ziraat Türkiye Kupası'nın sahibi ${nm(state, w)}! Finalde ${nm(state, l)} mağlup edildi.`, 'cup', [w, l], 'Türkiye Kupası şampiyonu');
    state.trophyEvents = [...(state.trophyEvents || []), { comp: 'ZTK', teamId: w, runnerUp: l, season: state.season }];
    return;
  }
  Z.alive.push(w);
  if (tier(state, l) < tier(state, w) || state.teams[l].rep - state.teams[w].rep >= 18) {
    addNews(state, `Kupada sürpriz! ${nm(state, w)}, ${nm(state, l)} takımını eleyerek bir üst tura çıktı.`, 'cup', [w, l]);
  }
}

// ---------------- Play-off (1. Lig ve 2. Lig) ----------------
function leaguePlayoffs(state, comp) {
  const table = standings(state, comp);
  const po = comp === 'TR1' ? 'PO1' : 'PO2';
  const ids = table.slice(2, 6).map((r) => r.id);
  state.playoffs = state.playoffs || {};
  const P = (state.playoffs[po] = { ties: [], final: null, promoted: [], direct: table.slice(0, 2).map((r) => r.id) });
  if (ids.length < 4) return;
  // Play-off tarihleri ligin bittiği güne göre belirlenir (yarı final 4 ve 8 gün sonra, final 14 gün sonra).
  const d1 = addDays(state.date, 3);
  const d2 = addDays(state.date, 6);
  if (comp === 'TR1') {
    P.ties.push(createTie(state, { comp: po, stage: 'SF', a: ids[3], b: ids[0], dates: [d1, d2] }).id);
    P.ties.push(createTie(state, { comp: po, stage: 'SF', a: ids[2], b: ids[1], dates: [d1, d2] }).id);
  } else {
    P.ties.push(createTie(state, { comp: po, stage: 'SF', a: ids[0], b: ids[3], dates: [d1], single: true }).id);
    P.ties.push(createTie(state, { comp: po, stage: 'SF', a: ids[1], b: ids[2], dates: [d1], single: true }).id);
  }
  addNews(state, `${COMPS[comp].short} sona erdi. ${P.direct.map((id) => nm(state, id)).join(' ve ')} doğrudan yükseldi. Play-off: ${ids.map((id) => nm(state, id)).join(', ')}.`, 'league', [...P.direct, ...ids], `${COMPS[comp].short} tamamlandı`);
}

function onPlayoffTie(state, tie) {
  const P = state.playoffs[tie.comp];
  if (tie.comp === 'PO2') {
    P.promoted.push(tie.winner);
    addNews(state, `${nm(state, tie.winner)}, 2. Lig play-off'unda ${nm(state, tie.teams.find((x) => x !== tie.winner))} takımını eleyerek 1. Lig'e yükseldi!`, 'league', [tie.winner]);
    return;
  }
  if (tie.stage === 'SF') {
    const done = P.ties.map((id) => state.ties[id]).filter((t) => t.stage === 'SF' && t.winner);
    if (done.length === 2 && !P.final) {
      const [a, b] = shuffle(done.map((t) => t.winner));
      P.final = createTie(state, { comp: 'PO1', stage: 'F', a, b, dates: [addDays(state.date, 4)], single: true, neutral: true, venue: 'Tarafsız saha' }).id;
      addNews(state, `1. Lig play-off finali: ${nm(state, a)} - ${nm(state, b)}.`, 'league', [a, b]);
    }
  } else {
    P.promoted.push(tie.winner);
    addNews(state, `${nm(state, tie.winner)}, play-off finalini kazanarak Süper Lig'e yükseldi!`, 'league', [tie.winner], 'Süper Lig\'e yükselen son takım');
  }
}

// ---------------- Maç sonrası ----------------
export function afterFixture(state, f) {
  if (UEFA.includes(f.comp)) {
    if (f.stage === 'LP') {
      if (f.hg > f.ag) pay(state, f.home, PRIZE[f.comp].win);
      else if (f.ag > f.hg) pay(state, f.away, PRIZE[f.comp].win);
      else { pay(state, f.home, PRIZE[f.comp].draw); pay(state, f.away, PRIZE[f.comp].draw); }
    }
    const trTeams = [f.home, f.away].filter((id) => state.teams[id].country === 'TR');
    if (trTeams.length) {
      const score = `${nm(state, f.home)} ${f.hg}-${f.ag} ${nm(state, f.away)}${f.pens ? ` (pen. ${f.pens[0]}-${f.pens[1]})` : ''}`;
      addNews(state, `${COMPS[f.comp].short} ${STAGE_TR[f.stage].toLocaleLowerCase('tr')}${f.stage === 'LP' ? ` ${f.round}. maç` : ''}: ${score}.`, 'europe', trTeams);
    }
  }
  if (!f.tie) return;
  const tie = state.ties[f.tie];
  if (!tie || tie.winner) return;
  const w = tieWinner(state, tie);
  if (!w) return;
  tie.winner = w;
  if (f.comp === 'ZTK') return onCupTie(state, tie);
  if (f.comp === 'PO1' || f.comp === 'PO2') return onPlayoffTie(state, tie);
  if (['Q2', 'Q3', 'PO'].includes(tie.stage)) return onQualTie(state, tie);
  if (tie.stage === 'F') {
    const l = tie.teams.find((x) => x !== w);
    state.uefa[tie.comp].winner = w;
    pay(state, w, PRIZE[tie.comp].champ);
    addNews(state, `🏆 ${COMPS[tie.comp].name} şampiyonu ${nm(state, w)}! Finalde ${nm(state, l)} yenildi.`, 'europe', [w, l], `${COMPS[tie.comp].short} şampiyonu`);
    state.trophyEvents = [...(state.trophyEvents || []), { comp: tie.comp, teamId: w, runnerUp: l, season: state.season }];
    return;
  }
  const l = tie.teams.find((x) => x !== w);
  if (state.teams[w].country === 'TR' || state.teams[l].country === 'TR') {
    const [sa, sb] = tieScore(state, tie);
    addNews(state, `${COMPS[tie.comp].short} ${STAGE_TR[tie.stage].toLocaleLowerCase('tr')}: ${nm(state, w)} turu geçti (${nm(state, tie.teams[0])} ${sa}-${sb} ${nm(state, tie.teams[1])}).`, 'europe', [w, l].filter((id) => state.teams[id].country === 'TR'));
  }
}

// ---------------- Sezon kurulumu ve takvim ----------------
function addEvent(state, date, kind, data = {}) {
  state.cal.push({ date, kind, ...data });
}

export function setupSeasonComps(state) {
  const season = state.season;
  state.ties = {};
  state.cal = [];
  state.playoffs = {};
  state.uefa = { UCL: { teams: [], pots: [], stage: 'pre' }, UEL: { teams: [], pots: [], stage: 'pre' }, UECL: { teams: [], pots: [], stage: 'pre' } };
  state.qual = state.qual && state.qual.season === season ? state.qual : { season, UCL: {}, UEL: {}, UECL: {}, usedOpp: [] };
  // 2026-27: ön elemeler oyun başlamadan önce oynandı, lig aşaması takımları gerçek sonuçlara göre belli.
  if (season === 2026) state.qual = { season, UCL: { LP: ['gs', 'fb'] }, UEL: { LP: ['bjk'] }, UECL: { LP: ['ts'] }, usedOpp: [] };

  // Kupa katılımcıları
  const european = new Set(Object.values(state.qual).flatMap((c) => (c && typeof c === 'object' && !Array.isArray(c) ? Object.values(c).flat() : [])).filter((id) => state.teams[id]?.country === 'TR'));
  if (season === 2026) ['gs', 'fb', 'bjk', 'ts', 'ibfk'].forEach((id) => european.add(id));
  const holder = state.cups?.ZTK?.winner || (season === 2026 ? 'ts' : null);
  if (holder) european.add(holder);
  const slRank = state.lastSLRank || [];
  const rankOf = (id) => {
    const i = slRank.indexOf(id);
    return i < 0 ? 99 - state.teams[id].rep / 10 : i;
  };
  const sl = state.leagues.SL.filter((id) => !european.has(id)).sort((a, b) => rankOf(b) - rankOf(a));
  const R3sl = sl.slice(0, 6);
  const R4sl = sl.slice(6);
  const R16 = [...european].filter((id) => state.teams[id] && TR_LEAGUES.includes(state.teams[id].league));
  state.cups = {
    ZTK: {
      holder,
      winner: null,
      alive: state.leagues.TR2.slice(),
      entry: { R3: [...state.leagues.TR1.filter((id) => !R16.includes(id)), ...R3sl], R4: R4sl, R16 },
      ties: {},
      round: null,
    },
  };
  for (const [stage, [drawMd]] of Object.entries(ZTK_DATES)) {
    if (stage === 'F') addEvent(state, dt(season, drawMd), 'cupFinal');
    else addEvent(state, dt(season, drawMd), 'cupDraw', { stage });
  }

  // UEFA
  if (season === 2026) {
    addEvent(state, '2026-08-10', 'news', { text: 'Başakşehir, UEFA Konferans Ligi 2. ön eleme turunda Inter Turku\'ya elenerek Avrupa\'ya erken veda etti (1-1, 0-2).', cat: 'europe', teams: ['ibfk'] });
    addEvent(state, '2026-08-26', 'news', { text: 'Fenerbahçe, play-off turunu geçerek UEFA Şampiyonlar Ligi lig aşamasına yükseldi!', cat: 'europe', teams: ['fb'] });
    addEvent(state, '2026-08-27', 'news', { text: 'Beşiktaş, play-off turunda Kauno Žalgiris\'i eleyerek UEFA Avrupa Ligi lig aşamasına katıldı.', cat: 'europe', teams: ['bjk'] });
    addEvent(state, '2026-08-27', 'news', { text: 'Trabzonspor, Avrupa Ligi play-off turunda Ferencváros\'a elendi (0-1, 0-4) ve UEFA Konferans Ligi lig aşamasında mücadele edecek.', cat: 'europe', teams: ['ts'] });
    addEvent(state, '2026-08-27', 'uefaDraw', { comp: 'UCL' });
    addEvent(state, '2026-08-28', 'uefaDraw', { comp: 'UEL' });
    addEvent(state, '2026-08-28', 'uefaDraw', { comp: 'UECL' });
  } else {
    addEvent(state, dt(season, '07-01'), 'qualDraw', { stage: 'Q2' });
    addEvent(state, dt(season, '07-31'), 'qualDraw', { stage: 'Q3' });
    addEvent(state, dt(season, '08-14'), 'qualDraw', { stage: 'PO' });
    addEvent(state, dt(season, '08-28'), 'uefaDraw', { comp: 'UCL' });
    addEvent(state, dt(season, '08-29'), 'uefaDraw', { comp: 'UEL' });
    addEvent(state, dt(season, '08-29'), 'uefaDraw', { comp: 'UECL' });
  }
  for (const comp of UEFA) {
    addEvent(state, dt(season, '01-30'), 'uefaKPO', { comp });
    addEvent(state, dt(season, '02-27'), 'uefaR16', { comp });
    addEvent(state, dt(season, '03-20'), 'uefaNext', { comp, stage: 'QF' });
    addEvent(state, dt(season, '04-17'), 'uefaNext', { comp, stage: 'SF' });
    addEvent(state, dt(season, '05-08'), 'uefaNext', { comp, stage: 'F' });
  }
  addEvent(state, dt(season, '04-06'), 'playoffs', { comp: 'TR2' });
  addEvent(state, dt(season, '05-12'), 'playoffs', { comp: 'TR1' });
  addEvent(state, dt(season, '06-10'), 'seasonEnd');
  state.cal.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

export const seasonEndDate = (season) => dt(season, '06-10');

// Günün organizasyon olayları (kuralar, tur geçişleri)
export function compDaily(state) {
  for (const ev of state.cal) {
    if (ev.done || ev.date > state.date) continue;
    switch (ev.kind) {
      case 'news':
        addNews(state, ev.text, ev.cat, ev.teams || []);
        break;
      case 'uefaDraw': {
        const sel = selectParticipants(state, ev.comp);
        state.uefa[ev.comp].teams = sel.teams;
        state.uefa[ev.comp].pots = sel.pots;
        if (sel.teams.length === 36 && leaguePhaseDraw(state, ev.comp)) drawNewsLP(state, ev.comp);
        break;
      }
      case 'qualDraw':
        qualDraw(state, ev.stage);
        break;
      case 'uefaKPO':
        if (state.uefa[ev.comp].stage === 'LP') {
          const pending = state.fixtures.some((f) => f.comp === ev.comp && f.stage === 'LP' && !f.played);
          if (pending) continue;
          uefaKnockoutPlayoffDraw(state, ev.comp);
        }
        break;
      case 'uefaR16':
        if (state.uefa[ev.comp].stage === 'KPO') {
          if (state.uefa[ev.comp].kpo.flat().some((id) => !state.ties[id].winner)) continue;
          uefaR16Draw(state, ev.comp);
        }
        break;
      case 'uefaNext':
        if (state.uefa[ev.comp].bracket && !uefaNextStage(state, ev.comp, ev.stage)) {
          const prev = { QF: 'R16', SF: 'QF', F: 'SF' }[ev.stage];
          if ((state.uefa[ev.comp].bracket[prev] || []).length) continue;
        }
        break;
      case 'cupDraw': {
        const Z = state.cups.ZTK;
        const prevStage = Z.round;
        if (prevStage && (Z.ties[prevStage] || []).some((id) => !state.ties[id].winner)) continue;
        cupDraw(state, ev.stage);
        break;
      }
      case 'cupFinal': {
        const Z = state.cups.ZTK;
        if ((Z.ties.SF || []).some((id) => !state.ties[id].winner)) continue;
        if (Z.alive.length >= 2) cupDraw(state, 'F');
        break;
      }
      case 'playoffs':
        if (state.fixtures.some((f) => f.comp === ev.comp && !f.played)) continue;
        leaguePlayoffs(state, ev.comp);
        break;
      default:
        break;
    }
    ev.done = true;
  }
}

// ---------------- Sezon sonu: yükselme/düşme ve Avrupa kontenjanları ----------------
export function endSeasonComps(state) {
  const sl = standings(state, 'SL');
  const tr1 = standings(state, 'TR1');
  const tr2 = standings(state, 'TR2');
  const po1 = state.playoffs?.PO1;
  const po2 = state.playoffs?.PO2;
  const relegatedSL = sl.slice(-3).map((r) => r.id);
  const promotedTR1 = [...tr1.slice(0, 2).map((r) => r.id), ...(po1?.promoted?.length ? po1.promoted.slice(0, 1) : [tr1[2]?.id])].filter(Boolean);
  const relegatedTR1 = tr1.slice(-4).map((r) => r.id);
  let promotedTR2 = [...tr2.slice(0, 2).map((r) => r.id), ...(po2?.promoted || [])];
  for (const r of tr2.slice(2)) if (promotedTR2.length < 4 && !promotedTR2.includes(r.id)) promotedTR2.push(r.id);
  promotedTR2 = promotedTR2.slice(0, 4);

  const next = {
    SL: [...state.leagues.SL.filter((id) => !relegatedSL.includes(id)), ...promotedTR1],
    TR1: [...state.leagues.TR1.filter((id) => !promotedTR1.includes(id) && !relegatedTR1.includes(id)), ...relegatedSL, ...promotedTR2],
    TR2: [...state.leagues.TR2.filter((id) => !promotedTR2.includes(id)), ...relegatedTR1],
  };

  // Avrupa kontenjanları (Türkiye UEFA ülke sıralamasında 10.): şampiyon ŞL lig aşaması, 2. ŞL 2. ön eleme,
  // kupa şampiyonu AL play-off, 3. AL 2. ön eleme, 4. KL 2. ön eleme.
  const order = sl.map((r) => r.id);
  const cup = state.cups?.ZTK?.winner;
  const q = { season: state.season + 1, UCL: { LP: [], Q2: [] }, UEL: { PO: [], Q2: [] }, UECL: { Q2: [] }, usedOpp: [] };
  q.UCL.LP.push(order[0]);
  q.UCL.Q2.push(order[1]);
  const rest = order.slice(2).filter((id) => id !== cup);
  if (cup && cup !== order[0] && cup !== order[1]) {
    q.UEL.PO.push(cup);
    q.UEL.Q2.push(rest[0]);
    q.UECL.Q2.push(rest[1]);
  } else {
    q.UEL.PO.push(rest[0]);
    q.UEL.Q2.push(rest[1]);
    q.UECL.Q2.push(rest[2]);
  }
  for (const c of UEFA) {
    const h = state.uefa?.[c]?.winner;
    if (h && state.teams[h]?.country === 'TR' && c === 'UCL' && !q.UCL.LP.includes(h)) q.UCL.LP.push(h);
  }

  // Avrupa ligleri: sezonun şampiyonları (kulüp gücüne göre) ve bir sonraki sezonun kupa sıralaması
  state.euroScore = {};
  const byCountry = {};
  for (const t of Object.values(state.teams)) {
    if (t.country === 'TR') continue;
    const s = teamRating(t.squad.map((id) => state.players[id]).filter(Boolean)) + normal(0, 2.2) + t.rep * 0.08;
    state.euroScore[t.id] = s;
    (byCountry[t.country] ||= []).push(t.id);
  }
  const champs = [];
  for (const [c, ids] of Object.entries(byCountry)) {
    if (ids.length < 3) continue;
    ids.sort((a, b) => state.euroScore[b] - state.euroScore[a]);
    champs.push(`${nm(state, ids[0])} (${c})`);
    ids.forEach((id, i) => {
      const t = state.teams[id];
      t.rep = clamp(Math.round(t.rep + (ids.length / 2 - i) * 0.25), 40, 95);
    });
  }
  const holders = { UCL: state.uefa?.UCL?.winner || null, UEL: state.uefa?.UEL?.winner || null, UECL: state.uefa?.UECL?.winner || null };
  if (champs.length) addNews(state, `Avrupa liglerinde sezonun şampiyonları: ${champs.join(', ')}.`, 'europe', [], 'Avrupa\'da şampiyonlar belli oldu');

  return { next, relegatedSL, promotedTR1, relegatedTR1, promotedTR2, qual: q, holders, cup, tables: { SL: order, TR1: tr1.map((r) => r.id), TR2: tr2.map((r) => r.id) } };
}

export function applySeasonTransition(state, res) {
  state.leagues = res.next;
  for (const [lg, ids] of Object.entries(res.next)) for (const id of ids) state.teams[id].league = lg;
  state.qual = res.qual;
  state.euroHolders = res.holders;
  state.lastSLRank = res.tables.SL;
}

export { dt as compDate };
