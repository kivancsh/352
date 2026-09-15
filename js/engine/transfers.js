// Transfer piyasası: teklifler, kiralamalar (1-2 sezonluk), sözleşme görüşmeleri ve Avrupa çapında
// yapay zekâ kulüplerinin hareketleri. İnsan takımları arasında da çalışır.
import { rand, randInt, chance, pick, weightedPick, clamp, addDays, roundMoney, fmtMoney } from './util.js';
import { playerValue, expectedWage, POSITIONS, avgRating, POS_LONG } from './players.js';
import { teamRating } from './tactics.js';
import { addMessage, addNews, resolveMessage, isHuman, humansOf } from './inbox.js';
import { moneyFactor } from '../data/world.js';

const BIG = ['gs', 'fb', 'bjk', 'ts'];
export const MAX_SQUAD = 36;

export function transferWindows(season) {
  return [
    { start: `${season}-06-15`, end: `${season}-09-11`, label: 'Yaz transfer dönemi' },
    { start: `${season + 1}-01-05`, end: `${season + 1}-02-05`, label: 'Ara transfer dönemi' },
  ];
}

export function currentWindow(state) {
  for (const s of [state.season - 1, state.season]) {
    for (const w of transferWindows(s)) {
      if (w.start <= state.date && state.date <= w.end) return w;
    }
  }
  return null;
}

export const windowOpen = (state) => !!currentWindow(state);

function squad(state, teamId) {
  return state.teams[teamId].squad.map((id) => state.players[id]).filter(Boolean);
}

const managerOf = (state, teamId) => state.managers?.[teamId] || state.teams[teamId].coach;

export const ROLE_TR = { key: 'Vazgeçilmez', starter: 'İlk 11 oyuncusu', rotation: 'Rotasyon oyuncusu', surplus: 'Gözden çıkarılabilir' };

export function playerRole(state, p) {
  if (!p.teamId) return 'surplus';
  const sq = squad(state, p.teamId);
  const samePos = sq.filter((x) => x.pos === p.pos).sort((a, b) => b.ovr - a.ovr);
  const rank = samePos.indexOf(p);
  const tr = teamRating(sq);
  const starters = { GK: 1, CB: 2, RB: 1, LB: 1, DM: 1, CM: 2, AM: 1, RW: 1, LW: 1, ST: 1 };
  if (p.ovr >= tr + 3 && rank === 0) return 'key';
  if (rank < starters[p.pos] && p.ovr >= tr - 4) return 'starter';
  if (p.ovr >= tr - 8) return 'rotation';
  return 'surplus';
}

export function askingPrice(state, p, buyerId) {
  const value = playerValue(p, state.season);
  let f = { key: 1.7, starter: 1.3, rotation: 1.05, surplus: 0.8 }[playerRole(state, p)];
  if (p.age >= 31) f *= 0.9;
  if (p.contractEnd - state.season <= 1) f *= 0.85;
  if (buyerId && BIG.includes(buyerId) && BIG.includes(p.teamId)) f *= 1.3;
  const seller = state.teams[p.teamId];
  if (seller) {
    if (seller.finance.balance < 0) f *= 0.85;
    f *= moneyFactor(seller.country) ** 0.35;
  }
  return roundMoney(value * f);
}

// Kiralama bitiş sezonu: yaz döneminin sonraki sezona ait kısmında (Haziran) yapılan kiralamalar bir sonraki sezondan sayılır.
function loanUntil(state, years) {
  const base = state.date >= `${state.season + 1}-06-01` ? state.season + 1 : state.season;
  return `${base + Math.max(1, Math.min(2, years || 1))}-06-30`;
}

// --- Sözleşme ---
export function contractDemand(state, p, teamId) {
  const team = state.teams[teamId];
  const current = p.teamId ? state.teams[p.teamId] : null;
  const fromRep = current ? current.rep : 55;
  let wage = expectedWage(p, team.rep, state.season) * Math.sqrt(moneyFactor(team.country));
  if (current && current.id !== teamId) {
    if (team.rep < fromRep) wage *= 1 + (fromRep - team.rep) * 0.025;
    const richer = moneyFactor(current.country) / moneyFactor(team.country);
    if (richer > 1) wage *= Math.min(1.8, Math.sqrt(richer));
  }
  if (!current) wage *= 0.9;
  if (current && current.id === teamId) wage = Math.max(wage, p.wage * 1.05);
  wage = roundMoney(wage);
  const years = p.age >= 32 ? 1 : p.age >= 29 ? 2 : 3;
  let refuse = null;
  if (current && current.id !== teamId && fromRep - team.rep >= 22 && p.ovr >= 74) {
    refuse = `${p.name}, ${current.name} gibi büyük bir kulüpten ayrılıp ${team.name} takımına gelmeyi düşünmüyor.`;
  }
  if (current && current.id !== teamId && team.league !== 'SL' && team.country === 'TR' && p.ovr >= 72 && p.age <= 30) {
    refuse = `${p.name} kariyerinin bu döneminde alt ligde oynamak istemiyor.`;
  }
  if (current && current.id === teamId && p.morale < 25) {
    refuse = `${p.name} kulüpte mutsuz ve sözleşme uzatmak istemiyor.`;
  }
  return { wage, years, refuse };
}

