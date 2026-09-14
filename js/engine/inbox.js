// Gelen kutusu mesajları, lig haberleri ve insan takımı yardımcıları.
import { addDays } from './util.js';

// Tek oyunculu kariyerde tek bir insan takımı vardır; ortak kariyerde birden fazla.
export const humansOf = (state) => state.humans || (state.userTeamId ? [state.userTeamId] : []);
export const isHuman = (state, teamId) => !!teamId && humansOf(state).includes(teamId);

export function addMessage(state, {
  teamId = state.userTeamId, title, body = '', kind = 'info', needsAction = false, offerId = null, pid = null, quiet = false,
}) {
  const msg = {
    id: `m${state.seq++}`,
    teamId,
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
    // Ortak kariyerde yanıtlanmayan kararlar bu tarihte düşer.
    expires: needsAction ? addDays(state.date, 7) : null,
  };
  state.inbox.unshift(msg);
  const cap = 200 * Math.max(1, humansOf(state).length);
  if (state.inbox.length > cap + 50) {
    state.inbox = state.inbox.filter((m, i) => i < cap || !m.resolved);
  }
  return msg;
}

export function addMessageAll(state, msg) {
  for (const teamId of humansOf(state)) addMessage(state, { ...msg, teamId });
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
