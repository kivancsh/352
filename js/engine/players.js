// Oyuncu modeli: mevkiler, uyum, değer, maaş, sakatlıklar ve gelişim.
import { rand, randInt, clamp, normal, roundMoney, weightedPick, chance } from './util.js';

export const POSITIONS = ['GK', 'RB', 'CB', 'LB', 'DM', 'CM', 'AM', 'RW', 'LW', 'ST'];

export const POS_TR = {
  GK: 'KL', RB: 'SĞB', CB: 'STP', LB: 'SLB', DM: 'DOS',
  CM: 'OS', AM: 'OOS', RW: 'SĞK', LW: 'SLK', ST: 'SF',
};

export const POS_LONG = {
  GK: 'Kaleci', RB: 'Sağ bek', CB: 'Stoper', LB: 'Sol bek', DM: 'Defansif orta saha',
  CM: 'Merkez orta saha', AM: 'Ofansif orta saha', RW: 'Sağ kanat', LW: 'Sol kanat', ST: 'Santrfor',
};

export const POS_GROUP = {
  GK: 'GK', RB: 'DEF', CB: 'DEF', LB: 'DEF', DM: 'MID', CM: 'MID', AM: 'MID', RW: 'ATT', LW: 'ATT', ST: 'ATT',
};

// Bir oyuncunun kendi mevkii dışındaki bir slotta ne kadar verimli olduğu.
const FIT = {
  CB: { RB: 0.85, LB: 0.85, DM: 0.88, CM: 0.72 },
  RB: { LB: 0.9, CB: 0.84, RW: 0.8, DM: 0.75, CM: 0.72 },
  LB: { RB: 0.9, CB: 0.84, LW: 0.8, DM: 0.75, CM: 0.72 },
  DM: { CM: 0.95, CB: 0.86, AM: 0.8, RB: 0.72, LB: 0.72 },
  CM: { DM: 0.94, AM: 0.93, RW: 0.78, LW: 0.78 },
  AM: { CM: 0.92, RW: 0.88, LW: 0.88, ST: 0.87, DM: 0.75 },
  RW: { LW: 0.93, AM: 0.87, ST: 0.85, RB: 0.72, CM: 0.75 },
  LW: { RW: 0.93, AM: 0.87, ST: 0.85, LB: 0.72, CM: 0.75 },
  ST: { AM: 0.85, RW: 0.82, LW: 0.82 },
};

export function posFit(playerPos, slotPos) {
  if (playerPos === slotPos) return 1;
  if (playerPos === 'GK' || slotPos === 'GK') return 0.25;
  return FIT[playerPos]?.[slotPos] ?? 0.65;
}

export function defaultPotential(age, ovr) {
  let gap;
  if (age <= 18) gap = randInt(10, 18);
  else if (age <= 20) gap = randInt(6, 14);
  else if (age <= 22) gap = randInt(3, 9);
  else if (age <= 24) gap = randInt(1, 5);
  else if (age <= 26) gap = randInt(0, 2);
  else gap = 0;
  return clamp(ovr + gap, ovr, 94);
}

// --- Piyasa değeri (€) ---
export function playerValue(p, season) {
  const base = 120000 * Math.exp((p.ovr - 50) * 0.165);
  const a = p.age;
  const ageF = a <= 21 ? 1.5 : a <= 24 ? 1.3 : a <= 27 ? 1.1 : a <= 29 ? 1 : a === 30 ? 0.85
    : a === 31 ? 0.7 : a === 32 ? 0.55 : a === 33 ? 0.42 : a === 34 ? 0.32 : 0.22;
  const potF = 1 + Math.max(0, p.pot - p.ovr) * 0.03;
  const yearsLeft = p.contractEnd - season;
  const contractF = yearsLeft <= 0 ? 0.5 : yearsLeft === 1 ? 0.8 : 1;
  const injF = p.injury && p.injury.days > 90 ? 0.7 : 1;
  return Math.max(25000, roundMoney(base * ageF * potF * contractF * injF));
}

// Oyuncunun bir kulüpten beklediği yıllık maaş (€).
export function expectedWage(p, clubRep, season) {
  const base = 120000 * Math.exp((p.ovr - 50) * 0.165);
  const ageF = p.age >= 30 ? 1.15 : p.age <= 21 ? 0.6 : 1;
  const w = base * 0.15 * ageF * (0.55 + (clubRep / 100) * 0.8);
  return Math.max(60000, roundMoney(w));
}

