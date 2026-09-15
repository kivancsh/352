// Dakika dakika istatistiksel maç motoru.
// Aynı sınıf hem canlı izlenen maçlarda (UI her dakika step() çağırır)
// hem de anında sonuçlanan maçlarda (simulateMatch) kullanılır.
// Eleme maçlarında gerekiyorsa uzatma (2x15) ve penaltı atışları oynanır.
import { rand, randInt, chance, pick, weightedPick, clamp, normal } from './util.js';
import { randomInjury, isAvailable, posFit } from './players.js';
import { FORMATIONS, MENTALITIES, LINE_W, formationNorm, playerEff, autoPick, teamRating } from './tactics.js';
import { isHuman } from './inbox.js';

const SHOT_W = { GK: 0, CB: 0.6, RB: 0.5, LB: 0.5, DM: 0.6, CM: 1.3, AM: 2.6, RW: 3, LW: 3, ST: 5 };
const ASSIST_W = { GK: 0.05, CB: 0.5, RB: 1.8, LB: 1.8, DM: 1, CM: 2.5, AM: 4, RW: 3.5, LW: 3.5, ST: 2 };
const FOUL_W = { GK: 0.1, CB: 3, RB: 2.2, LB: 2.2, DM: 3, CM: 2, AM: 1.2, RW: 1.2, LW: 1.2, ST: 1.3 };
const DEF_SLOTS = new Set(['GK', 'CB', 'RB', 'LB']);

// İç saha avantajı: ev sahibi takımın sahadaki etkinliği %7 daha yüksek (tarafsız sahada uygulanmaz).
export const HOME_EDGE = 1.07;

const GOAL_TEXT = [
  (s) => `Ceza sahası içinden sert vuruş ve top ağlarda! Golü atan ${s}.`,
  (s) => `${s} kafayla topu filelere gönderdi!`,
  (s) => `Uzak köşeye harika bir plase! ${s} affetmedi.`,
  (s) => `Kaleciyle karşı karşıya kalan ${s} topu ağlara yolladı.`,
  (s) => `Ceza sahası dışından füze! ${s} müthiş bir gol attı.`,
  (s) => `Karambolde top ${s} önünde kaldı, gol!`,
];
const SAVE_TEXT = [
  (s, g) => `${s} kaleyi yokladı, ${g} gole izin vermedi.`,
  (s, g) => `${g} son anda uzanarak ${s} şutunu kornere çeldi.`,
  (s, g) => `Şut: ${s}. Kaleci ${g} topu kontrol etti.`,
];
const MISS_TEXT = [
  (s) => `${s} şutunu çekti, top auta gitti.`,
  (s) => `${s} vurdu, top direğin yanından dışarı!`,
  (s) => `Direkten döndü! ${s} golü kıl payı kaçırdı.`,
  (s) => `${s} şutu savunmadan döndü.`,
];
const FILLER = [
  'Oyun orta sahada karşılıklı mücadeleyle sürüyor.',
  'Tribünler takımını ateşliyor.',
  'Topa sahip olan taraf pas trafiğiyle boşluk arıyor.',
  'Tempo biraz düştü, takımlar kontrollü oynuyor.',
  'Kanatlardan etkili ataklar geliştirilmeye çalışılıyor.',
];

function emptyStats() {
  return { shots: 0, onT: 0, poss: 0, fouls: 0, corners: 0, yel: 0, red: 0, xg: 0 };
}