export function proposeContract(state, { pid, wage, years, offerId = null, actor = state.userTeamId }) {
  const p = state.players[pid];
  const uid = actor;
  const me = state.teams[uid];
  const offer = offerId ? state.offers.find((o) => o.id === offerId) : null;
  if (offer && offer.from !== uid) return { result: 'rejected', text: 'Bu teklif size ait değil.' };
  state.negotiations = state.negotiations || {};
  const key = `${uid}:${pid}`;
  const neg = (state.negotiations[key] = state.negotiations[key] || { tries: 0 });

  if (offer && p.teamId !== offer.to) {
    offer.status = 'cancelled';
    resolveMessage(state, offer.id);
    return { result: 'walkaway', text: `${p.name} artık başka bir kulüpte.` };
  }
  if (!offer && p.teamId && p.teamId !== uid) {
    return { result: 'rejected', text: 'Bu oyuncu başka bir kulübün sözleşmeli oyuncusu.' };
  }
  if (p.teamId !== uid && me.squad.length >= MAX_SQUAD) {
    return { result: 'rejected', text: `Kadronuz dolu (en fazla ${MAX_SQUAD} oyuncu).` };
  }
  if (offer && offer.fee > me.finance.balance) {
    return { result: 'rejected', text: 'Bonservis bedeli için bütçeniz yetersiz.' };
  }

  const d = contractDemand(state, p, uid);
  neg.tries++;
  if (d.refuse && wage < d.wage * 2) {
    finishNegotiation(state, key, offer, 'failed');
    return { result: 'walkaway', text: d.refuse };
  }
  const yearsF = years > d.years ? (p.age >= 30 ? 0.93 : 1.02) : years < d.years ? (p.age >= 30 ? 1.08 : 0.98) : 1;
  const need = roundMoney(d.wage * yearsF);

  if (wage >= need * 0.97) {
    if (offer) {
      executeTransfer(state, pid, uid, { fee: offer.fee, wage, years });
      offer.status = 'completed';
      finishNegotiation(state, key, offer, 'completed');
      return { result: 'accepted', text: `${p.name} ${me.name} ile ${years} yıllık sözleşme imzaladı!` };
    }
    if (p.teamId === uid) {
      p.wage = wage;
      p.contractEnd = state.season + years;
      p.morale = clamp(p.morale + 8, 0, 100);
      finishNegotiation(state, key, null, 'completed');
      addNews(state, `${me.name}, ${p.name} ile sözleşme uzattı.`, 'transfer', [uid]);
      return { result: 'accepted', text: `${p.name} sözleşmesini ${state.season + years} yazına kadar uzattı.` };
    }
    executeTransfer(state, pid, uid, { fee: 0, wage, years });
    finishNegotiation(state, key, null, 'completed');
    return { result: 'accepted', text: `Serbest oyuncu ${p.name} takımınıza katıldı!` };
  }
  if (neg.tries >= 3) {
    finishNegotiation(state, key, offer, 'failed');
    return { result: 'walkaway', text: `${p.name} görüşmeleri sonlandırdı. Beklentisi yıllık ${fmtMoney(need)} idi.` };
  }
  if (wage >= need * 0.75) {
    return { result: 'counter', wage: need, text: `${p.name} yıllık ${fmtMoney(need)} maaş istiyor.` };
  }
  return { result: 'rejected', wage: need, text: `Teklifinizi çok düşük buldu. Beklentisi yıllık ${fmtMoney(need)} civarında.` };
}

function finishNegotiation(state, key, offer, status) {
  if (state.negotiations) delete state.negotiations[key];
  if (offer) {
    if (status === 'failed') offer.status = 'failed';
    resolveMessage(state, offer.id);
  }
}

export function cancelNegotiation(state, offerId) {
  const o = state.offers.find((x) => x.id === offerId);
  if (!o) return;
  o.status = 'withdrawn';
  resolveMessage(state, o.id);
  if (state.negotiations) delete state.negotiations[`${o.from}:${o.pid}`];
}

