// Dizilişler, otomatik ilk 11 seçimi ve takım gücü hesapları.
import { posFit, isAvailable } from './players.js';

// Her slot: [mevki, x, y] — x: 0 sol, 100 sağ; y: 0 rakip kale, 100 kendi kalemiz.
export const FORMATIONS = {
  '4-3-3': {
    name: '4-3-3 Balanced Attack',
    positions: ['CB', 'CB', 'LB', 'RB', 'CM', 'CM', 'CM', 'LW', 'ST', 'RW', 'GK'],
    strength: 1.05,
    offenseBonus: 0.12,
    defenseBonus: 0.08,
    midfield: true,
    flexibility: 0.8,
    stability: 0.75
  },

  '3-4-3': {
    name: '3-4-3 Wide Attack',
    positions: ['CB', 'CB', 'CB', 'LWB', 'RWB', 'CM', 'CM', 'LW', 'ST', 'RW', 'GK'],
    strength: 1.02,
    offenseBonus: 0.14,
    defenseBonus: 0.10,
    midfield: true,
    flexibility: 0.9,
    stability: 0.78,
    counterAttackBonus: 0.07
  },

  '4-2-4': {
    name: '4-2-4 Attacking',
    positions: ['CB', 'CB', 'LB', 'RB', 'CDM', 'CDM', 'CM', 'LW', 'ST', 'RW', 'GK'],
    strength: 1.08,
    offenseBonus: 0.16,
    defenseBonus: 0.06,
    midfield: true,
    flexibility: 0.7,
    stability: 0.70
  },

  '5-3-2': {
    name: '5-3-2 Defensive',
    positions: ['CB', 'CB', 'CB', 'LB', 'RB', 'CM', 'CM', 'CM', 'ST', 'ST', 'GK'],
    strength: 1.06,
    offenseBonus: 0.08,
    defenseBonus: 0.16,
    midfield: true,
    flexibility: 0.6,
    stability: 0.85
  },

  '4-1-4-1': {
    name: '4-1-4-1 Solid Defense',
    positions: ['CB', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CM', 'CAM', 'ST', 'RW', 'GK'],
    strength: 0.98,
    offenseBonus: 0.10,
    defenseBonus: 0.12,
    midfield: true,
    flexibility: 0.75,
    stability: 0.82,
    defensiveStability: 0.08
  },

  '3-5-2': {
    name: '3-5-2 Wing Play',
    positions: ['CB', 'CB', 'CB', 'LWB', 'RWB', 'CM', 'CM', 'CM', 'ST', 'ST', 'GK'],
    strength: 1.04,
    offenseBonus: 0.12,
    defenseBonus: 0.10,
    midfield: true,
    flexibility: 0.75,
    stability: 0.80
  },

  '5-4-1': {
    name: '5-4-1 Defensive',
    positions: ['CB', 'CB', 'CB', 'LB', 'RB', 'CM', 'CM', 'LW', 'RW', 'ST', 'GK'],
    strength: 1.00,
    offenseBonus: 0.06,
    defenseBonus: 0.18,
    midfield: true,
    flexibility: 0.5,
    stability: 0.88
  },

  '4-4-2': {
    name: '4-4-2 Classic',
    positions: ['CB', 'CB', 'LB', 'RB', 'CM', 'CM', 'LW', 'RW', 'ST', 'ST', 'GK'],
    strength: 1.02,
    offenseBonus: 0.12,
    defenseBonus: 0.10,
    midfield: true,
    flexibility: 0.65,
    stability: 0.75
  }
};
};

export const MENTALITIES = {
  defensive: { label: 'Savunma', att: 0.9, def: 1.08 },
  balanced: { label: 'Dengeli', att: 1, def: 1 },
  attacking: { label: 'Hücum', att: 1.1, def: 0.92 },
};

// Slot ağırlıkları: [hücum, orta saha, savunma]
export const LINE_W = {
  GK: [0, 0, 0],
  CB: [0.05, 0.15, 1],
  RB: [0.25, 0.35, 0.75],
  LB: [0.25, 0.35, 0.75],
  DM: [0.15, 0.8, 0.55],
  CM: [0.35, 1, 0.3],
  AM: [0.75, 0.8, 0.1],
  RW: [0.9, 0.45, 0.1],
  LW: [0.9, 0.45, 0.1],
  ST: [1, 0.2, 0.03],
};

// Hat ağırlıklarını her diziliş için sabit bir tabana göre normalize ederiz,
// böylece eksik oyuncu (kırmızı kart, sakatlık) gücü doğal olarak düşürür.
// Değerler 4-2-3-1 dizilişinin toplam ağırlıklarıdır.
export const LINE_NORM = { att: 4.45, mid: 4.5, def: 4.93 };

// Dizilişin hat toplamlarını tabana kısmen yaklaştırır: diziliş seçimi etkili olsun
// ama tek başına maçı belirlemesin (%40 diziliş etkisi).
const normCache = {};
export function formationNorm(formation) {
  if (normCache[formation]) return normCache[formation];
  const tot = { att: 0, mid: 0, def: 0 };
  for (const [pos] of FORMATIONS[formation]) {
    const w = LINE_W[pos];
    tot.att += w[0];
    tot.mid += w[1];
    tot.def += w[2];
  }
  const blend = (k) => tot[k] * 0.6 + LINE_NORM[k] * 0.4;
  normCache[formation] = { att: blend('att'), mid: blend('mid'), def: blend('def') };
  return normCache[formation];
}

export function playerEff(p, slot) {
  return p.ovr * posFit(p.pos, slot) * (0.75 + 0.25 * p.condition / 100) * (0.95 + 0.1 * p.morale / 100);
}

const PICK_ORDER = ['GK', 'CB', 'ST', 'DM', 'RB', 'LB', 'CM', 'AM', 'RW', 'LW'];

// En uygun ilk 11 ve 9 kişilik yedek listesini seçer.
export function autoPick(squad, formation) {
  const slots = FORMATIONS[formation];
  const pool = squad.filter(isAvailable);
  const used = new Set();
  const lineup = new Array(slots.length).fill(null);
  const order = slots
    .map((s, i) => ({ pos: s[0], i }))
    .sort((a, b) => PICK_ORDER.indexOf(a.pos) - PICK_ORDER.indexOf(b.pos));

  for (const { pos, i } of order) {
    let best = null;
    let bestScore = -1;
    for (const p of pool) {
      if (used.has(p.id)) continue;
      const score = p.ovr * posFit(p.pos, pos) * (0.85 + 0.15 * p.condition / 100);
      if (score > bestScore) {
        bestScore = score;
        best = p;
      }
    }
    if (best) {
      lineup[i] = best.id;
      used.add(best.id);
    }
  }

  const rest = pool.filter((p) => !used.has(p.id)).sort((a, b) => b.ovr - a.ovr);
  const bench = [];
  const gk = rest.find((p) => p.pos === 'GK');
  if (gk) bench.push(gk.id);
  for (const p of rest) {
    if (bench.length >= 9) break;
    if (!bench.includes(p.id)) bench.push(p.id);
  }
  return { lineup, bench };
}

// Takımın genel gücü (kadro ekranı ve yapay zekâ için kaba ölçü).
export function teamRating(squad) {
  const top = squad.slice().sort((a, b) => b.ovr - a.ovr).slice(0, 16);
  if (!top.length) return 0;
  return Math.round(top.reduce((s, p) => s + p.ovr, 0) / top.length);
}