// Kadrodaki uygun olmayan (sakat, cezalı, takımdan ayrılmış) oyuncuları ayıklayıp
// eksik slotları en uygun oyuncularla doldurur.
export function prepareLineup(state, teamId) {
  const team = state.teams[teamId];
  const squad = squadOf(state, teamId);
  const slots = FORMATIONS[team.formation];
  if (!team.lineup || team.lineup.length !== slots.length || !isHuman(state, teamId)) {
    return autoPick(squad, team.formation);
  }
  const ok = (pid) => pid && state.players[pid] && state.players[pid].teamId === teamId && isAvailable(state.players[pid]);
  const lineup = team.lineup.map((pid) => (ok(pid) ? pid : null));
  const used = new Set(lineup.filter(Boolean));
  lineup.forEach((pid, i) => {
    if (pid) return;
    let best = null;
    let bestScore = -1;
    for (const p of squad) {
      if (used.has(p.id) || !isAvailable(p)) continue;
      const s = p.ovr * posFit(p.pos, slots[i][0]);
      if (s > bestScore) { bestScore = s; best = p; }
    }
    if (best) { lineup[i] = best.id; used.add(best.id); }
  });
  const bench = (team.bench || []).filter((pid) => ok(pid) && !used.has(pid));
  const rest = squad.filter((p) => isAvailable(p) && !used.has(p.id) && !bench.includes(p.id)).sort((a, b) => b.ovr - a.ovr);
  if (!bench.some((pid) => state.players[pid].pos === 'GK')) {
    const gk = rest.find((p) => p.pos === 'GK');
    if (gk) bench.unshift(gk.id);
  }
  for (const p of rest) {
    if (bench.length >= 9) break;
    if (!bench.includes(p.id)) bench.push(p.id);
  }
  return { lineup, bench: bench.slice(0, 9) };
}

export function squadOf(state, teamId) {
  const team = state.teams[teamId];
  return team ? team.squad.map((id) => state.players[id]).filter(Boolean) : [];
}

// Yapay zekâ teknik direktörünün maç öncesi oyun anlayışı: rakibe ve sahaya göre.
function aiMentality(state, teamId, oppId, home, neutral) {
  const diff = teamRating(squadOf(state, teamId)) - teamRating(squadOf(state, oppId)) + (neutral ? 0 : home ? 1.5 : -1.5);
  if (diff <= -5) return 'defensive';
  if (diff >= 5) return 'attacking';
  return 'balanced';
}

export class Match {
  constructor(state, fixture, opts = {}) {
    this.state = state;
    this.P = state.players;
    this.fx = fixture;
    this.userSide = fixture.home === state.userTeamId ? 0 : fixture.away === state.userTeamId ? 1 : -1;
    this.autoUser = opts.autoUser ?? true;
    this.suspendedBefore = [fixture.home, fixture.away]
      .flatMap((t) => state.teams[t].squad)
      .filter((id) => this.P[id] && this.P[id].susp > 0);
    this.neutral = !!fixture.neutral;
    this.ko = !!fixture.ko;
    this.agg = null;
    if (fixture.leg === 2 && fixture.tie && state.ties?.[fixture.tie]) {
      const l1 = state.fixtures.find((f) => f.id === state.ties[fixture.tie].legs[0]);
      this.agg = l1 && l1.played ? [l1.ag, l1.hg] : [0, 0];
    }
    this.sides = [this.buildSide(fixture.home, true), this.buildSide(fixture.away, false)];
    this.sides.forEach((side, i) => {
      side.baseMentality = side.mentality;
      if (!side.human) side.mentality = side.baseMentality = aiMentality(state, side.teamId, this.sides[1 - i].teamId, i === 0, this.neutral);
    });
    this.minute = 0;
    this.half = 1;
    this.added = [randInt(1, 4), randInt(2, 7)];
    this.score = [0, 0];
    this.pens = null;
    this.events = [];
    this.stats = [emptyStats(), emptyStats()];
    this.finished = false;
    this.rt = {};
    this.played = {};
    this.tally = {};
    this.fresh = [];
    this.sides.forEach((side, i) => {
      for (const o of side.onPitch) this.enter(o.pid, i, 0, true);
    });
  }

  buildSide(teamId, home) {
    const team = this.state.teams[teamId];
    const { lineup, bench } = prepareLineup(this.state, teamId);
    const slots = FORMATIONS[team.formation];
    const onPitch = [];
    lineup.forEach((pid, i) => {
      if (pid) onPitch.push({ pid, slot: slots[i][0], injured: false });
    });
    return {
      teamId,
      name: team.name,
      home,
      human: isHuman(this.state, teamId),
      onPitch,
      bench: bench.slice(),
      used: new Set(),
      subsLeft: 5,
      mentality: team.mentality || 'balanced',
      norm: formationNorm(team.formation),
      manual: false,
    };
  }

