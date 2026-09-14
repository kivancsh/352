// Firebase olmadan ortak kariyeri aynı tarayıcının birden fazla sekmesinde denemek için yerel sunucu.
// Adrese ?yerel=1 eklenerek açılır. Veriyi localStorage'da tutar, sekmeleri BroadcastChannel ile haberdar eder.
const PREFIX = 'lnet:';
const CHUNK = 900000;
const listeners = new Set();
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('slm-lnet') : null;
if (channel) channel.onmessage = (e) => { for (const fn of listeners) fn(e.data); };

function notify(key) {
  for (const fn of listeners) fn(key);
  channel?.postMessage(key);
}
const read = (k) => {
  const v = localStorage.getItem(PREFIX + k);
  return v ? JSON.parse(v) : null;
};
const write = (k, v) => {
  localStorage.setItem(PREFIX + k, JSON.stringify(v));
  notify(k);
};
const lock = (fn) => (navigator.locks ? navigator.locks.request('slm-lnet', async () => fn()) : Promise.resolve().then(fn));

function applyPatch(obj, patch) {
  const out = structuredClone(obj);
  for (const [k, v] of Object.entries(patch)) {
    const path = k.split('.');
    let cur = out;
    for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]] ??= {};
    cur[path[path.length - 1]] = v;
  }
  return out;
}

function watch(match, emit) {
  const fn = (key) => { if (match(key)) emit(); };
  listeners.add(fn);
  setTimeout(emit, 0);
  return () => listeners.delete(fn);
}

export async function createLocalNet() {
  let uid = sessionStorage.getItem('slm-lnet-uid');
  if (!uid) {
    uid = `u${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem('slm-lnet-uid', uid);
  }
  const L = (code) => `league:${code}`;
  const A = (code, id) => `action:${code}:${id}`;

  return {
    uid,
    kind: 'local',
    async getLeague(code) { return read(L(code)); },
    async createLeague(code, data) {
      return lock(() => {
        if (read(L(code))) {
          const e = new Error('exists');
          e.code = 'exists';
          throw e;
        }
        write(L(code), data);
      });
    },
    async updateLeague(code, patch) {
      return lock(() => {
        const cur = read(L(code));
        if (!cur) throw new Error('Lig bulunamadı');
        write(L(code), applyPatch(cur, patch));
      });
    },
    async transactLeague(code, fn) {
      return lock(() => {
        const cur = read(L(code));
        const patch = fn(cur);
        if (!patch) return null;
        write(L(code), applyPatch(cur, patch));
        return patch;
      });
    },
    watchLeague(code, cb) { return watch((k) => k === L(code), () => cb(read(L(code)))); },

    async putSnapshot(code, rev, data) {
      let n = 0;
      for (let i = 0; i < data.length; i += CHUNK) localStorage.setItem(`${PREFIX}snap:${code}:${rev}_${n++}`, data.slice(i, i + CHUNK));
      return n;
    },
    async getSnapshot(code, rev, parts) {
      let s = '';
      for (let i = 0; i < parts; i++) {
        const v = localStorage.getItem(`${PREFIX}snap:${code}:${rev}_${i}`);
        if (v == null) return null;
        s += v;
      }
      return s;
    },
    async deleteSnapshot(code, rev, parts) {
      for (let i = 0; i < parts; i++) localStorage.removeItem(`${PREFIX}snap:${code}:${rev}_${i}`);
    },

    async addAction(code, action) {
      return lock(() => {
        const id = `a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
        const idx = read(`actions:${code}`) || [];
        idx.push(id);
        localStorage.setItem(PREFIX + A(code, id), JSON.stringify({ ...action, id }));
        write(`actions:${code}`, idx);
        return id;
      });
    },
    watchActions(code, cb) {
      return watch(
        (k) => k === `actions:${code}` || k.startsWith(`action:${code}:`),
        () => cb((read(`actions:${code}`) || []).map((id) => read(A(code, id))).filter((a) => a && a.status === 'pending')),
      );
    },
    async updateAction(code, id, patch) {
      return lock(() => {
        const cur = read(A(code, id));
        if (cur) write(A(code, id), applyPatch(cur, patch));
      });
    },
    watchAction(code, id, cb) { return watch((k) => k === A(code, id), () => cb(read(A(code, id)))); },
    async putLive(code, data) { write(`live:${code}`, data); },
    async getLive(code) { return read(`live:${code}`); },
    watchLive(code, cb) { return watch((k) => k === `live:${code}`, () => cb(read(`live:${code}`))); },
    async pruneActions(code, before) {
      return lock(() => {
        const idx = read(`actions:${code}`) || [];
        const keep = idx.filter((id) => {
          const a = read(A(code, id));
          if (a && a.status === 'done' && (a.doneAt || 0) < before) {
            localStorage.removeItem(PREFIX + A(code, id));
            return false;
          }
          return !!a;
        });
        write(`actions:${code}`, keep);
      });
    },
  };
}
