// Oyun dünyasındaki tüm kulüpler: Süper Lig, 1. Lig, 2. Lig ve Avrupa (UEFA kupaları + transfer piyasası).
import { TEAMS } from './teams.js';
import { EURO_CLUBS, LEAGUE_NAMES, COUNTRY_MONEY, CLUB_ALIASES } from './europe.js';
import { TR1_CLUBS, TR2_CLUBS } from './turkey-lower.js';
import { WORLD_SQUADS } from './world-squads.js';
import { namePool, IMPORT_POOL, TR_NAMES } from './names.js';

// Wikipedia'da yanlış sayfaya denk gelen ya da kadrosu bulunamayan kulüpler: kadroları üretilir.
const GENERATE = new Set(['tuz']);

export const LEAGUE_LABEL = {
  SL: 'Trendyol Süper Lig',
  TR1: 'Trendyol 1. Lig',
  TR2: 'Nesine 2. Lig',
  ...LEAGUE_NAMES,
};

export const moneyFactor = (country) => COUNTRY_MONEY[country] ?? (country === 'TR' ? 1 : 0.7);

// Basit ve kararlı karma (aynı kulüp her dünyada aynı dizilişi alsın)
function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

const FORMS = ['4-2-3-1', '4-3-3', '4-3-3', '4-2-3-1', '4-4-2', '3-5-2', '4-1-4-1'];

function clubMeta(c, league) {
  const tr = c.country === 'TR';
  const sq = WORLD_SQUADS[c.id];
  const r2 = c.rep * c.rep;
  let balance;
  if (league === 'TR1') balance = r2 * 900;
  else if (league === 'TR2') balance = r2 * 350;
  else balance = r2 * 4000 * moneyFactor(c.country);
  return {
    id: c.id,
    name: c.name,
    short: c.short,
    city: c.city || '',
    country: c.country,
    league,
    stadium: c.stadium,
    capacity: sq?.capacity || c.capacity,
    colors: c.colors,
    kit: c.kit,
    rep: c.rep,
    coach: sq?.coach || '—',
    formation: FORMS[hash(c.id) % FORMS.length],
    balance: Math.round(balance / 1e5) * 1e5,
    players: GENERATE.has(c.id) ? null : sq?.players || null,
    tr,
  };
}

export function allClubs() {
  const out = [];
  for (const t of TEAMS) out.push({ ...t, country: 'TR', league: 'SL', tr: true });
  for (const c of TR1_CLUBS) out.push(clubMeta(c, 'TR1'));
  for (const c of TR2_CLUBS) out.push(clubMeta(c, 'TR2'));
  for (const c of EURO_CLUBS) out.push(clubMeta(c, c.country));
  return out;
}

export function clubNameIndex(clubs) {
  const idx = {};
  for (const c of clubs) idx[c.name] = c.id;
  for (const [name, id] of Object.entries(CLUB_ALIASES)) idx[name] = id;
  idx['Başakşehir'] = 'ibfk';
  idx['Rizespor'] = 'riz';
  return idx;
}

// Kadrosu olmayan kulüpler için ülkeye uygun isimlerle kadro üretir (rng: 0-1 arası sayı veren fonksiyon).
const SHAPE = ['GK', 'GK', 'GK', 'RB', 'RB', 'CB', 'CB', 'CB', 'CB', 'CB', 'LB', 'LB', 'DM', 'DM', 'CM', 'CM', 'CM', 'AM', 'AM', 'RW', 'RW', 'LW', 'LW', 'ST', 'ST', 'ST'];

export function generateSquadLines(club, rng) {
  const tr = club.country === 'TR';
  const base = tr ? 42 + club.rep * 0.46 : 58 + (club.rep - 45) * 0.58;
  const pickArr = (a) => a[Math.floor(rng() * a.length)];
  const used = new Set();
  const lines = [];
  const order = SHAPE.map((pos, i) => ({ pos, r: rng() + (pos === 'GK' && i > 0 ? 0.6 : 0) })).sort((a, b) => a.r - b.r);
  order.forEach(({ pos }, i) => {
    let nat = club.country;
    if (rng() < (tr ? 0.12 : 0.35)) {
      let tot = 0;
      for (const [, w] of IMPORT_POOL) tot += w;
      let r = rng() * tot;
      for (const [c, w] of IMPORT_POOL) {
        r -= w;
        if (r <= 0) { nat = c; break; }
      }
    }
    const pool = nat === 'TR' ? TR_NAMES : namePool(nat) || namePool(club.country) || TR_NAMES;
    let name;
    for (let k = 0; k < 8; k++) {
      name = `${pickArr(pool.first)} ${pickArr(pool.last)}`;
      if (!used.has(name)) break;
    }
    used.add(name);
    const offs = [5, 4, 3, 2.5, 2, 1.5, 1, 0.5, 0, -0.6, -1.4, -2.2, -2.8, -3.4, -4, -4.6, -5.2, -6, -6.8, -7.6, -8.4, -9.2, -10, -11, -12, -13];
    const age = 18 + Math.floor(rng() * 16);
    let ovr = base + offs[i] - 1.6 + (rng() * 2 - 1) * 1.5;
    if (age <= 20) ovr -= (21 - age) * 2;
    lines.push(`${i + 1}|${name}|${nat}|${age}|${pos}|${Math.round(Math.max(40, ovr))}`);
  });
  return lines.join('\n');
}