// --- Transferi gerçekleştir ---
export function executeTransfer(state, pid, toId, {
  fee = 0, loan = false, loanYears = 1, wage = null, years = 2, wageShare = 100, toForeign = null,
} = {}) {
  const p = state.players[pid];
  const fromId = p.teamId;
  const from = fromId ? state.teams[fromId] : null;

  if (from) {
    from.squad = from.squad.filter((id) => id !== pid);
    if (from.lineup) from.lineup = from.lineup.map((id) => (id === pid ? null : id));
    if (from.bench) from.bench = from.bench.filter((id) => id !== pid);
    from.finance.balance += fee;
    from.finance.season.sales += fee;
  }

  const fromName = from ? from.name : p.abroad || 'Serbest';
  if (toForeign || !state.teams[toId]) {
    p.teamId = null;
    p.abroad = toForeign || 'Yurt dışı';
    p.loan = null;
    state.transferLog.unshift({ date: state.date, pid, name: p.name, from: fromName, to: p.abroad, fee, loan: false, fromId });
    addNews(state, `${p.name}, ${fmtMoney(fee)} bedelle ${fromName} takımından ${p.abroad} kulübüne transfer oldu.`, 'transfer', [fromId]);
    return;
  }

  const to = state.teams[toId];
  to.squad.push(pid);
  to.finance.balance -= fee;
  to.finance.season.purchases += fee;
  p.teamId = toId;
  p.abroad = null;
  p.freeSince = null;
  p.morale = clamp(p.morale + 10, 0, 100);
  if (loan) {
    // Kiralık oyuncu önceki kiralığından devam ediyorsa ana kulübü korunur.
    const parent = p.loan && p.loan.fromTeam ? p.loan : { fromTeam: fromId, fromName };
    p.loan = { fromTeam: parent.fromTeam, fromName: parent.fromName, until: loanUntil(state, loanYears), wageShare };
  } else {
    p.loan = null;
    p.wage = wage ?? roundMoney(expectedWage(p, to.rep, state.season) * Math.sqrt(moneyFactor(to.country)));
    p.contractEnd = state.season + years;
  }
  state.transferLog.unshift({ date: state.date, pid, name: p.name, from: fromName, to: to.name, fee, loan, fromId, toId, until: loan ? p.loan.until : null });
  if (state.transferLog.length > 300) state.transferLog.length = 300;
  const what = loan ? `${p.loan.until.slice(0, 4)} yazına kadar kiralık olarak` : fee > 0 ? `${fmtMoney(fee)} bedelle` : 'bedelsiz olarak';
  const notable = p.ovr >= 76 || fee >= 5e6 || from?.country === 'TR' || to.country === 'TR' || isHuman(state, toId) || isHuman(state, fromId);
  if (notable) addNews(state, `${p.name}, ${fromName} takımından ${what} ${to.name} kulübüne geçti.`, 'transfer', [fromId, toId]);
}

// --- İnsan takımlarının teklifleri ---
export function makeBid(state, { pid, type, fee = 0, wageShare = 100, loanYears = 1, actor = state.userTeamId }) {
  const p = state.players[pid];
  const uid = actor;
  const me = state.teams[uid];
  if (!p || p.retired) return { ok: false, error: 'Oyuncu bulunamadı.' };
  if (p.teamId === uid) return { ok: false, error: 'Bu oyuncu zaten takımınızda.' };
  if (!p.teamId) return { ok: true, freeAgent: true };
  if (!windowOpen(state)) return { ok: false, error: 'Transfer dönemi kapalı. Yalnızca serbest oyuncularla anlaşabilirsiniz.' };
  if (p.loan) return { ok: false, error: `Bu oyuncu ${p.loan.fromName} kulübünden kiralık, şu an transfer edilemez.` };
  if (state.offers.some((o) => o.pid === pid && o.user && o.from === uid && ['pending', 'countered', 'accepted'].includes(o.status))) {
    return { ok: false, error: 'Bu oyuncu için zaten aktif bir teklifiniz var.' };
  }
  if (type === 'transfer' && fee > me.finance.balance) return { ok: false, error: 'Bütçeniz bu teklif için yetersiz.' };
  if (me.squad.length >= MAX_SQUAD) return { ok: false, error: `Kadronuz dolu (en fazla ${MAX_SQUAD} oyuncu).` };

  const offer = {
    id: `o${state.seq++}`,
    pid,
    from: uid,
    to: p.teamId,
    type,
    fee,
    wageShare,
    loanYears: type === 'loan' ? Math.max(1, Math.min(2, Number(loanYears) || 1)) : null,
    status: 'pending',
    created: state.date,
    respondOn: isHuman(state, p.teamId) ? state.date : addDays(state.date, randInt(1, 2)),
    user: true,
  };
  state.offers.unshift(offer);
  return { ok: true, offer };
}

