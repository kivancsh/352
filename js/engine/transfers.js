// Transfer piyasası: teklifler, kiralamalar, sözleşme görüşmeleri ve yapay zekâ kulüplerinin hareketleri.
import { FOREIGN_CLUBS } from '../data/teams.js';
import { rand, randInt, chance, pick, weightedPick, clamp, addDays, roundMoney, fmtMoney } from './util.js';
import { playerValue, expectedWage, POSITIONS, avgRating, POS_LONG } from './players.js';
import { teamRating } from './tactics.js';
import { addMessage, addNews, resolveMessage } from './inbox.js';

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
  if (seller && seller.finance.balance < 0) f *= 0.85;
  return roundMoney(value * f);
}

// --- Sözleşme ---
export function contractDemand(state, p, teamId) {
  const team = state.teams[teamId];
  const current = p.teamId ? state.teams[p.teamId] : null;
  const fromRep = current ? current.rep : 55;
  let wage = expectedWage(p, team.rep, state.season);
  if (current && current.id !== teamId && team.rep < fromRep) wage *= 1 + (fromRep - team.rep) * 0.025;
  if (!current) wage *= 0.9;
  if (current && current.id === teamId) wage = Math.max(wage, p.wage * 1.05);
  wage = roundMoney(wage);
  const years = p.age >= 32 ? 1 : p.age >= 29 ? 2 : 3;
  let refuse = null;
  if (current && current.id !== teamId && fromRep - team.rep >= 22 && p.ovr >= 74) {
    refuse = `${p.name}, ${current.name} gibi büyük bir kulüpten ayrılıp ${team.name} takımına gelmeyi düşünmüyor.`;
  }
  if (current && current.id === teamId && p.morale < 25) {
    refuse = `${p.name} kulüpte mutsuz ve sözleşme uzatmak istemiyor.`;
  }
  return { wage, years, refuse };
}

export function proposeContract(state, { pid, wage, years, offerId = null }) {
  const p = state.players[pid];
  const uid = state.userTeamId;
  const me = state.teams[uid];
  const offer = offerId ? state.offers.find((o) => o.id === offerId) : null;
  state.negotiations = state.negotiations || {};
  const neg = (state.negotiations[pid] = state.negotiations[pid] || { tries: 0 });

  if (offer && p.teamId !== offer.to) {
    offer.status = 'cancelled';
    resolveMessage(state, offer.id);
    return { result: 'walkaway', text: `${p.name} artık başka bir kulüpte.` };
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
    finishNegotiation(state, pid, offer, 'failed');
    return { result: 'walkaway', text: d.refuse };
  }
  const yearsF = years > d.years ? (p.age >= 30 ? 0.93 : 1.02) : years < d.years ? (p.age >= 30 ? 1.08 : 0.98) : 1;
  const need = roundMoney(d.wage * yearsF);

  if (wage >= need * 0.97) {
    if (offer) {
      executeTransfer(state, pid, uid, { fee: offer.fee, wage, years });
      offer.status = 'completed';
      finishNegotiation(state, pid, offer, 'completed');
      return { result: 'accepted', text: `${p.name} ${me.name} ile ${years} yıllık sözleşme imzaladı!` };
    }
    if (p.teamId === uid) {
      p.wage = wage;
      p.contractEnd = state.season + years;
      p.morale = clamp(p.morale + 8, 0, 100);
      finishNegotiation(state, pid, null, 'completed');
      addNews(state, `${me.name}, ${p.name} ile sözleşme uzattı.`);
      return { result: 'accepted', text: `${p.name} sözleşmesini ${state.season + years} yazına kadar uzattı.` };
    }
    executeTransfer(state, pid, uid, { fee: 0, wage, years });
    finishNegotiation(state, pid, null, 'completed');
    return { result: 'accepted', text: `Serbest oyuncu ${p.name} takımınıza katıldı!` };
  }
  if (neg.tries >= 3) {
    finishNegotiation(state, pid, offer, 'failed');
    return { result: 'walkaway', text: `${p.name} görüşmeleri sonlandırdı. Beklentisi yıllık ${fmtMoney(need)} idi.` };
  }
  if (wage >= need * 0.75) {
    return { result: 'counter', wage: need, text: `${p.name} yıllık ${fmtMoney(need)} maaş istiyor.` };
  }
  return { result: 'rejected', wage: need, text: `Teklifinizi çok düşük buldu. Beklentisi yıllık ${fmtMoney(need)} civarında.` };
}

