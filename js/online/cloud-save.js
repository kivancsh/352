// Bulut yedek: tek oyunculu kariyer kaydini Firebase uzerinde saklar,
// baska bir cihazda 8 haneli kodla geri yuklenir.
// Not: Firestore kurallari yalnizca /leagues/{code} yolunu acik tuttugu icin
// yedekler de ayni yolda, kind:'save' isaretiyle tutulur.
import { FIREBASE_CONFIG } from './config.js';

const SDK = 'https://www.gstatic.com/firebasejs/10.14.1';
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const CODE_LEN = 8; // lig kodlari 6 hane; karismasin diye 8
const MAX_BYTES = 900000;  // Firestore dokuman siniri 1 MiB

let ctxPromise = null;

export function cloudAvailable() {
  return !!(FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId);
}

export function normalizeCode(v) {
  return String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, CODE_LEN);
}

function newCode() {
  const a = new Uint32Array(CODE_LEN);
  crypto.getRandomValues(a);
  return Array.from(a, (n) => ALPHABET[n % ALPHABET.length]).join('');
}

async function ctx() {
  if (!cloudAvailable()) throw new Error('Bulut yedek bu surumde yapilandirilmamis.');
  if (!ctxPromise) {
    ctxPromise = (async () => {
      const [App, Auth, Fs] = await Promise.all([
        import(`${SDK}/firebase-app.js`),
        import(`${SDK}/firebase-auth.js`),
        import(`${SDK}/firebase-firestore.js`),
      ]);
      // Ortak kariyerin kendi Firebase uygulamasini bozmamak icin ayri isimli uygulama
      const app = App.getApps().find((x) => x.name === 'cloud-save')
        || App.initializeApp(FIREBASE_CONFIG, 'cloud-save');
      const auth = Auth.getAuth(app);
      let user = auth.currentUser;
      if (!user) {
        user = await new Promise((resolve) => {
          const un = Auth.onAuthStateChanged(auth, (u) => { un(); resolve(u); });
        });
      }
      if (!user) user = (await Auth.signInAnonymously(auth)).user;
      return { Fs, db: Fs.getFirestore(app), uid: user.uid };
    })().catch((e) => { ctxPromise = null; throw e; });
  }
  return ctxPromise;
}

function sizeOf(text) {
  try { return new Blob([text]).size; } catch { return text.length; }
}

// Kaydi buluta yazar. existingCode verilirse ayni yedegi gunceller.
export async function cloudBackup(payload, meta, existingCode) {
  if (!payload) throw new Error('Yedeklenecek kariyer bulunamadi.');
  const size = sizeOf(payload);
  if (size > MAX_BYTES) throw new Error('Kayit bulut icin fazla buyuk (' + Math.round(size / 1024) + ' KB).');
  const { Fs, db, uid } = await ctx();
  const body = { kind: 'save', payload, meta: meta || {}, ts: Date.now(), updatedBy: uid };

  const code = normalizeCode(existingCode);
  if (code.length === CODE_LEN) {
    const ref = Fs.doc(db, 'leagues', code);
    const snap = await Fs.getDoc(ref);
    if (snap.exists()) {
      const d = snap.data();
      if (d.kind !== 'save') throw new Error('Bu kod bir lig koduna ait.');
      if (Array.isArray(d.memberUids) && d.memberUids.includes(uid)) {
        await Fs.updateDoc(ref, body);
        return { code, created: false };
      }
    }
  }

  for (let i = 0; i < 5; i++) {
    const fresh = newCode();
    const ref = Fs.doc(db, 'leagues', fresh);
    const snap = await Fs.getDoc(ref);
    if (snap.exists()) continue;
    await Fs.setDoc(ref, { ...body, createdBy: uid, memberUids: [uid], createdAt: Date.now() });
    return { code: fresh, created: true };
  }
  throw new Error('Yedek kodu uretilemedi, tekrar deneyin.');
}

// Koda karsilik gelen yedegi okur.
export async function cloudRestore(codeRaw) {
  const code = normalizeCode(codeRaw);
  if (code.length !== CODE_LEN) throw new Error('Kod ' + CODE_LEN + ' haneli olmali.');
  const { Fs, db } = await ctx();
  const snap = await Fs.getDoc(Fs.doc(db, 'leagues', code));
  if (!snap.exists()) throw new Error('Bu kodla yedek bulunamadi.');
  const d = snap.data();
  if (d.kind !== 'save' || !d.payload) throw new Error('Bu kod bir kariyer yedegi degil.');
  return { payload: d.payload, meta: d.meta || {}, ts: d.ts || 0 };
}
