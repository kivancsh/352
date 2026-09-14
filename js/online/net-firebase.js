// Firebase (anonim giriş + Firestore) üzerinden çalışan sunucu bağlantısı.
// SDK yalnızca ortak kariyer açıldığında yüklenir; tek oyunculu oyun internetsiz çalışmaya devam eder.
const SDK = 'https://www.gstatic.com/firebasejs/10.14.1';
const CHUNK = 900000;

export async function createFirebaseNet(config) {
  const [{ initializeApp }, A, F] = await Promise.all([
    import(`${SDK}/firebase-app.js`),
    import(`${SDK}/firebase-auth.js`),
    import(`${SDK}/firebase-firestore.js`),
  ]);
  const app = initializeApp(config);
  const auth = A.getAuth(app);
  let user = await new Promise((resolve) => {
    const un = A.onAuthStateChanged(auth, (u) => {
      un();
      resolve(u);
    });
  });
  if (!user) user = (await A.signInAnonymously(auth)).user;
  const db = F.getFirestore(app);

  const leagueRef = (code) => F.doc(db, 'leagues', code);
  const snapRef = (code, rev, i) => F.doc(db, 'leagues', code, 'snaps', `${rev}_${i}`);
  const actionsCol = (code) => F.collection(db, 'leagues', code, 'actions');

  return {
    uid: user.uid,
    kind: 'firebase',

    async getLeague(code) {
      const s = await F.getDoc(leagueRef(code));
      return s.exists() ? s.data() : null;
    },
    async createLeague(code, data) {
      await F.runTransaction(db, async (tx) => {
        const s = await tx.get(leagueRef(code));
        if (s.exists()) {
          const e = new Error('exists');
          e.code = 'exists';
          throw e;
        }
        tx.set(leagueRef(code), data);
      });
    },
    async updateLeague(code, patch) {
      await F.updateDoc(leagueRef(code), patch);
    },
    async transactLeague(code, fn) {
      return F.runTransaction(db, async (tx) => {
        const s = await tx.get(leagueRef(code));
        const patch = fn(s.exists() ? s.data() : null);
        if (patch) tx.update(leagueRef(code), patch);
        return patch || null;
      });
    },
    watchLeague(code, cb) {
      return F.onSnapshot(leagueRef(code), (s) => cb(s.exists() ? s.data() : null), (e) => {
        console.warn('lig dinleme hatası', e);
        cb(null);
      });
    },

    async putSnapshot(code, rev, data) {
      const parts = [];
      for (let i = 0; i < data.length; i += CHUNK) parts.push(data.slice(i, i + CHUNK));
      const batch = F.writeBatch(db);
      parts.forEach((p, i) => batch.set(snapRef(code, rev, i), { rev, i, data: p }));
      await batch.commit();
      return parts.length;
    },
    async getSnapshot(code, rev, parts) {
      const docs = await Promise.all(Array.from({ length: parts }, (_, i) => F.getDoc(snapRef(code, rev, i))));
      if (docs.some((d) => !d.exists())) return null;
      return docs.map((d) => d.data().data).join('');
    },
    async deleteSnapshot(code, rev, parts) {
      const batch = F.writeBatch(db);
      for (let i = 0; i < parts; i++) batch.delete(snapRef(code, rev, i));
      await batch.commit();
    },

    async addAction(code, action) {
      const ref = await F.addDoc(actionsCol(code), action);
      return ref.id;
    },
    watchActions(code, cb) {
      const q = F.query(actionsCol(code), F.where('status', '==', 'pending'));
      return F.onSnapshot(q, (s) => cb(s.docs.map((d) => ({ ...d.data(), id: d.id }))), (e) => console.warn('işlem dinleme hatası', e));
    },
    async updateAction(code, id, patch) {
      await F.updateDoc(F.doc(actionsCol(code), id), patch);
    },
    watchAction(code, id, cb) {
      return F.onSnapshot(F.doc(actionsCol(code), id), (s) => cb(s.exists() ? { ...s.data(), id } : null), () => cb(null));
    },
    async putLive(code, data) {
      await F.setDoc(F.doc(db, 'leagues', code, 'live', 'current'), data);
    },
    async getLive(code) {
      const s = await F.getDoc(F.doc(db, 'leagues', code, 'live', 'current'));
      return s.exists() ? s.data() : null;
    },
    watchLive(code, cb) {
      return F.onSnapshot(F.doc(db, 'leagues', code, 'live', 'current'), (s) => cb(s.exists() ? s.data() : null), (e) => console.warn('canlı maç dinleme hatası', e));
    },
    async pruneActions(code, before) {
      const s = await F.getDocs(F.query(actionsCol(code), F.where('status', '==', 'done')));
      const batch = F.writeBatch(db);
      let n = 0;
      for (const d of s.docs) {
        if ((d.data().doneAt || 0) < before && n < 400) {
          batch.delete(d.ref);
          n++;
        }
      }
      if (n) await batch.commit();
    },
  };
}