function finishNegotiation(state, pid, offer, status) {
  if (state.negotiations) delete state.negotiations[pid];
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
  if (state.negotiations) delete state.negotiations[o.pid];
}

// --- Transferi gerçekleştir ---
export function executeTransfer(state, pid, toId, { fee = 0, loan = false, wage = null, years = 2, wageShare = 100, toForeign = null } = {}) {
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
  if (toForeign) {
    p.teamId = null;
    p.abroad = toForeign;
    p.loan = null;
    state.transferLog.unshift({ date: state.date, pid, name: p.name, from: fromName, to: toForeign, fee, loan: false });
    addNews(state, `${p.name}, ${fmtMoney(fee)} bedelle ${fromName} takımından ${toForeign} kulübüne transfer oldu.`);
    return;
  }

  const to = state.teams[toId];
  to.squad.push(pid);
  to.finance.balance -= fee;
  to.finance.season.purchases += fee;
  p.teamId = toId;
  p.abroad = null;
  p.morale = clamp(p.morale + 10, 0, 100);
  if (loan) {
    p.loan = { fromTeam: fromId, fromName, until: `${state.season + 1}-06-30`, wageShare };
  } else {
    p.loan = null;
    p.wage = wage ?? expectedWage(p, to.rep, state.season);
    p.contractEnd = state.season + years;
  }
  state.transferLog.unshift({ date: state.date, pid, name: p.name, from: fromName, to: to.name, fee, loan });
  if (state.transferLog.length > 300) state.transferLog.length = 300;
  const what = loan ? 'kiralık olarak' : fee > 0 ? `${fmtMoney(fee)} bedelle` : 'bedelsiz olarak';
  addNews(state, `${p.name}, ${fromName} takımından ${what} ${to.name} kulübüne geçti.`);
}

// --- Kullanıcının teklifleri ---
export function makeBid(state, { pid, type, fee = 0, wageShare = 100 }) {
  const p = state.players[pid];
  const uid = state.userTeamId;
  const me = state.teams[uid];
  if (!p || p.retired) return { ok: false, error: 'Oyuncu bulunamadı.' };
  if (p.teamId === uid) return { ok: false, error: 'Bu oyuncu zaten takımınızda.' };
  if (!p.teamId) return { ok: true, freeAgent: true };
  if (!windowOpen(state)) return { ok: false, error: 'Transfer dönemi kapalı. Yalnızca serbest oyuncularla anlaşabilirsiniz.' };
  if (p.loan) return { ok: false, error: 'Bu oyuncu başka bir kulüpten kiralık, şu an transfer edilemez.' };
  if (state.offers.some((o) => o.pid === pid && o.user && ['pending', 'countered', 'accepted'].includes(o.status))) {
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
    status: 'pending',
    created: state.date,
    respondOn: addDays(state.date, randInt(1, 2)),
    user: true,
  };
  state.offers.unshift(offer);
  return { ok: true, offer };
}