  enter(pid, sideIdx, minute, starter) {
    this.played[pid] = { side: sideIdx, start: minute, end: null, starter };
    this.rt[pid] = 6.2;
    this.tally[pid] = { g: 0, a: 0, y: 0, r: 0 };
  }

  clock() {
    if (this.half === 1 && this.minute > 45) return `45+${this.minute - 45}`;
    if (this.half === 2 && this.minute > 90) return `90+${this.minute - 90}`;
    if (this.half === 3 && this.minute > 105) return `105+${this.minute - 105}`;
    if (this.half === 4 && this.minute > 120) return `120+${this.minute - 120}`;
    return String(this.minute);
  }

  log(side, type, text, extra = {}) {
    const ev = { t: this.clock(), side, type, text, ...extra };
    this.events.push(ev);
    this.fresh.push(ev);
    return ev;
  }

  strength(i) {
    const side = this.sides[i];
    const m = MENTALITIES[side.mentality];
    let att = 0;
    let mid = 0;
    let def = 0;
    let gk = 25;
    for (const o of side.onPitch) {
      const p = this.P[o.pid];
      const e = playerEff(p, o.slot) * (o.injured ? 0.6 : 1);
      if (o.slot === 'GK') {
        gk = e;
        continue;
      }
      const w = LINE_W[o.slot];
      att += e * w[0];
      mid += e * w[1];
      def += e * w[2];
    }
    const h = side.home && !this.neutral ? HOME_EDGE : 1;
    return {
      att: (att / side.norm.att) * m.att * h,
      mid: (mid / side.norm.mid) * h,
      def: (def / side.norm.def) * m.def * h,
      gk,
    };
  }

  // Skor durumu: önde olan takım oyunu yönetir, geride kalan baskıyı artırır.
  gameState(i) {
    const lead = this.goalsFor(i) - this.goalsFor(1 - i);
    const late = this.minuteAbs() >= 60;
    if (lead >= 3) return 0.62;
    if (lead === 2) return 0.8;
    if (lead === 1) return late ? 0.9 : 0.97;
    if (lead <= -2) return late ? 1.08 : 1.04;
    if (lead === -1) return late ? 1.14 : 1.05;
    return 1;
  }

  // Çift maçlı eşleşmelerin rövanşında toplam skor dikkate alınır.
  goalsFor(i) {
    return this.score[i] + (this.agg ? this.agg[i] : 0);
  }

  adaptAi(i) {
    const side = this.sides[i];
    if (side.human || side.manual) return;
    const lead = this.goalsFor(i) - this.goalsFor(1 - i);
    const min = this.minuteAbs();
    let ment = side.baseMentality;
    if (min >= 60 && lead < 0) ment = 'attacking';
    else if (min >= 75 && lead === 1) ment = 'defensive';
    else if (lead >= 2) ment = 'balanced';
    side.mentality = ment;
  }

