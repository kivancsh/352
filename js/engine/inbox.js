// Gelen kutusu mesajları, Gündem haberleri ve insan takımı yardımcıları.
import { addDays } from './util.js';

// Tek oyunculu kariyerde tek bir insan takımı vardır; ortak kariyerde birden fazla.
export const humansOf = (state) => state.humans || (state.userTeamId ? [state.userTeamId] : []);
export const isHuman = (state, teamId) => !!teamId && humansOf(state).includes(teamId);

export function addMessage(state, {
  teamId = state.userTeamId, title, body = '', kind = 'info', needsAction = false, offerId = null, pid = null, quiet = false, data = null,
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
  if (data) msg.data = data;
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

// Gündem kategorileri: club (kulüp), league (lig), europe (Avrupa), cup (kupa), transfer, award (ödüller), general
export const NEWS_CATS = {
  league: { label: 'Lig', icon: '🏆' },
  europe: { label: 'Avrupa', icon: '🌍' },
  cup: { label: 'Kupa', icon: '🏅' },
  transfer: { label: 'Transfer', icon: '💱' },
  award: { label: 'Ödüller', icon: '⭐' },
  club: { label: 'Kulüp', icon: '📣' },
  general: { label: 'Gündem', icon: '📰' },
};

export function addNews(state, text, cat = 'general', teams = [], title = null) {
  const n = { id: state.seq++, date: state.date, text, cat };
  if (teams.length) n.teams = [...new Set(teams.filter(Boolean))];
  if (title) n.title = title;
  state.news.unshift(n);
  if (state.news.length > 500) state.news.length = 500;
  return n;
}