function resolveUserBids(state) {
  for (const o of state.offers) {
    if (!o.user || o.status !== 'pending' || o.respondOn > state.date) continue;
    const p = state.players[o.pid];
    const seller = state.teams[o.to];
    if (p.teamId !== o.to) {
      o.status = 'cancelled';
      addMessage(state, { title: `${p.name} için teklifiniz geçersiz`, body: 'Oyuncu bu arada başka bir kulübe transfer oldu.' });
      continue;
    }
    if (o.type === 'transfer') {
      const ask = askingPrice(state, p, o.from);
      if (o.fee >= ask) {
        o.status = 'accepted';
        addMessage(state, {
          title: `${seller.name} teklifinizi kabul etti`,
          body: `${p.name} için ${fmtMoney(o.fee)} bonservis teklifiniz kabul edildi. Şimdi oyuncuyla kişisel şartları konuşmalısınız.`,
          kind: 'negotiate', needsAction: true, offerId: o.id, pid: p.id,
        });
      } else if (o.fee >= ask * 0.75) {
        o.status = 'countered';
        o.counter = ask;
        addMessage(state, {
          title: `${seller.name} karşı teklif yaptı`,
          body: `${p.name} için ${fmtMoney(o.fee)} teklifinizi yetersiz buldular. ${fmtMoney(ask)} ödemeye razı olursanız oyuncuyu bırakacaklar.`,
          kind: 'counter', needsAction: true, offerId: o.id, pid: p.id,
        });
      } else {
        o.status = 'rejected';
        addMessage(state, {
          title: `${seller.name} teklifinizi reddetti`,
          body: `${p.name} için ${fmtMoney(o.fee)} teklifinizi değerlendirmeye bile almadılar. Oyuncunun kulüpteki rolü: ${ROLE_TR[playerRole(state, p)]}.`,
          pid: p.id,
        });
      }
    } else {
      const role = playerRole(state, p);
      if (role === 'key' || (role === 'starter' && p.age >= 23)) {
        o.status = 'rejected';
        addMessage(state, { title: `${seller.name} kiralama teklifini reddetti`, body: `${p.name} takımın önemli oyuncularından, kiralık verilmeyecek.`, pid: p.id });
        continue;
      }
      let need = role === 'starter' ? 80 : role === 'rotation' ? 50 : 25;
      if (o.fee >= playerValue(p, state.season) * 0.1) need -= 20;
      if (o.wageShare >= need) {
        if (o.fee > state.teams[o.from].finance.balance) {
          o.status = 'failed';
          addMessage(state, { title: 'Kiralama gerçekleşmedi', body: 'Kiralama bedeli için bütçeniz yetersiz kaldı.' });
          continue;
        }
        executeTransfer(state, p.id, o.from, { fee: o.fee, loan: true, wageShare: o.wageShare });
        o.status = 'completed';
        addMessage(state, { title: `${p.name} kiralık olarak takımınızda`, body: `${seller.name} ile anlaşma sağlandı. Oyuncu sezon sonuna kadar sizde, maaşının %${o.wageShare}'ını siz ödeyeceksiniz.`, pid: p.id });
      } else {
        o.status = 'countered';
        o.counterShare = need;
        addMessage(state, {
          title: `${seller.name} kiralama için şart koştu`,
          body: `${p.name} maaşının en az %${need}'ını üstlenirseniz kiralamayı kabul edecekler.`,
          kind: 'counterLoan', needsAction: true, offerId: o.id, pid: p.id,
        });
      }
    }
  }
}