  // Bir dakika oynatır ve bu dakikada oluşan olayları döndürür.
  step() {
    this.fresh = [];
    if (this.finished) return this.fresh;
    if (this.half === 5) {
      this.shootout();
      return this.fresh;
    }
    this.minute++;
    if (this.minute === 1) this.log(-1, 'info', 'Hakemin düdüğüyle maç başladı!');
    if (this.minute % 5 === 0) { this.adaptAi(0); this.adaptAi(1); }

    const s = [this.strength(0), this.strength(1)];
    const m0 = s[0].mid ** 1.5;
    const m1 = s[1].mid ** 1.5;
    const a = rand() < m0 / (m0 + m1) ? 0 : 1;
    const d = 1 - a;
    this.stats[a].poss++;

    const ratio = s[a].att / Math.max(1, s[d].def);
    const pShot = clamp(0.242 * ratio ** 1.05 * this.gameState(a), 0.05, 0.42);
    if (rand() < pShot) this.shot(a, s[a], s[d]);
    else if (chance(0.05)) this.log(-1, 'filler', pick(FILLER));

    if (chance(0.29)) this.foul(chance(0.62) ? d : a);

    const etF = this.half >= 3 ? 1.25 : 1;
    for (let i = 0; i < 2; i++) {
      for (const o of this.sides[i].onPitch) {
        const p = this.P[o.pid];
        if (!o.injured && chance(0.00011 * (p.condition < 60 ? 1.8 : 1) * (p.age > 31 ? 1.3 : 1))) {
          o.injured = true;
          this.rt[o.pid] -= 0.2;
          this.log(i, 'injury', `🚑 ${p.name} sakatlandı ve yerde kaldı.`, { pid: o.pid });
        }
        const drain = o.slot === 'GK' ? 0.1 : (0.34 + (p.age > 30 ? 0.06 : 0)) * etF;
        p.condition = Math.max(20, p.condition - drain * (this.sides[i].mentality === 'attacking' ? 1.1 : 1));
      }
      this.handleSubs(i);
    }

    if (this.half === 1 && this.minute >= 45 + this.added[0]) {
      this.log(-1, 'half', `İlk yarı sona erdi: ${this.sides[0].name} ${this.score[0]} - ${this.score[1]} ${this.sides[1].name}`);
      this.half = 2;
      this.minute = 45;
      for (const side of this.sides) for (const o of side.onPitch) this.P[o.pid].condition = Math.min(100, this.P[o.pid].condition + 4);
    } else if (this.half === 2 && this.minute >= 90 + this.added[1]) {
      if (this.needsWinner()) {
        this.log(-1, 'half', `Normal süre ${this.score[0]} - ${this.score[1]} bitti${this.agg ? ` (toplam ${this.goalsFor(0)}-${this.goalsFor(1)})` : ''}. Maç uzatmaya gidiyor!`);
        this.half = 3;
        this.minute = 90;
        for (const side of this.sides) { side.subsLeft += 1; for (const o of side.onPitch) this.P[o.pid].condition = Math.min(100, this.P[o.pid].condition + 3); }
      } else this.end();
    } else if (this.half === 3 && this.minute >= 105 + (this.added[2] ??= randInt(0, 2))) {
      this.log(-1, 'half', `Uzatmanın ilk yarısı bitti: ${this.score[0]} - ${this.score[1]}`);
      this.half = 4;
      this.minute = 105;
    } else if (this.half === 4 && this.minute >= 120 + (this.added[3] ??= randInt(0, 3))) {
      if (this.needsWinner()) {
        this.log(-1, 'half', 'Uzatmalarda da eşitlik bozulmadı. Kazananı penaltılar belirleyecek!');
        this.half = 5;
        this.pens = { score: [0, 0], kicks: [[], []], order: [this.shooters(0), this.shooters(1)], turn: 0 };
      } else this.end();
    }
    return this.fresh;
  }

  needsWinner() {
    if (!this.ko) return false;
    return this.goalsFor(0) === this.goalsFor(1);
  }

  end() {
    this.finished = true;
    const extra = this.pens ? ` (penaltılar ${this.pens.score[0]}-${this.pens.score[1]})` : this.agg ? ` · toplam ${this.goalsFor(0)}-${this.goalsFor(1)}` : '';
    this.log(-1, 'end', `Maç sona erdi: ${this.sides[0].name} ${this.score[0]} - ${this.score[1]} ${this.sides[1].name}${extra}`);
  }

  shooters(i) {
    return this.sides[i].onPitch
      .map((o) => this.P[o.pid])
      .sort((a, b) => (a.pos === 'GK') - (b.pos === 'GK') || b.ovr - a.ovr)
      .map((p) => p.id);
  }