const loanText = (o) => `${o.loanYears || 1} sezonluk`;

function resolveUserBids(state) {
  for (const o of state.offers) {
    if (!o.user || o.status !== 'pending' || o.respondOn > state.date) continue;
    const p = state.players[o.pid];
    const seller = state.teams[o.to];
    const buyer = state.teams[o.from];
    if (!p || p.teamId !== o.to) {
      o.status = 'cancelled';
      addMessage(state, { teamId: o.from, title: `${p?.name || 'Oyuncu'} için teklifiniz geçersiz`, body: 'Oyuncu bu arada başka bir kulübe transfer oldu.' });
      continue;
    }

    // Satıcı da bir insan teknik direktörse kararı o verir.
    if (isHuman(state, o.to)) {
      if (o.notified) continue;
      o.notified = true;
      const what = o.type === 'loan'
        ? `${loanText(o)} kiralamak istiyor (maaşın %${o.wageShare}'ını ödeyecekler${o.fee ? `, kiralama bedeli ${fmtMoney(o.fee)}` : ''})`
        : `için ${fmtMoney(o.fee)} bonservis teklif ediyor`;
      addMessage(state, {
        teamId: o.to,
        title: `${buyer.name}, ${p.name} için teklif yaptı`,
        body: `${managerOf(state, o.from)} yönetimindeki ${buyer.name}, ${p.name} (${POS_LONG[p.pos]}, ${p.age}) ${o.type === 'loan' ? 'oyuncusunu ' : ''}${what}. Oyuncunun tahmini piyasa değeri ${fmtMoney(playerValue(p, state.season))}.`,
        kind: 'incoming', needsAction: true, offerId: o.id, pid: p.id,
      });
      addMessage(state, { teamId: o.from, title: `Teklifiniz ${seller.name} yönetimine iletildi`, body: `${managerOf(state, o.to)} teklifinizi değerlendiriyor.`, pid: p.id, quiet: true });
      continue;
    }

    if (o.type === 'transfer') {
      const ask = askingPrice(state, p, o.from);
      if (o.fee >= ask) {
        o.status = 'accepted';
        addMessage(state, {
          teamId: o.from,
          title: `${seller.name} teklifinizi kabul etti`,
          body: `${p.name} için ${fmtMoney(o.fee)} bonservis teklifiniz kabul edildi. Şimdi oyuncuyla kişisel şartları konuşmalısınız.`,
          kind: 'negotiate', needsAction: true, offerId: o.id, pid: p.id,
        });
      } else if (o.fee >= ask * 0.75) {
        o.status = 'countered';
        o.counter = ask;
        addMessage(state, {
          teamId: o.from,
          title: `${seller.name} karşı teklif yaptı`,
          body: `${p.name} için ${fmtMoney(o.fee)} teklifinizi yetersiz buldular. ${fmtMoney(ask)} ödemeye razı olursanız oyuncuyu bırakacaklar.`,
          kind: 'counter', needsAction: true, offerId: o.id, pid: p.id,
        });
      } else {
        o.status = 'rejected';
        addMessage(state, {
          teamId: o.from,
          title: `${seller.name} teklifinizi reddetti`,
          body: `${p.name} için ${fmtMoney(o.fee)} teklifinizi değerlendirmeye bile almadılar. Oyuncunun kulüpteki rolü: ${ROLE_TR[playerRole(state, p)]}.`,
          pid: p.id,
        });
      }
    } else {
      const role = playerRole(state, p);
      if (role === 'key' || (role === 'starter' && p.age >= 23)) {
        o.status = 'rejected';
        addMessage(state, { teamId: o.from, title: `${seller.name} kiralama teklifini reddetti`, body: `${p.name} takımın önemli oyuncularından, kiralık verilmeyecek.`, pid: p.id });
        continue;
      }
      let need = role === 'starter' ? 80 : role === 'rotation' ? 50 : 25;
      if (o.fee >= playerValue(p, state.season) * 0.1) need -= 20;
      if ((o.loanYears || 1) === 2 && p.age <= 21) need += 10;
      if (o.wageShare >= need) {
        if (o.fee > buyer.finance.balance) {
          o.status = 'failed';
          addMessage(state, { teamId: o.from, title: 'Kiralama gerçekleşmedi', body: 'Kiralama bedeli için bütçeniz yetersiz kaldı.' });
          continue;
        }
        executeTransfer(state, p.id, o.from, { fee: o.fee, loan: true, loanYears: o.loanYears, wageShare: o.wageShare });
        o.status = 'completed';
        addMessage(state, { teamId: o.from, title: `${p.name} kiralık olarak takımınızda`, body: `${seller.name} ile anlaşma sağlandı. Oyuncu ${p.loan.until.slice(0, 4)} yazına kadar sizde, maaşının %${o.wageShare}'ını siz ödeyeceksiniz. Süre bitince ${seller.name} kulübüne döner.`, pid: p.id });
      } else {
        o.status = 'countered';
        o.counterShare = need;
        addMessage(state, {
          teamId: o.from,
          title: `${seller.name} kiralama için şart koştu`,
          body: `${p.name} maaşının en az %${need}'ını üstlenirseniz ${loanText(o)} kiralamayı kabul edecekler.`,
          kind: 'counterLoan', needsAction: true, offerId: o.id, pid: p.id,
        });
      }
    }
  }
}