// --- Sakatlıklar ---
export const INJURIES = [
  { name: 'Kas yorgunluğu', min: 3, max: 7, w: 25 },
  { name: 'Kaval kemiği darbesi', min: 3, max: 10, w: 12 },
  { name: 'Ayak bileği burkulması', min: 7, max: 21, w: 18 },
  { name: 'Arka adale zorlanması', min: 10, max: 35, w: 18 },
  { name: 'Baldır sakatlığı', min: 7, max: 24, w: 10 },
  { name: 'Kasık sakatlığı', min: 10, max: 28, w: 10 },
  { name: 'Diz sakatlığı', min: 21, max: 60, w: 7 },
  { name: 'Omuz çıkığı', min: 21, max: 42, w: 3 },
  { name: 'Menisküs yırtığı', min: 45, max: 100, w: 3 },
  { name: 'Ayak kırığı', min: 50, max: 90, w: 2 },
  { name: 'Aşil tendonu sakatlığı', min: 120, max: 210, w: 0.6 },
  { name: 'Ön çapraz bağ kopması', min: 180, max: 270, w: 1.2 },
];

export function randomInjury(severe = false) {
  const pool = severe ? INJURIES.filter((i) => i.min >= 7) : INJURIES;
  const inj = weightedPick(pool, (i) => i.w);
  return { name: inj.name, days: randInt(inj.min, inj.max) };
}

export function isAvailable(p) {
  return !p.injury && p.susp <= 0;
}

export function emptySeasonStats() {
  return { apps: 0, starts: 0, mins: 0, goals: 0, assists: 0, yel: 0, red: 0, rSum: 0, rN: 0, cs: 0 };
}

export function avgRating(p) {
  return p.stats.rN ? p.stats.rSum / p.stats.rN : 0;
}

// Haftalık gelişim / düşüş. minutesShare: son dönemde oynadığı dakika oranı (0-1).
export function weeklyDevelopment(p) {
  const a = p.age;
  let rate;
  if (a <= 20) rate = 0.13;
  else if (a <= 23) rate = 0.09;
  else if (a <= 26) rate = 0.035;
  else if (a <= 29) rate = 0;
  else if (a <= 31) rate = -0.03;
  else if (a <= 33) rate = -0.06;
  else rate = -0.1;

  if (rate > 0) {
    const gap = p.pot - p.ovr;
    rate *= clamp(gap / 8, 0, 1.3);
    const share = clamp(p.weekMins / 180, 0, 1);
    rate *= 0.5 + share;
  }
  p.weekMins = 0;
  p.prog = (p.prog || 0) + rate + normal(0, 0.04);
  if (p.prog >= 1) {
    if (p.ovr < p.pot) {
      p.ovr += 1;
      p.prog -= 1;
    } else {
      p.prog = 0.5;
    }
  } else if (p.prog <= -1) {
    p.ovr = Math.max(35, p.ovr - 1);
    p.prog += 1;
  }
}

// Yaz döneminde yaş ilerlemesi ve emeklilik kararı.
export function ageOneYear(p) {
  p.age += 1;
  if (p.age >= 33 && p.pot > p.ovr) p.pot = p.ovr;
}

export function shouldRetire(p) {
  if (p.age >= 39) return true;
  if (p.age >= 35) return chance(p.ovr < 70 ? 0.55 : 0.25);
  if (p.age >= 33 && p.ovr < 58) return chance(0.3);
  return false;
}

export function moraleLabel(m) {
  if (m >= 80) return 'Çok iyi';
  if (m >= 60) return 'İyi';
  if (m >= 40) return 'Normal';
  if (m >= 25) return 'Düşük';
  return 'Çok düşük';
}

// Veri satırını oyuncu nesnesine çevirir: "no|isim|ülke|yaş|mevki|güç[|potansiyel][|K:kulüp]"
export function parsePlayerLine(line, teamId, season) {
  const parts = line.split('|').map((s) => s.trim());
  const [num, name, nat, age, pos, ovr] = parts;
  const p = {
    id: '',
    num: num === '-' ? null : Number(num),
    name,
    nat,
    age: Number(age),
    pos,
    ovr: Number(ovr),
    pot: 0,
    teamId,
    loan: null,
    contractEnd: 0,
    wage: 0,
    condition: 100,
    morale: 65,
    injury: null,
    susp: 0,
    yellows: 0,
    prog: 0,
    weekMins: 0,
    stats: emptySeasonStats(),
    history: [],
  };
  for (const extra of parts.slice(6)) {
    if (extra.startsWith('K:')) p.loanFromName = extra.slice(2);
    else if (/^\d+$/.test(extra)) p.pot = Number(extra);
  }
  if (!p.pot) p.pot = defaultPotential(p.age, p.ovr);
  const years = p.age >= 32 ? randInt(1, 2) : p.age >= 28 ? randInt(1, 3) : randInt(2, 4);
  p.contractEnd = season + years;
  return p;
}