  // Penaltı atışları: her çağrıda bir atış.
  shootout() {
    const P = this.pens;
    const i = P.turn % 2;
    const n = Math.floor(P.turn / 2);
    const order = P.order[i];
    const pid = order[n % order.length];
    const shooter = this.P[pid];
    const gkO = this.sides[1 - i].onPitch.find((o) => o.slot === 'GK');
    const gk = gkO ? this.P[gkO.pid] : null;
    const pGoal = clamp(0.76 + (shooter.ovr - (gk ? gk.ovr : 60)) * 0.004, 0.62, 0.88);
    const goal = rand() < pGoal;
    P.kicks[i].push(goal ? 1 : 0);
    if (goal) P.score[i]++;
    this.log(i, goal ? 'pen-goal' : 'pen-miss', goal ? `✅ ${shooter.name} penaltıyı gole çevirdi. (${P.score[0]}-${P.score[1]})` : `❌ ${shooter.name} penaltıyı kaçırdı${gk && chance(0.6) ? `, ${gk.name} kurtardı` : ''}! (${P.score[0]}-${P.score[1]})`, { pid });
    P.turn++;
    const [k0, k1] = [P.kicks[0].length, P.kicks[1].length];
    let done = false;
    if (k0 <= 5 && k1 <= 5) {
      const left0 = 5 - k0;
      const left1 = 5 - k1;
      if (P.score[0] + left0 < P.score[1] || P.score[1] + left1 < P.score[0]) done = true;
      if (k0 === 5 && k1 === 5 && P.score[0] !== P.score[1]) done = true;
    } else if (k0 === k1 && P.score[0] !== P.score[1]) done = true;
    if (done) this.end();
  }

  shot(a, A, D) {
    const side = this.sides[a];
    const opp = this.sides[1 - a];
    const outfield = side.onPitch.filter((o) => o.slot !== 'GK');
    if (!outfield.length) return;
    const sh = weightedPick(outfield, (o) => SHOT_W[o.slot] * (this.P[o.pid].ovr / 70) ** 3);
    const shooter = this.P[sh.pid];
    const gkO = opp.onPitch.find((o) => o.slot === 'GK');
    const gkName = gkO ? this.P[gkO.pid].name : 'boş kale';
    this.stats[a].shots++;

    let xg = 0.02 + rand() ** 2.5 * 0.32;
    xg *= clamp((A.att / Math.max(1, D.def)) ** 0.32, 0.8, 1.22);
    this.stats[a].xg += xg;
    const skill = playerEff(shooter, sh.slot) / Math.max(25, D.gk);
    const pGoal = clamp(xg * skill, 0.01, 0.8);
    const r = rand();

    if (r < pGoal) {
      this.score[a]++;
      this.stats[a].onT++;
      this.tally[sh.pid].g++;
      this.rt[sh.pid] += 1.0;
      let assist = null;
      const mates = outfield.filter((o) => o.pid !== sh.pid);
      if (mates.length && chance(0.72)) {
        assist = weightedPick(mates, (o) => ASSIST_W[o.slot] * (this.P[o.pid].ovr / 70) ** 2);
        this.tally[assist.pid].a++;
        this.rt[assist.pid] += 0.6;
      }
      for (const o of opp.onPitch) if (DEF_SLOTS.has(o.slot)) this.rt[o.pid] -= 0.22;
      const pen = chance(0.08);
      let text = pen
        ? `Penaltı! ${shooter.name} topu ve kaleciyi ayrı köşelere gönderdi.`
        : pick(GOAL_TEXT)(shooter.name);
      if (assist && !pen) text += ` Asist: ${this.P[assist.pid].name}.`;
      this.log(a, 'goal', `⚽ GOL! ${side.name} ${this.score[0]}-${this.score[1]}. ${text}`, {
        pid: sh.pid,
        aid: assist && !pen ? assist.pid : null,
        pen,
      });
    } else if (r < pGoal + 0.28) {
      this.stats[a].onT++;
      if (gkO) this.rt[gkO.pid] += 0.13;
      this.rt[sh.pid] += 0.03;
      if (chance(0.45)) this.log(a, 'save', pick(SAVE_TEXT)(shooter.name, gkName), { pid: sh.pid });
    } else {
      this.rt[sh.pid] -= 0.04;
      if (chance(0.3)) this.stats[a].corners++;
      if (chance(0.35)) this.log(a, 'miss', pick(MISS_TEXT)(shooter.name), { pid: sh.pid });
    }
  }