// Alıcı takım karşı teklife yanıt verir.
export function respondCounter(state, offerId, accept, actor = null) {
  const o = state.offers.find((x) => x.id === offerId);
  if (!o) return { text: 'Teklif bulunamadı.' };
  if (actor && o.from !== actor) return { text: 'Bu teklif size ait değil.' };
  resolveMessage(state, offerId);
  const p = state.players[o.pid];
  const buyer = state.teams[o.from];
  const humanSeller = isHuman(state, o.to);

  if (!accept) {
    o.status = 'withdrawn';
    if (humanSeller) addMessage(state, { teamId: o.to, title: `${buyer.name} karşı teklifinizi kabul etmedi`, body: `${p.name} için görüşmeler sona erdi.`, pid: p.id, quiet: true });
    return { text: 'Görüşmelerden çekildiniz.' };
  }
  if (p.teamId !== o.to) {
    o.status = 'cancelled';
    return { text: 'Oyuncu artık o kulüpte değil.' };
  }
  if (o.type === 'loan') {
    o.wageShare = o.counterShare;
    executeTransfer(state, p.id, o.from, { fee: o.fee, loan: true, loanYears: o.loanYears, wageShare: o.wageShare });
    o.status = 'completed';
    return { text: `${p.name} ${p.loan.until.slice(0, 4)} yazına kadar kiralık olarak takımınıza katıldı.` };
  }
  if (o.counter > buyer.finance.balance) {
    o.status = 'failed';
    if (humanSeller) addMessage(state, { teamId: o.to, title: 'Transfer gerçekleşmedi', body: `${buyer.name} istediğiniz bedeli karşılayamadı.`, pid: p.id, quiet: true });
    return { text: 'Bütçeniz bu bedel için yetersiz.' };
  }
  o.fee = o.counter;

  if (humanSeller) {
    if (buyer.squad.length >= MAX_SQUAD) {
      o.status = 'failed';
      return { text: `Kadronuz dolu (en fazla ${MAX_SQUAD} oyuncu).` };
    }
    o.status = 'completed';
    executeTransfer(state, p.id, o.from, { fee: o.fee, wage: Math.max(p.wage, expectedWage(p, buyer.rep, state.season)), years: 3 });
    addMessage(state, { teamId: o.to, title: `${buyer.name} karşı teklifinizi kabul etti`, body: `${p.name}, ${fmtMoney(o.fee)} bedelle ${buyer.name} takımına satıldı.`, pid: p.id });
    return { text: `${p.name}, ${fmtMoney(o.fee)} bedelle takımınıza katıldı.` };
  }

  o.status = 'accepted';
  addMessage(state, {
    teamId: o.from,
    title: `${p.name} ile sözleşme görüşmesi`,
    body: `Kulüpler ${fmtMoney(o.fee)} bedelde anlaştı. Şimdi oyuncuyla kişisel şartları konuşmalısınız.`,
    kind: 'negotiate', needsAction: true, offerId: o.id, pid: p.id,
  });
  return { text: 'Bonservis konusunda anlaşıldı. Gelen kutusundan sözleşme görüşmesini başlatın.' };
}

