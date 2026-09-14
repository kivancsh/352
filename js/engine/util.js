// Ortak yardımcılar: tohumlu rastgele sayı üreteci, tarih ve biçimlendirme.

// --- Rastgele sayı üreteci (mulberry32) ---
// Durumu kayıt dosyasında saklanır, böylece yüklenen oyun aynı şekilde devam eder.
let rngState = 123456789;

export function seedRng(seed) {
  rngState = seed >>> 0;
}

export function getRngState() {
  return rngState;
}

export function rand() {
  rngState = (rngState + 0x6d2b79f5) >>> 0;
  let t = rngState;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function randInt(min, max) {
  return min + Math.floor(rand() * (max - min + 1));
}

export function chance(p) {
  return rand() < p;
}

export function pick(arr) {
  return arr[Math.floor(rand() * arr.length)];
}

export function normal(mean = 0, sd = 1) {
  const u = Math.max(rand(), 1e-9);
  const v = rand();
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function weightedPick(items, weightFn) {
  let total = 0;
  const weights = items.map((it) => {
    const w = Math.max(0, weightFn(it));
    total += w;
    return w;
  });
  if (total <= 0) return items[Math.floor(rand() * items.length)];
  let r = rand() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// --- Tarih (ISO "YYYY-MM-DD" metinleri, UTC) ---
export function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(a, b) {
  return Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 86400000);
}

export function weekday(iso) {
  return new Date(iso + 'T00:00:00Z').getUTCDay(); // 0 = Pazar
}

const AYLAR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const GUNLER = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export function fmtDate(iso, withDay = false) {
  const [y, m, d] = iso.split('-').map(Number);
  const s = `${d} ${AYLAR[m - 1]} ${y}`;
  return withDay ? `${GUNLER[weekday(iso)]}, ${s}` : s;
}

// --- Para ---
export function fmtMoney(v) {
  const sign = v < 0 ? '-' : '';
  const a = Math.abs(v);
  if (a >= 1e6) return `${sign}€${(a / 1e6).toFixed(a >= 1e8 ? 0 : 1).replace('.', ',')} M`;
  if (a >= 1e3) return `${sign}€${Math.round(a / 1e3)} B`;
  return `${sign}€${Math.round(a)}`;
}

export function roundMoney(v) {
  if (v >= 1e6) return Math.round(v / 1e5) * 1e5;
  if (v >= 1e5) return Math.round(v / 1e4) * 1e4;
  return Math.round(v / 1e3) * 1e3;
}

let idCounter = 0;
export function uid(prefix = 'x') {
  idCounter++;
  return `${prefix}${Date.now().toString(36)}${idCounter.toString(36)}${Math.floor(rand() * 1e6).toString(36)}`;
}