  foul(i) {
    const side = this.sides[i];
    if (!side.onPitch.length) return;
    this.stats[i].fouls++;
    const o = weightedPick(side.onPitch, (x) => FOUL_W[x.slot]);
    const p = this.P[o.pid];
    const t = this.tally[o.pid];
    if (chance(0.0022)) {
      t.r = 2;
      this.stats[i].red++;
      this.rt[o.pid] -= 1.6;
      this.log(i, 'red', `🟥 ${p.name} direkt kırmızı kart gördü! ${side.name} 10 kişi kaldı.`, { pid: o.pid });
      this.sendOff(i, o);
    } else if (chance(t.y >= 1 ? 0.045 : 0.15)) {
      if (t.y >= 1) {
        t.y = 2;
        t.r = 1;
        this.stats[i].red++;
        this.rt[o.pid] -= 1.3;
        this.log(i, 'red', `🟨🟥 ${p.name} ikinci sarı karttan oyun dışında kaldı!`, { pid: o.pid });
        this.sendOff(i, o);
      } else {
        t.y = 1;
        this.stats[i].yel++;
        this.rt[o.pid] -= 0.3;
        this.log(i, 'yellow', `🟨 ${p.name} sert müdahalesi sonrası sarı kart gördü.`, { pid: o.pid });
      }
    }
  }

  sendOff(i, o) {
    const side = this.sides[i];
    side.onPitch = side.onPitch.filter((x) => x !== o);
    this.played[o.pid].end = this.minuteAbs();
    side.used.add(o.pid);
    if (o.slot === 'GK') {
      const gk = side.bench.map((id) => this.P[id]).find((p) => p && p.pos === 'GK');
      const outfield = side.onPitch.filter((x) => x.slot !== 'GK');
      if (gk && side.subsLeft > 0 && outfield.length) {
        const weakest = outfield.reduce((w, x) => (playerEff(this.P[x.pid], x.slot) < playerEff(this.P[w.pid], w.slot) ? x : w));
        this.substitute(i, weakest.pid, gk.id, 'GK');
      } else if (outfield.length) {
        outfield[outfield.length - 1].slot = 'GK';
      }
    }
  }

  minuteAbs() {
    const cap = [0, 45, 90, 105, 120, 120][this.half] ?? 120;
    return Math.min(this.minute, cap);
  }

  bestBench(side, slot) {
    let best = null;
    let bestE = -1;
    for (const id of side.bench) {
      if (side.used.has(id)) continue;
      const p = this.P[id];
      if (!p || (slot === 'GK') !== (p.pos === 'GK')) continue;
      const e = playerEff(p, slot);
      if (e > bestE) { bestE = e; best = p; }
    }
    return best;
  }

  handleSubs(i) {
    const side = this.sides[i];
    if (side.subsLeft <= 0) return;
    const inj = side.onPitch.find((o) => o.injured);
    if (inj) {
      const rep = this.bestBench(side, inj.slot);
      if (rep) this.substitute(i, inj.pid, rep.id);
      return;
    }
    if (i === this.userSide && !this.autoUser) return;
    if (side.manual) return;
    if (this.half < 2 || this.minute < 58 || !chance(0.09)) return;
    const lead = this.goalsFor(i) - this.goalsFor(1 - i);
    // Geride olan yapay zekâ takımı 70. dakikadan sonra hücumcu oyuncu sokar.
    if (!side.human && lead < 0 && this.minuteAbs() >= 70) {
      const weakDef = side.onPitch
        .filter((o) => ['DM', 'CB', 'RB', 'LB'].includes(o.slot))
        .sort((x, y) => playerEff(this.P[x.pid], x.slot) - playerEff(this.P[y.pid], y.slot))[0];
      const att = side.bench.filter((id) => !side.used.has(id)).map((id) => this.P[id]).filter((p) => p && ['ST', 'AM', 'RW', 'LW'].includes(p.pos)).sort((a, b) => b.ovr - a.ovr)[0];
      if (weakDef && att && side.onPitch.filter((o) => DEF_SLOTS.has(o.slot)).length > 3 && chance(0.5)) {
        this.substitute(i, weakDef.pid, att.id, weakDef.slot === 'DM' ? 'AM' : null);
        return;
      }
    }
    const tired = side.onPitch
      .filter((o) => o.slot !== 'GK' && this.P[o.pid].condition < 72)
      .sort((x, y) => this.P[x.pid].condition - this.P[y.pid].condition)[0];
    if (!tired) return;
    const rep = this.bestBench(side, tired.slot);
    if (rep && playerEff(rep, tired.slot) >= playerEff(this.P[tired.pid], tired.slot) * 0.92) {
      this.substitute(i, tired.pid, rep.id);
    }
  }

