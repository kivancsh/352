// Gelen kutusu mesajları ve lig haberleri.

export function addMessage(state, { title, body = '', kind = 'info', needsAction = false, offerId = null, pid = null, quiet = false }) {
  const msg = {
    id: `m${state.seq++}`,
    date: state.date,
    title,
    body,
    kind,
    needsAction,
    offerId,
    pid,
    quiet,
    read: false,
    resolved: !needsAction,
  };
  state.inbox.unshift(msg);
  if (state.inbox.length > 250) {
    state.inbox = state.inbox.filter((m, i) => i < 200 || !m.resolved);
  }
  return msg;
}

export function resolveMessage(state, offerId) {
  for (const m of state.inbox) {
    if (m.offerId === offerId && m.needsAction) {
      m.resolved = true;
      m.read = true;
    }
  }
}

export function addNews(state, text) {
  state.news.unshift({ date: state.date, text });
  if (state.news.length > 200) state.news.length = 200;
}