// --- İnsan takımlarının oyuncularına gelen yapay zekâ teklifleri (Türkiye ve Avrupa'dan) ---
function aiOffersForTeam(state, uid) {
  if (!chance(0.06)) return;
  const me = state.teams[uid];
  const sq = squad(state, uid).filter((p) => !p.loan && !p.injury);
  if (!sq.length) return;
  const target = weightedPick(sq, (p) => Math.max(1, p.ovr - 55) ** 2 * (avgRating(p) >= 7 ? 1.8 : 1) * (p.age <= 24 ? 1.4 : 1));
  if (state.offers.some((o) => o.pid === target.id && ['pending', 'countered'].includes(o.status))) return;
  const value = playerValue(target, state.season);

  if (target.age <= 23 && target.stats.apps <= 2 && chance(0.5)) {
    const clubs = Object.values(state.teams).filter((t) => !isHuman(state, t.id) && t.rep < me.rep && t.rep >= me.rep - 25 && t.squad.length < 32);
    if (!clubs.length) return;
    const club = weightedPick(clubs, (t) => (t.country === me.country ? 3 : 1));
    const years = chance(0.35) ? 2 : 1;
    const o = {
      id: `o${state.seq++}`, pid: target.id, from: club.id, to: uid, type: 'loan', fee: 0, loanYears: years,
      wageShare: randInt(5, 10) * 10, status: 'pending', created: state.date, user: false,
    };
    state.offers.unshift(o);
    addMessage(state, {
      teamId: uid,
      title: `${club.name}, ${target.name} için kiralama istiyor`,
      body: `${club.name} (${club.country === 'TR' ? club.league === 'SL' ? 'Süper Lig' : club.league === 'TR1' ? '1. Lig' : '2. Lig' : club.country}), forma şansı bulamayan ${target.name} oyuncusunu ${years} sezonluğuna kiralamak istiyor. Maaşının %${o.wageShare}'ını ödeyecekler. Kiralık süresi bitince oyuncu size döner.`,
      kind: 'incoming', needsAction: true, offerId: o.id, pid: target.id,
    });
    return;
  }

  const fee = roundMoney(value * (0.8 + rand() * 0.45));
  const clubs = Object.values(state.teams).filter(
    (t) => !isHuman(state, t.id) && t.id !== uid && t.finance.balance >= fee && t.rep >= me.rep - 12 && t.squad.length < 34
      && teamRating(squad(state, t.id)) <= target.ovr + 5,
  );
  if (!clubs.length) return;
  const club = weightedPick(clubs, (t) => (t.country === 'TR' ? 1 : 1.6) * Math.max(1, t.rep - 50));
  const o = {
    id: `o${state.seq++}`, pid: target.id, from: club.id, to: uid, type: 'transfer', fee,
    status: 'pending', created: state.date, user: false, round: 0,
  };
  state.offers.unshift(o);
  const where = club.country === 'TR' ? '' : ` (${club.country})`;
  addMessage(state, {
    teamId: uid,
    title: `${club.name}, ${target.name} için ${fmtMoney(fee)} teklif etti`,
    body: `${club.name}${where}, ${target.name} (${POS_LONG[target.pos]}, ${target.age}) için ${fmtMoney(fee)} bonservis teklif etti. Oyuncunun tahmini piyasa değeri ${fmtMoney(value)}.`,
    kind: 'incoming', needsAction: true, offerId: o.id, pid: target.id,
  });
}