  // Oyuncu değişikliği. Başarılıysa true döner.
  substitute(i, outPid, inPid, forceSlot = null) {
    if (this.fresh === undefined) this.fresh = [];
    const side = this.sides[i];
    const o = side.onPitch.find((x) => x.pid === outPid);
    if (!o || side.subsLeft <= 0 || side.used.has(inPid) || !side.bench.includes(inPid) || this.half === 5) return false;
    const inP = this.P[inPid];
    const outP = this.P[outPid];
    side.subsLeft--;
    side.used.add(outPid);
    side.bench = side.bench.filter((id) => id !== inPid);
    this.played[outPid].end = this.minuteAbs();
    const slot = forceSlot || o.slot;
    const idx = side.onPitch.indexOf(o);
    side.onPitch[idx] = { pid: inPid, slot, injured: false };
    this.enter(inPid, i, this.minuteAbs(), false);
    this.log(i, 'sub', `🔄 ${side.name}: ${inP.name} oyuna girdi, ${outP.name} çıktı.`, { pid: inPid, out: outPid });
    return true;
  }

  setMentality(i, mentality) {
    this.sides[i].mentality = mentality;
  }

  // Canlı maç yarıda kalırsa kaldığı dakikadan sürdürülebilmesi için düz nesneye çevirir.
  snapshot() {
    return {
      fxId: this.fx.id,
      userSide: this.userSide,
      autoUser: this.autoUser,
      suspendedBefore: this.suspendedBefore,
      sides: this.sides.map((s) => ({ ...s, used: [...s.used] })),
      minute: this.minute,
      half: this.half,
      added: this.added,
      score: this.score,
      pens: this.pens,
      agg: this.agg,
      neutral: this.neutral,
      ko: this.ko,
      events: this.events,
      stats: this.stats,
      finished: this.finished,
      rt: this.rt,
      played: this.played,
      tally: this.tally,
    };
  }

  static restore(state, snap) {
    const fx = state.fixtures.find((f) => f.id === snap.fxId);
    if (!fx || fx.played) return null;
    const m = Object.create(Match.prototype);
    Object.assign(m, JSON.parse(JSON.stringify(snap)));
    m.state = state;
    m.P = state.players;
    m.fx = fx;
    m.fresh = [];
    m.sides.forEach((s) => { s.used = new Set(s.used); });
    return m;
  }

  playToEnd() {
    while (!this.finished) this.step();
  }