export function respondCounter(state, offerId, accept) {
  const o = state.offers.find((x) => x.id === offerId);
  resolveMessage(state, offerId);
  if (!o) return { text: 'Teklif bulunamadı.' };
  const p = state.players[o.pid];
  if (!accept) {
    o.status = 'withdrawn';
    return { text: 'Görüşmelerden çekildiniz.' };
  }
  if (p.teamId !== o.to) {
    o.status = 'cancelled';
    return { text: 'Oyuncu artık o kulüpte değil.' };
  }
  if (o.type === 'loan') {
    o.wageShare = o.counterShare;
    executeTransfer(state, p.id, o.from, { fee: o.fee, loan: true, wageShare: o.wageShare });
    o.status = 'completed';
    return { text: `${p.name} kiralık olarak takımınıza katıldı.` };
  }
  if (o.counter > state.teams[o.from].finance.balance) {
    o.status = 'failed';
    return { text: 'Bütçeniz bu bedel için yetersiz.' };
  }
  o.fee = o.counter;
  o.status = 'accepted';
  addMessage(state, {
    title: `${p.name} ile sözleşme görüşmesi`,
    body: `Kulüpler ${fmtMoney(o.fee)} bedelde anlaştı. Şimdi oyuncuyla kişisel şartları konuşmalısınız.`,
    kind: 'negotiate', needsAction: true, offerId: o.id, pid: p.id,
  });
  return { text: 'Bonservis konusunda anlaşıldı. Gelen kutusundan sözleşme görüşmesini başlatın.' };
}

// --- Kullanıcının oyuncularına gelen teklifler ---
function aiOffersForUser(state) {
  if (!chance(0.06)) return;
  const uid = state.userTeamId;
  const me = state.teams[uid];
  const sq = squad(state, uid).filter((p) => !p.loan && !p.injury);
  if (!sq.length) return;
  const target = weightedPick(sq, (p) => Math.max(1, p.ovr - 55) ** 2 * (avgRating(p) >= 7 ? 1.8 : 1) * (p.age <= 24 ? 1.4 : 1));
  if (state.offers.some((o) => o.pid === target.id && ['pending', 'countered'].includes(o.status))) return;
  const value = playerValue(target, state.season);

  if (target.age <= 23 && target.stats.apps <= 2 && chance(0.5)) {
    const clubs = Object.values(state.teams).filter((t) => t.id !== uid && t.rep < me.rep);
    if (!clubs.length) return;
    const club = pick(clubs);
    const o = {
      id: `o${state.seq++}`, pid: target.id, from: club.id, to: uid, type: 'loan', fee: 0,
      wageShare: randInt(5, 10) * 10, status: 'pending', created: state.date, user: false,
    };
    state.offers.unshift(o);
    addMessage(state, {
      title: `${club.name}, ${target.name} için kiralama istiyor`,
      body: `${club.name}, forma şansı bulamayan ${target.name} oyuncusunu sezon sonuna kadar kiralamak istiyor. Maaşının %${o.wageShare}'ını ödeyecekler.`,
      kind: 'incoming', needsAction: true, offerId: o.id, pid: target.id,
    });
    return;
  }

  const fee = roundMoney(value * (0.8 + rand() * 0.45));
  const league = Object.values(state.teams).filter(
    (t) => t.id !== uid && t.finance.balance >= fee && t.rep >= me.rep - 12 && teamRating(squad(state, t.id)) <= target.ovr + 4,
  );
  const foreign = FOREIGN_CLUBS.filter((c) => c.rep >= me.rep - 8 && 12e6 * c.money * (c.rep / 80) ** 3 >= fee);
  let fromId = null;
  let fromForeign = null;
  if (foreign.length && (chance(0.6) || !league.length)) fromForeign = pick(foreign).name;
  else if (league.length) fromId = pick(league).id;
  else return;

  const o = {
    id: `o${state.seq++}`, pid: target.id, from: fromId, fromForeign, to: uid, type: 'transfer', fee,
    status: 'pending', created: state.date, user: false, round: 0,
  };
  state.offers.unshift(o);
  const clubName = fromForeign || state.teams[fromId].name;
  addMessage(state, {
    title: `${clubName}, ${target.name} için ${fmtMoney(fee)} teklif etti`,
    body: `${clubName}, ${target.name} (${POS_LONG[target.pos]}, ${target.age}) için ${fmtMoney(fee)} bonservis teklif etti. Oyuncunun tahmini piyasa değeri ${fmtMoney(value)}.`,
    kind: 'incoming', needsAction: true, offerId: o.id, pid: target.id,
  });
}