// Satıcı takım (insan) gelen teklife yanıt verir.
export function respondIncoming(state, offerId, action, counterFee = 0, actor = null) {
  const o = state.offers.find((x) => x.id === offerId);
  if (!o) return { text: 'Teklif bulunamadı.' };
  if (actor && o.to !== actor) return { text: 'Bu teklif size ait değil.' };
  resolveMessage(state, offerId);
  const p = state.players[o.pid];
  const uid = o.to;
  const seller = state.teams[uid];

  if (p.teamId !== uid) {
    o.status = 'cancelled';
    return { text: 'Oyuncu artık takımınızda değil.' };
  }

  // Teklifi yapan başka bir insan teknik direktör
  if (o.user && isHuman(state, o.from)) {
    const buyer = state.teams[o.from];
    if (action === 'accept') {
      if (buyer.finance.balance < o.fee) {
        o.status = 'failed';
        addMessage(state, { teamId: o.from, title: 'Transfer gerçekleşmedi', body: `${p.name} için teklifiniz kabul edildi ama kasanızda yeterli para kalmamıştı.`, pid: p.id });
        return { text: `${buyer.name} bonservis bedelini karşılayamadı, transfer gerçekleşmedi.` };
      }
      if (buyer.squad.length >= MAX_SQUAD) {
        o.status = 'failed';
        return { text: `${buyer.name} kadrosu dolu olduğu için transfer gerçekleşmedi.` };
      }
      o.status = 'completed';
      if (o.type === 'loan') executeTransfer(state, p.id, o.from, { fee: o.fee, loan: true, loanYears: o.loanYears, wageShare: o.wageShare });
      else executeTransfer(state, p.id, o.from, { fee: o.fee, wage: Math.max(p.wage, expectedWage(p, buyer.rep, state.season)), years: 3 });
      addMessage(state, { teamId: o.from, title: `${seller.name} teklifinizi kabul etti`, body: `${p.name} artık ${o.type === 'loan' ? `${p.loan.until.slice(0, 4)} yazına kadar kiralık olarak ` : ''}takımınızda.`, pid: p.id });
      return { text: o.type === 'loan' ? `${p.name}, ${buyer.name} takımına kiralandı.` : `${p.name}, ${fmtMoney(o.fee)} bedelle ${buyer.name} takımına satıldı.` };
    }
    if (action === 'reject') {
      o.status = 'rejected';
      addMessage(state, { teamId: o.from, title: `${seller.name} teklifinizi reddetti`, body: `${managerOf(state, uid)}, ${p.name} için yaptığınız teklifi kabul etmedi.`, pid: p.id });
      return { text: 'Teklif reddedildi.' };
    }
    if (o.type !== 'transfer') return { text: 'Kiralama tekliflerine karşı teklif yapılamaz.' };
    o.status = 'countered';
    o.counter = roundMoney(counterFee);
    addMessage(state, {
      teamId: o.from,
      title: `${seller.name} karşı teklif yaptı`,
      body: `${managerOf(state, uid)}, ${p.name} için ${fmtMoney(o.counter)} istiyor.`,
      kind: 'counter', needsAction: true, offerId: o.id, pid: p.id,
    });
    return { text: `Karşı teklifiniz (${fmtMoney(o.counter)}) ${buyer.name} yönetimine iletildi.` };
  }

  const club = o.from ? state.teams[o.from] : null;
  const clubName = o.fromForeign || club?.name || 'Yabancı kulüp';
  const clubRep = club?.rep ?? 70;

  const complete = (fee) => {
    o.fee = fee;
    o.status = 'completed';
    if (!club) executeTransfer(state, p.id, null, { fee, toForeign: clubName });
    else if (o.type === 'loan') executeTransfer(state, p.id, o.from, { loan: true, loanYears: o.loanYears, wageShare: o.wageShare });
    else executeTransfer(state, p.id, o.from, { fee, wage: Math.max(p.wage, expectedWage(p, clubRep, state.season)), years: randInt(2, 4) });
  };

  if (action === 'accept') {
    complete(o.fee);
    return { text: o.type === 'loan' ? `${p.name}, ${clubName} takımına kiralandı.` : `${p.name}, ${fmtMoney(o.fee)} bedelle ${clubName} kulübüne satıldı.` };
  }
  if (action === 'reject') {
    o.status = 'rejected';
    if (o.type === 'transfer' && clubRep > seller.rep + 3) {
      p.morale = clamp(p.morale - 12, 0, 100);
      return { text: `Teklif reddedildi. ${p.name} daha büyük bir kulübe gidememekten dolayı hayal kırıklığına uğradı.` };
    }
    return { text: 'Teklif reddedildi.' };
  }
  // Karşı teklif
  const maxPay = o.fee * (1.15 + rand() * 0.35);
  const canAfford = !club || club.finance.balance >= counterFee;
  if (counterFee <= maxPay && canAfford) {
    complete(roundMoney(counterFee));
    return { text: `${clubName} karşı teklifinizi kabul etti! ${p.name}, ${fmtMoney(counterFee)} bedelle satıldı.` };
  }
  if ((o.round || 0) < 1 && chance(0.5)) {
    o.round = (o.round || 0) + 1;
    o.fee = roundMoney((o.fee + Math.min(counterFee, maxPay * 1.05)) / 2);
    o.status = 'pending';
    addMessage(state, {
      teamId: uid,
      title: `${clubName} teklifini ${fmtMoney(o.fee)} seviyesine çıkardı`,
      body: `${clubName}, ${p.name} için teklifini ${fmtMoney(o.fee)} olarak güncelledi. Bu son teklifleri olabilir.`,
      kind: 'incoming', needsAction: true, offerId: o.id, pid: p.id,
    });
    return { text: `${clubName} teklifini yükseltti. Gelen kutunuza bakın.` };
  }
  o.status = 'withdrawn';
  return { text: `${clubName} istediğiniz bedeli fazla buldu ve görüşmelerden çekildi.` };
}