  // Maç sonucunu oyun durumuna işler.
  apply() {
    const fx = this.fx;
    const [hs, as] = this.score;
    fx.played = true;
    fx.hg = hs;
    fx.ag = as;
    if (this.half >= 3) fx.et = true;
    if (this.pens) fx.pens = this.pens.score.slice();
    fx.stats = {
      poss: [0, 1].map((i) => Math.round((this.stats[i].poss / Math.max(1, this.stats[0].poss + this.stats[1].poss)) * 100)),
      shots: this.stats.map((s) => s.shots),
      onT: this.stats.map((s) => s.onT),
      xg: this.stats.map((s) => Math.round(s.xg * 100) / 100),
      corners: this.stats.map((s) => s.corners),
      fouls: this.stats.map((s) => s.fouls),
    };
    fx.events = this.events
      .filter((e) => ['goal', 'red', 'injury'].includes(e.type))
      .map((e) => ({ t: e.t, side: e.side, type: e.type, pid: e.pid, aid: e.aid || null, pen: !!e.pen }));

    const endMin = this.half >= 3 ? 120 : 90;
    const league = ['SL', 'TR1', 'TR2'].includes(fx.comp || 'SL');
    let motm = null;
    let motmR = 0;
    fx.ratings = {};
    const suspended = [];
    const injuredNow = new Set();
    for (const side of this.sides) for (const o of side.onPitch) if (o.injured) injuredNow.add(o.pid);
    for (const e of this.events) if (e.type === 'injury') injuredNow.add(e.pid);

    for (const [pid, pl] of Object.entries(this.played)) {
      const p = this.P[pid];
      if (!p) continue;
      const t = this.tally[pid];
      const mine = pl.side === 0 ? hs : as;
      const theirs = pl.side === 0 ? as : hs;
      const res = mine > theirs ? 1 : mine === theirs ? 0 : -1;
      const mins = Math.max(1, (pl.end ?? endMin) - pl.start);
      const slotDef = DEF_SLOTS.has(p.pos);

      let r = this.rt[pid] + res * 0.3 + (p.ovr - 70) / 40 + normal(0, 0.3);
      let cs = 0;
      if (slotDef && theirs === 0 && mins >= 60) {
        r += 0.5;
        cs = 1;
        p.stats.cs++;
      }
      if (mins < 20) r = 6 + (r - 6) * 0.5;
      r = clamp(Math.round(r * 10) / 10, 3, 10);
      fx.ratings[pid] = r;
      if (r > motmR) { motmR = r; motm = pid; }

      p.stats.apps++;
      if (pl.starter) p.stats.starts++;
      p.stats.mins += mins;
      p.weekMins = (p.weekMins || 0) + mins;
      p.stats.goals += t.g;
      p.stats.assists += t.a;
      p.stats.rSum += r;
      p.stats.rN++;
      // Organizasyon bazında: [maç, gol, asist, puan toplamı, gol yemeden]
      const cstat = ((p.stats.c ||= {})[fx.comp || 'SL'] ||= [0, 0, 0, 0, 0]);
      cstat[0]++; cstat[1] += t.g; cstat[2] += t.a; cstat[3] += r; cstat[4] += cs;
      if (t.y >= 1 && t.r !== 1) {
        p.stats.yel++;
        if (league) {
          p.yellows++;
          if (p.yellows % 4 === 0) {
            p.susp += 1;
            suspended.push({ pid, reason: 'yellow', games: 1 });
          }
        }
      }
      if (t.r) {
        p.stats.red++;
        const games = t.r === 2 ? randInt(2, 3) : 1;
        p.susp += games;
        suspended.push({ pid, reason: 'red', games });
      }
      p.morale = clamp(p.morale + res * 4 + (r >= 7.5 ? 2 : r < 5.5 ? -2 : 0), 0, 100);
      if (injuredNow.has(pid)) p.injury = randomInjury(true);
    }
    fx.motm = motm;

    for (const id of this.suspendedBefore) {
      const p = this.P[id];
      if (p) p.susp = Math.max(0, p.susp - 1);
    }

    [fx.home, fx.away].forEach((tid, i) => {
      const team = this.state.teams[tid];
      const mine = this.score[i];
      const theirs = this.score[1 - i];
      team.form = [...(team.form || []), mine > theirs ? 'G' : mine === theirs ? 'B' : 'M'].slice(-5);
      const benchIds = this.sides[i].bench;
      for (const id of team.squad) {
        if (!this.played[id] && !benchIds.includes(id) && this.P[id]) {
          this.P[id].morale = clamp(this.P[id].morale - 0.5, 0, 100);
        }
      }
    });
    return { injured: [...injuredNow], suspended, motm };
  }
}

export function simulateMatch(state, fixture) {
  const m = new Match(state, fixture, { autoUser: true });
  m.playToEnd();
  return m.apply();
}