export function respondIncoming(state, offerId, action, counterFee = 0) {
  const o = state.offers.find((x) => x.id === offerId);
  resolveMessage(state, offerId);
  if (!o) return { text: 'Teklif bulunamadı.' };
  const p = state.players[o.pid];
  const uid = state.userTeamId;
  const clubName = o.fromForeign || state.teams[o.from].name;
  const clubRep = o.fromForeign ? FOREIGN_CLUBS.find((c) => c.name === o.fromForeign)?.rep ?? 70 : state.teams[o.from].rep;

  if (p.teamId !== uid) {
    o.status = 'cancelled';
    return { text: 'Oyuncu artık takımınızda değil.' };
  }

  const complete = (fee) => {
    o.fee = fee;
    o.status = 'completed';
    if (o.type === 'loan') executeTransfer(state, p.id, o.from, { loan: true, wageShare: o.wageShare });
    else if (o.fromForeign) executeTransfer(state, p.id, null, { fee, toForeign: o.fromForeign });
    else executeTransfer(state, p.id, o.from, { fee, wage: Math.max(p.wage, expectedWage(p, clubRep, state.season)), years: randInt(2, 4) });
  };

  if (action === 'accept') {
    complete(o.fee);
    return { text: o.type === 'loan' ? `${p.name}, ${clubName} takımına kiralandı.` : `${p.name}, ${fmtMoney(o.fee)} bedelle ${clubName} kulübüne satıldı.` };
  }
  if (action === 'reject') {
    o.status = 'rejected';
    if (o.type === 'transfer' && clubRep > state.teams[uid].rep + 3) {
      p.morale = clamp(p.morale - 12, 0, 100);
      return { text: `Teklif reddedildi. ${p.name} daha büyük bir kulübe gidememekten dolayı hayal kırıklığına uğradı.` };
    }
    return { text: 'Teklif reddedildi.' };
  }
  // Karşı teklif
  const maxPay = o.fee * (1.15 + rand() * 0.35);
  const canAfford = o.fromForeign || state.teams[o.from].finance.balance >= counterFee;
  if (counterFee <= maxPay && canAfford) {
    complete(roundMoney(counterFee));
    return { text: `${clubName} karşı teklifinizi kabul etti! ${p.name}, ${fmtMoney(counterFee)} bedelle satıldı.` };
  }
  if ((o.round || 0) < 1 && chance(0.5)) {
    o.round = (o.round || 0) + 1;
    o.fee = roundMoney((o.fee + Math.min(counterFee, maxPay * 1.05)) / 2);
    o.status = 'pending';
    addMessage(state, {
      title: `${clubName} teklifini ${fmtMoney(o.fee)} seviyesine çıkardı`,
      body: `${clubName}, ${p.name} için teklifini ${fmtMoney(o.fee)} olarak güncelledi. Bu son teklifleri olabilir.`,
      kind: 'incoming', needsAction: true, offerId: o.id, pid: p.id,
    });
    return { text: `${clubName} teklifini yükseltti. Gelen kutunuza bakın.` };
  }
  o.status = 'withdrawn';
  return { text: `${clubName} istediğiniz bedeli fazla buldu ve görüşmelerden çekildi.` };
}