// --- Yapay zekâ kulüplerinin hareketleri (Türkiye ve Avrupa) ---
function aiMarket(state) {
  const buyers = Object.values(state.teams).filter((t) => !isHuman(state, t.id) && t.finance.balance > 300000 && t.squad.length < 32);
  if (!buyers.length) return;
  const buyer = weightedPick(buyers, (t) => Math.max(1, t.finance.balance) ** 0.5);
  const bsq = squad(state, buyer.id);
  const br = teamRating(bsq);
  // Eksik mevki: o mevkideki en iyi oyuncunun takım gücüne göre zayıflığı ve derinlik
  const need = POSITIONS
    .map((pos) => {
      const list = bsq.filter((p) => p.pos === pos && !p.injury).sort((a, b) => b.ovr - a.ovr);
      return { pos, best: list[0]?.ovr || 0, depth: list.length, score: (list[0]?.ovr || 0) - br + list.length * 1.5 };
    })
    .sort((a, b) => a.score - b.score)[0];
  const budget = buyer.finance.balance * 0.55;
  const minOvr = Math.max(need.best + 1, br - 6);
  const candidates = [];
  for (const p of Object.values(state.players)) {
    if (p.retired || p.pos !== need.pos || p.ovr < minOvr || p.ovr > br + 6 || p.injury || p.loan || p.age > 32) continue;
    if (p.teamId === buyer.id || isHuman(state, p.teamId) || (!p.teamId && p.abroad)) continue;
    candidates.push(p);
  }
  if (!candidates.length) return;
  const target = weightedPick(candidates, (p) => (p.ovr - need.best + 2) * (p.age <= 26 ? 1.4 : 1) * (state.teams[p.teamId]?.country === buyer.country ? 2 : 1));
  const wageMul = Math.sqrt(moneyFactor(buyer.country));
  if (!target.teamId) {
    executeTransfer(state, target.id, buyer.id, { fee: 0, wage: roundMoney(expectedWage(target, buyer.rep, state.season) * wageMul), years: randInt(1, 2) });
    return;
  }
  const seller = state.teams[target.teamId];
  const ask = askingPrice(state, target, buyer.id);
  if (ask > budget) return;
  if (seller.rep - buyer.rep > 10 && playerRole(state, target) !== 'surplus') return;
  if (seller.squad.length <= 20) return;
  executeTransfer(state, target.id, buyer.id, { fee: ask, wage: roundMoney(expectedWage(target, buyer.rep, state.season) * wageMul), years: randInt(2, 4) });
}

function aiLoans(state) {
  if (!chance(0.25)) return;
  const owners = Object.values(state.teams).filter((t) => !isHuman(state, t.id) && t.rep >= 66 && t.squad.length > 26);
  if (!owners.length) return;
  const owner = pick(owners);
  const youngsters = squad(state, owner.id).filter((p) => !p.loan && p.age <= 21 && playerRole(state, p) === 'surplus' && p.stats.apps <= 3);
  if (!youngsters.length) return;
  const p = pick(youngsters);
  const takers = Object.values(state.teams).filter((t) => !isHuman(state, t.id) && t.rep < owner.rep - 6 && t.rep >= owner.rep - 28 && t.squad.length < 30);
  if (!takers.length) return;
  const taker = weightedPick(takers, (t) => (t.country === owner.country ? 3 : 1));
  executeTransfer(state, p.id, taker.id, { loan: true, loanYears: chance(0.3) ? 2 : 1, wageShare: randInt(3, 8) * 10 });
}

export function dailyTransfers(state) {
  resolveUserBids(state);
  const w = currentWindow(state);
  if (!w) return;
  for (const uid of humansOf(state)) aiOffersForTeam(state, uid);
  for (let i = 0; i < 3; i++) if (chance(0.35)) aiMarket(state);
  aiLoans(state);
}

// Kadrosu eksik kalan yapay zekâ takımlarını serbest oyuncularla tamamlar, fazla kalabalık kadroları azaltır.
export function fillAiSquads(state) {
  const free = Object.values(state.players).filter((p) => !p.teamId && !p.retired && !p.abroad).sort((a, b) => b.ovr - a.ovr);
  for (const team of Object.values(state.teams)) {
    if (isHuman(state, team.id)) continue;
    const sq = squad(state, team.id);
    if (sq.length > MAX_SQUAD - 1) {
      const out = sq.filter((p) => !p.loan).sort((a, b) => a.ovr - b.ovr || b.age - a.age)[0];
      if (out) {
        team.squad = team.squad.filter((id) => id !== out.id);
        out.teamId = null;
        out.freeSince = state.season;
      }
      continue;
    }
    const gks = sq.filter((p) => p.pos === 'GK').length;
    if (sq.length >= 23 && gks >= 2) continue;
    const idx = free.findIndex((p) => !p.teamId && (gks < 2 ? p.pos === 'GK' : true));
    if (idx < 0) continue;
    const p = free[idx];
    free.splice(idx, 1);
    executeTransfer(state, p.id, team.id, { fee: 0, wage: roundMoney(expectedWage(p, team.rep, state.season) * Math.sqrt(moneyFactor(team.country))), years: randInt(1, 2) });
  }
}