// --- Yapay zekâ kulüplerinin kendi aralarındaki hareketler ---
function aiMarket(state) {
  if (!chance(0.2)) return;
  const uid = state.userTeamId;
  const buyers = Object.values(state.teams).filter((t) => t.id !== uid && t.finance.balance > 400000 && t.squad.length < 32);
  if (!buyers.length) return;
  const buyer = weightedPick(buyers, (t) => t.finance.balance);
  const bsq = squad(state, buyer.id);
  const br = teamRating(bsq);
  const need = POSITIONS
    .map((pos) => ({ pos, best: Math.max(0, ...bsq.filter((p) => p.pos === pos && !p.injury).map((p) => p.ovr)) }))
    .sort((a, b) => a.best - b.best)[0];
  const budget = buyer.finance.balance * 0.6;
  const candidates = Object.values(state.players).filter(
    (p) => !p.retired && p.pos === need.pos && p.ovr > need.best + 1 && p.ovr <= br + 8 && !p.injury && !p.loan
      && p.teamId !== buyer.id && p.teamId !== uid && (p.teamId || !p.abroad),
  );
  if (!candidates.length) return;
  const target = weightedPick(candidates, (p) => p.ovr - need.best);
  if (!target.teamId) {
    executeTransfer(state, target.id, buyer.id, { fee: 0, wage: expectedWage(target, buyer.rep, state.season), years: randInt(1, 2) });
    return;
  }
  const ask = askingPrice(state, target, buyer.id);
  if (ask > budget) return;
  if (state.teams[target.teamId].rep - buyer.rep > 15 && playerRole(state, target) !== 'surplus') return;
  if (state.teams[target.teamId].squad.length <= 22) return;
  executeTransfer(state, target.id, buyer.id, { fee: ask, wage: expectedWage(target, buyer.rep, state.season), years: randInt(2, 4) });
}

function foreignSales(state) {
  if (!chance(0.03)) return;
  const uid = state.userTeamId;
  const cands = Object.values(state.players).filter((p) => p.teamId && p.teamId !== uid && !p.loan && p.ovr >= 74 && p.age <= 29);
  if (!cands.length) return;
  const target = weightedPick(cands, (p) => p.ovr - 70);
  const team = state.teams[target.teamId];
  if (team.squad.length <= 22) return;
  const clubs = FOREIGN_CLUBS.filter((c) => c.rep >= team.rep - 5);
  if (!clubs.length) return;
  const fee = roundMoney(playerValue(target, state.season) * (1 + rand() * 0.3));
  executeTransfer(state, target.id, null, { fee, toForeign: pick(clubs).name });
}

function aiLoans(state) {
  if (!chance(0.05)) return;
  const uid = state.userTeamId;
  const bigs = Object.values(state.teams).filter((t) => t.id !== uid && t.rep >= 70);
  if (!bigs.length) return;
  const owner = pick(bigs);
  const youngsters = squad(state, owner.id).filter((p) => !p.loan && p.age <= 22 && playerRole(state, p) === 'surplus' && p.stats.apps <= 3);
  if (!youngsters.length || owner.squad.length <= 24) return;
  const p = pick(youngsters);
  const takers = Object.values(state.teams).filter((t) => t.id !== uid && t.rep < owner.rep - 8 && t.squad.length < 30);
  if (!takers.length) return;
  executeTransfer(state, p.id, pick(takers).id, { loan: true, wageShare: randInt(3, 8) * 10 });
}

export function dailyTransfers(state) {
  resolveUserBids(state);
  const w = currentWindow(state);
  if (!w) return;
  aiOffersForUser(state);
  aiMarket(state);
  foreignSales(state);
  aiLoans(state);
}

// Kadrosu eksik kalan yapay zekâ takımlarını serbest oyuncularla tamamlar.
export function fillAiSquads(state) {
  const uid = state.userTeamId;
  for (const team of Object.values(state.teams)) {
    if (team.id === uid) continue;
    const sq = squad(state, team.id);
    const gks = sq.filter((p) => p.pos === 'GK').length;
    if (sq.length >= 23 && gks >= 2) continue;
    const free = Object.values(state.players)
      .filter((p) => !p.teamId && !p.retired && !p.abroad && (gks < 2 ? p.pos === 'GK' : true))
      .sort((a, b) => b.ovr - a.ovr);
    const p = free[0];
    if (p) executeTransfer(state, p.id, team.id, { fee: 0, wage: expectedWage(p, team.rep, state.season), years: randInt(1, 2) });
  }
}
