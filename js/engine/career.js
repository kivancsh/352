// Kariyeri canlı tutan her şey: taraftar memnuniyeti, basın toplantıları, oyuncuyla birebir görüşmeler,
// haftanın takımı, ayın oyuncusu/teknik direktörü, kupa dolabı, başarımlar, takip listesi ve iş teklifleri.
import { chance, pick, clamp, addDays, weekday, fmtMoney, daysBetween } from './util.js';
import { addMessage, addNews, isHuman, humansOf } from './inbox.js';
import { teamRating } from './tactics.js';
import { COMPS, UEFA, TR_LEAGUES, standings } from './comps.js';

const BIG3 = ['gs', 'fb', 'bjk'];

export const careerKey = (state, tid) => (state.mp ? tid : 'me');
export function careerOf(state, tid) {
  state.career ||= {};
  return state.career[careerKey(state, tid)] || null;
}

export function initCareer(state, tid) {
  state.career ||= {};
  state.fans ||= {};
  state.shortlist ||= {};
  state.press ||= {};
  const k = careerKey(state, tid);
  if (!state.career[k]) {
    state.career[k] = {
      since: state.season, teams: [], matches: { w: 0, d: 0, l: 0, gf: 0, ga: 0 }, streak: 0, bestStreak: 0,
      trophies: [], seasons: [], awards: [], achv: {}, sackings: 0,
    };
  }
  const c = state.career[k];
  if (!c.teams.includes(tid)) c.teams.push(tid);
  if (state.fans[tid] == null) state.fans[tid] = 60;
  state.shortlist[tid] ||= [];
}

export const fansOf = (state, tid) => state.fans?.[tid] ?? 60;
function addFans(state, tid, v) {
  state.fans[tid] = clamp((state.fans[tid] ?? 60) + v, 0, 100);
}
export function fansLabel(v) {
  if (v >= 85) return 'Coşkulu';
  if (v >= 70) return 'Memnun';
  if (v >= 50) return 'Beklemede';
  if (v >= 30) return 'Huzursuz';
  return 'Tepkili';
}

// ===== PROGRESSION TIERS (YENİ) =====
export const PROGRESSION_TIERS = {
  beginner: {
    name: 'Başlangıç Ligi',
    seasons: [1, 2, 3],
    opponentDifficulty: 'easy',
    teamPowerRange: [62, 68],
    estimatedWinRate: 0.50,
    description: 'Oyunu öğren, baskı yok',
    badge: '🟢'
  },
  
  intermediate: {
    name: 'Orta Seviye Lig',
    seasons: [4, 5, 6],
    opponentDifficulty: 'normal',
    teamPowerRange: [65, 72],
    estimatedWinRate: 0.45,
    description: 'Rekabetçi oynama, karışık rakipler',
    badge: '🟡'
  },
  
  advanced: {
    name: 'İleri Seviye Lig',
    seasons: [7, 8, 9, 10],
    opponentDifficulty: 'hard',
    teamPowerRange: [68, 76],
    estimatedWinRate: 0.35,
    description: 'Uzman oynama, rekabetçi meta',
    badge: '🟠'
  },
  
  competitive: {
    name: 'Rekabetçi Lig',
    seasons: [11],
    opponentDifficulty: 'hard',
    teamPowerRange: [70, 78],
    estimatedWinRate: 0.30,
    description: 'Elite rekabetin',
    badge: '🔴'
  }
};

export function getProgressionTier(currentSeason) {
  if (!currentSeason || currentSeason < 1) return PROGRESSION_TIERS.beginner;
  
  for (const [key, tier] of Object.entries(PROGRESSION_TIERS)) {
    if (tier.seasons.includes(currentSeason)) {
      return tier;
    }
  }
  return PROGRESSION_TIERS.competitive;
}

export function getOpponentDifficulty(currentSeason) {
  const tier = getProgressionTier(currentSeason);
  return tier.opponentDifficulty;
}

export function getTierBadge(currentSeason) {
  const tier = getProgressionTier(currentSeason);
  return tier.badge;
}

export function getEstimatedWinRate(currentSeason) {
  const tier = getProgressionTier(currentSeason);
  return tier.estimatedWinRate;
}

// ===== STAR PLAYER IMPACT SYSTEM (YENİ) =====
export const STAR_PLAYER_IMPACT = {
  singleStar92Plus: {
    bonus: 0.10,
    maxPowerBoost: 3.5,
    description: '92+ rated oyuncu'
  },
  
  twoStars90Plus: {
    bonus: 0.08,
    maxPowerBoost: 5.0,
    description: 'İki 90+ rated oyuncu'
  },
  
  threeStars88Plus: {
    bonus: 0.06,
    maxPowerBoost: 6.0,
    description: 'Üç 88+ rated oyuncu'
  }
};

export function calculateStarBonus(squad) {
  if (!squad || !squad.players) return 0;
  
  let totalBonus = 0;
  
  const stars92 = squad.players.filter(p => p.rating >= 92).length;
  const stars90 = squad.players.filter(p => p.rating >= 90 && p.rating < 92).length;
  const stars88 = squad.players.filter(p => p.rating >= 88 && p.rating < 90).length;
  
  if (stars92 > 0) {
    totalBonus = Math.min(
      STAR_PLAYER_IMPACT.singleStar92Plus.bonus,
      STAR_PLAYER_IMPACT.singleStar92Plus.maxPowerBoost / 100
    );
  }
  
  if (stars90 >= 2 && totalBonus < STAR_PLAYER_IMPACT.twoStars90Plus.bonus) {
    totalBonus = STAR_PLAYER_IMPACT.twoStars90Plus.bonus;
  }
  
  if (stars88 >= 3 && totalBonus < STAR_PLAYER_IMPACT.threeStars88Plus.bonus) {
    totalBonus = STAR_PLAYER_IMPACT.threeStars88Plus.bonus;
  }
  
  return totalBonus;
}

export function getStarPlayerDescription(squad) {
  if (!squad || !squad.players) return 'Yıldız oyuncu yok';
  
  const stars92 = squad.players.filter(p => p.rating >= 92);
  const stars90 = squad.players.filter(p => p.rating >= 90 && p.rating < 92);
  const stars88 = squad.players.filter(p => p.rating >= 88 && p.rating < 90);
  
  const descriptions = [];
  
  if (stars92.length > 0) {
    descriptions.push(`${stars92.length} dünya çapında oyuncu(lar) (92+)`);
  }
  if (stars90.length > 0) {
    descriptions.push(`${stars90.length} elit oyuncu(lar) (90-91)`);
  }
  if (stars88.length > 0) {
    descriptions.push(`${stars88.length} mükemmel oyuncu(lar) (88-89)`);
  }
  
  return descriptions.length > 0 ? descriptions.join(', ') : 'Dengeli kadro';
}

// ===== DEVELOPMENT ARC (YENİ) =====
export function getSeasonalDevelopment(season, currentPower) {
  const developmentBonus = Math.max(0, Math.min(2, season / 10));
  const ageDecay = season > 8 ? -0.5 * (season - 8) : 0;
  return currentPower + developmentBonus + ageDecay;
}

export function getYouthPlayerBonus(playerAge, playerPotential) {
  if (playerAge < 24 && playerPotential > 80) {
    const potentialGap = playerPotential - 75;
    return Math.min(potentialGap / 20, 0.08);
  }
  return 0;
}

// ===== CAREER MILESTONES (MEVCUT) =====
export const ACHIEVEMENTS = [
  { id: 'first_win', icon: '✅', title: 'İlk galibiyet', desc: 'Kariyerindeki ilk resmi maçı kazan.' },
  { id: 'derby', icon: '🔥', title: 'Derbi zaferi', desc: 'Büyük bir İstanbul derbisini ya da Trabzonspor maçını kazan.' },
  { id: 'rout', icon: '💥', title: 'Farklı galibiyet', desc: 'Bir maçı en az 4 farkla kazan.' },
  { id: 'unbeaten10', icon: '🛡️', title: 'Yenilmez', desc: 'Üst üste 10 maç yenilme.' },
  { id: 'europe_win', icon: '🌍', title: 'Avrupa gecesi', desc: 'Bir UEFA maçı kazan.' },
  { id: 'giant', icon: '🗡️', title: 'Dev avcısı', desc: 'Avrupa\'nın dev bir kulübünü (itibar 88+) yen.' },
  { id: 'r16', icon: '🎟️', title: 'Avrupa\'da son 16', desc: 'Bir UEFA kupasında son 16\'ya kal.' },
  { id: 'euro_final', icon: '🏟️', title: 'Avrupa finali', desc: 'Bir UEFA kupasında finale çık.' },
  { id: 'euro_title', icon: '🏆', title: 'Avrupa fatihi', desc: 'Bir UEFA kupası kazan.' },
  { id: 'league_title', icon: '🥇', title: 'Şampiyon', desc: 'Süper Lig şampiyonluğu kazan.' },
  { id: 'cup_title', icon: '🏅', title: 'Kupa sahibi', desc: 'Ziraat Türkiye Kupası\'nı kazan.' },
  { id: 'double', icon: '👑', title: 'Double', desc: 'Aynı sezonda lig ve kupayı kazan.' },
  { id: 'promotion', icon: '🔼', title: 'Yükseliş', desc: 'Takımını bir üst lige çıkar.' },
  { id: 'buy_big', icon: '💰', title: 'Yıldız transferi', desc: 'Tek oyuncuya en az €15 M bonservis öde.' },
  { id: 'sell_big', icon: '📈', title: 'Rekor satış', desc: 'Bir oyuncuyu en az €20 M\'ye sat.' },
  { id: 'rich', icon: '🏦', title: 'Kasa dolu', desc: 'Kulübün kasasında €50 M biriktir.' },
  { id: 'fans', icon: '📣', title: 'Tribünlerin sevgilisi', desc: 'Taraftar memnuniyetini %90\'a çıkar.' },
  { id: 'award', icon: '⭐', title: 'Ayın teknik direktörü', desc: 'Ayın teknik direktörü ödülünü kazan.' },
  { id: 'matches100', icon: '💯', title: '100 maç', desc: 'Kariyerinde 100 resmi maça çık.' },
  { id: 'seasons3', icon: '📅', title: 'Sadakat', desc: 'Aynı kulüpte 3 sezonu tamamla.' },
];

function unlock(state, tid, id) {
  const c = careerOf(state, tid);
  if (!c || c.achv[id]) return;
  const a = ACHIEVEMENTS.find((x) => x.id === id);
  if (!a) return;
  c.achv[id] = state.date;
  addMessage(state, { teamId: tid, title: `${a.icon} Başarım açıldı: ${a.title}`, body: `${a.desc} Tüm başarımlarını kulüp ekranındaki Kariyer bölümünde görebilirsin.`, kind: 'achv', quiet: true });
}

// ===== MEVCUT FONKSİYONLAR DEVAM EDİYOR =====

export function isDerby(state, f) {
  const a = f.home;
  const b = f.away;
  return (BIG3.includes(a) && BIG3.includes(b)) || (a === 'ts' && BIG3.includes(b)) || (b === 'ts' && BIG3.includes(a));
}

export function careerAfterMatch(state, f) {
  for (const [tid, i] of [[f.home, 0], [f.away, 1]]) {
    if (!isHuman(state, tid)) continue;
    const c = careerOf(state, tid);
    if (!c) continue;
    const my = i === 0 ? f.hg : f.ag;
    const their = i === 0 ? f.ag : f.hg;
    const oppId = i === 0 ? f.away : f.home;
    const opp = state.teams[oppId];
    let res = my > their ? 1 : my === their ? 0 : -1;
    if (res === 0 && f.pens) res = (i === 0 ? f.pens[0] > f.pens[1] : f.pens[1] > f.pens[0]) ? 1 : -1;
    c.matches[res === 1 ? 'w' : res === 0 ? 'd' : 'l']++;
    c.matches.gf += my;
    c.matches.ga += their;
    c.streak = res >= 0 ? c.streak + 1 : 0;
    c.bestStreak = Math.max(c.bestStreak, c.streak);

    const derby = isDerby(state, f);
    const euro = UEFA.includes(f.comp);
    let dFans = res === 1 ? 2 : res === 0 ? 0 : -2.5;
    if (derby) dFans *= 2.2;
    if (euro) dFans *= 1.5;
    if (res === 1 && my - their >= 3) dFans += 1.5;
    const stance = state.press?.[tid]?.[f.id];
    if (stance === 'bold') {
      dFans += res === 1 ? 3 : res === -1 ? -5 : -1;
      if (res === -1) state.boards[tid].confidence = clamp(state.boards[tid].confidence - 3, 0, 100);
    }
    addFans(state, tid, dFans);

    if (res === 1) unlock(state, tid, 'first_win');
    if (res === 1 && derby) unlock(state, tid, 'derby');
    if (res === 1 && my - their >= 4) unlock(state, tid, 'rout');
    if (c.streak >= 10) unlock(state, tid, 'unbeaten10');
    if (euro && res === 1) unlock(state, tid, 'europe_win');
    if (euro && res === 1 && opp.rep >= 88) unlock(state, tid, 'giant');
    const total = c.matches.w + c.matches.d + c.matches.l;
    if (total >= 100) unlock(state, tid, 'matches100');
    if (fansOf(state, tid) >= 90) unlock(state, tid, 'fans');
    if (euro && ['R16', 'QF', 'SF', 'F'].includes(f.stage)) unlock(state, tid, 'r16');
    if (euro && f.stage === 'F') unlock(state, tid, 'euro_final');

    const me = state.teams[tid];
    const where = f.neutral ? '' : i === 0 ? ' iç sahada' : ' deplasmanda';
    const comp = COMPS[f.comp]?.short || '';
    if (derby || euro || f.stage === 'F' || Math.abs(my - their) >= 3) {
      const verb = res === 1 ? 'kazandı' : res === 0 ? 'berabere kaldı' : 'kaybetti';
      addNews(state, `${me.name},${where} ${opp.name} karşısında ${my}-${their}${f.pens ? ` (pen. ${i === 0 ? f.pens.join('-') : f.pens.slice().reverse().join('-')})` : ''} ${verb}. (${comp}${derby ? ', derbi' : ''})`, 'club', [tid, oppId]);
    }
  }
}

// ===== PRESS CONFERENCE (MEVCUT) =====
export function needsPress(state, tid, f) {
  if (!f || state.press?.[tid]?.[f.id] !== undefined) return false;
  return isDerby(state, f) || UEFA.includes(f.comp) || ['SF', 'F'].includes(f.stage);
}

function pressContext(state, tid, f) {
  const oppId = f.home === tid ? f.away : f.home;
  if (f.stage === 'F') return 'final';
  if (UEFA.includes(f.comp)) return 'europe';
  if (isDerby(state, f)) return 'derby';
  return 'cup';
}

export function pressConference(state, tid, f) {
  const oppId = f.home === tid ? f.away : f.home;
  const opp = state.teams[oppId];
  const ctx = pressContext(state, tid, f);
  const star = state.teams[tid].squad.map((id) => state.players[id]).filter(Boolean).sort((a, b) => b.ovr - a.ovr)[0];
  const q1 = {
    derby: `Yarın ${opp.name} derbisi var. Taraftarlarınıza ne söylemek istersiniz?`,
    europe: `${COMPS[f.comp].name}'nde ${opp.name} ile karşılaşıyorsunuz. Avrupa'daki hedefiniz nedir?`,
    final: `${COMPS[f.comp].short} finali öncesi üzerinizde baskı hissediyor musunuz?`,
    cup: `${COMPS[f.comp].short} ${f.stage === 'SF' ? 'yarı finali' : 'maçı'} öncesi takımın durumu nasıl?`,
  }[ctx];
  return {
    fid: f.id,
    title: ctx === 'derby' ? 'Derbi öncesi basın toplantısı' : ctx === 'europe' ? 'Avrupa gecesi öncesi basın toplantısı' : 'Maç öncesi basın toplantısı',
    questions: [
      {
        q: q1,
        a: [
          { id: 'bold', t: 'Bu maçı kazanmaya geliyoruz, sahada kim olduğumuzu göstereceğiz!', hint: 'Taraftar coşar; kaybederseniz tepki büyür.' },
          { id: 'respect', t: 'Rakibimize saygı duyuyoruz ama kendi oyunumuzu oynayacağız.', hint: 'Takım motive olur.' },
          { id: 'calm', t: 'Maç maç bakıyoruz, sadece bir sonraki maça odaklandık.', hint: 'Yönetim sakin tavrı sever.' },
        ],
      },
      {
        q: star ? `${star.name} son dönemde çok konuşuluyor. Onun hakkında ne düşünüyorsunuz?` : 'Kadronuzdaki yıldız oyuncular hakkında ne düşünüyorsunuz?',
        a: [
          { id: 'praise', t: 'Dünya çapında bir oyuncu, onunla çalışmak bir ayrıcalık.', hint: 'Oyuncunun morali yükselir.' },
          { id: 'team', t: 'Bizde bireyler değil takım konuşur.', hint: 'Takımın geneli motive olur.' },
          { id: 'demand', t: 'Ondan daha fazlasını bekliyorum.', hint: 'Oyuncu ya hırslanır ya da bozulur.' },
        ],
        pid: star?.id || null,
      },
      {
        q: 'Hakem kararları ve lig yönetimi hakkında bir yorumunuz var mı?',
        a: [
          { id: 'noc', t: 'Hakemler hakkında konuşmam, işimize bakıyoruz.', hint: 'Yönetim memnun kalır.' },
          { id: 'crit', t: 'Son haftalarda haksızlığa uğradık, bunu herkes gördü.', hint: 'Taraftar sever, yönetim tedirginleşir.' },
        ],
      },
    ],
  };
}

export function answerPress(state, tid, fid, answers = []) {
  const f = state.fixtures.find((x) => x.id === fid);
  if (!f || (f.home !== tid && f.away !== tid)) return { ok: false, text: 'Maç bulunamadı.' };
  state.press[tid] ||= {};
  if (state.press[tid][fid] !== undefined) return { ok: false, text: 'Bu maç için basın toplantısı zaten yapıldı.' };
  const pc = pressConference(state, tid, f);
  const squad = state.teams[tid].squad.map((id) => state.players[id]).filter(Boolean);
  const board = state.boards[tid];
  const [a1, a2, a3] = answers;
  const quotes = [];
  if (a1 === 'bold') { addFans(state, tid, 4); squad.forEach((p) => { p.morale = clamp(p.morale + 3, 0, 100); }); }
  if (a1 === 'respect') squad.forEach((p) => { p.morale = clamp(p.morale + 4, 0, 100); });
  if (a1 === 'calm') board.confidence = clamp(board.confidence + 2, 0, 100);
  const star = pc.questions[1].pid && state.players[pc.questions[1].pid];
  if (a2 === 'praise' && star) star.morale = clamp(star.morale + 10, 0, 100);
  if (a2 === 'team') squad.forEach((p) => { p.morale = clamp(p.morale + 2, 0, 100); });
  if (a2 === 'demand' && star) star.morale = clamp(star.morale + (star.morale >= 60 && chance(0.6) ? 5 : -10), 0, 100);
  if (a3 === 'noc') board.confidence = clamp(board.confidence + 1.5, 0, 100);
  if (a3 === 'crit') { addFans(state, tid, 3); board.confidence = clamp(board.confidence - 3, 0, 100); }
  state.press[tid][fid] = a1 || 'none';
  const q1 = pc.questions[0].a.find((x) => x.id === a1);
  if (q1) quotes.push(q1.t);
  const q2 = pc.questions[1].a.find((x) => x.id === a2);
  if (q2) quotes.push(q2.t);
  const oppId = f.home === tid ? f.away : f.home;
  if (quotes.length) addNews(state, `${state.managers[tid]} (${state.teams[tid].name}), ${state.teams[oppId].name} maçı öncesi konuştu: "${quotes.join(' ')}"`, 'club', [tid, oppId], 'Basın toplantısı');
  const keep = new Set(state.fixtures.filter((x) => !x.played).map((x) => x.id));
  for (const k of Object.keys(state.press[tid])) if (!keep.has(k) && k !== fid) delete state.press[tid][k];
  state.press[tid][fid] = a1 || 'none';
  return { ok: true, text: 'Basın toplantısı tamamlandı. Söyledikleriniz gündemde!' };
}

// ===== PLAYER TALKS (MEVCUT) =====
export const TALKS = {
  praise: { label: 'Performansını öv', icon: '👏' },
  demand: { label: 'Daha fazlasını iste', icon: '☝️' },
  promise: { label: 'Forma sözü ver', icon: '🤝' },
  calm: { label: 'Geleceği hakkında konuş', icon: '💬' },
};

export function talkToPlayer(state, tid, pid, kind) {
  const p = state.players[pid];
  if (!p || p.teamId !== tid) return { ok: false, text: 'Bu oyuncu takımınızda değil.' };
  if (p.talked && daysBetween(p.talked, state.date) < 10) return { ok: false, text: `${p.name} ile yakın zamanda konuştunuz. Biraz zaman tanıyın.` };
  const avg = p.stats.rN ? p.stats.rSum / p.stats.rN : 6.5;
  let d = 0;
  let text;
  if (kind === 'praise') {
    d = avg >= 7 ? 8 : avg >= 6.5 ? 5 : 1;
    text = avg >= 6.5 ? `${p.name} övgülerinizden çok memnun kaldı, daha da çok çalışacağını söyledi.` : `${p.name} teşekkür etti ama kendi performansının farkında olduğunu belirtti.`;
  } else if (kind === 'demand') {
    if (p.morale >= 55 && p.age >= 24) { d = 4; text = `${p.name} eleştirinizi olgunlukla karşıladı ve sahada cevap vereceğini söyledi.`; } else { d = -9; text = `${p.name} söylediklerinize bozuldu. Morali düştü.`; }
  } else if (kind === 'promise') {
    d = 10;
    p.promise = { until: addDays(state.date, 28), mins: 0 };
    text = `${p.name} forma sözünüzden çok memnun. Önümüzdeki 4 hafta içinde yeterli süre almazsa hayal kırıklığına uğrayacak.`;
  } else {
    d = p.morale < 40 ? 7 : 2;
    text = p.morale < 40 ? `${p.name} ile uzun bir görüşme yaptınız. Kulüpteki geleceğine dair içi biraz rahatladı.` : `${p.name} kulüpte mutlu olduğunu ve odağının takımda olduğunu söyledi.`;
  }
  p.morale = clamp(p.morale + d, 0, 100);
  p.talked = state.date;
  return { ok: true, text, delta: d };
}

export function toggleShortlist(state, tid, pid) {
  state.shortlist[tid] ||= [];
  const list = state.shortlist[tid];
  const i = list.indexOf(pid);
  if (i >= 0) list.splice(i, 1);
  else list.unshift(pid);
  if (list.length > 40) list.length = 40;
  return { ok: true, on: i < 0 };
}

// ===== WEEKLY/MONTHLY AWARDS (MEVCUT) =====
const TOTW_SHAPE = ['GK', 'RB', 'CB', 'CB', 'LB', 'DM', 'CM', 'AM', 'RW', 'LW', 'ST'];
const SLOT_OK = { GK: ['GK'], RB: ['RB'], CB: ['CB'], LB: ['LB'], DM: ['DM', 'CM'], CM: ['CM', 'DM', 'AM'], AM: ['AM', 'CM'], RW: ['RW', 'LW'], LW: ['LW', 'RW'], ST: ['ST'] };

function roundNews(state, comp) {
  state.reported ||= {};
  const done = state.reported[`${comp}${state.season}`] || 0;
  const fx = state.fixtures.filter((f) => f.comp === comp);
  const r = done + 1;
  const list = fx.filter((f) => f.round === r);
  if (!list.length || list.some((f) => !f.played)) return;
  state.reported[`${comp}${state.season}`] = r;
  const table = standings(state, comp);
  const leader = table[0];
  const T = (id) => state.teams[id].name;
  const biggest = list.slice().sort((a, b) => Math.abs(b.hg - b.ag) - Math.abs(a.hg - a.ag) || (b.hg + b.ag) - (a.hg + a.ag))[0];
  const second = table[1];
  const gap = leader.pts - (second?.pts || 0);
  addNews(state, `${COMPS[comp].short} ${r}. hafta tamamlandı. Zirvede ${T(leader.id)} (${leader.pts} puan${gap ? `, ${gap} puan farkla` : ', averajla'}). Haftanın en dikkat çeken skoru: ${T(biggest.home)} ${biggest.hg}-${biggest.ag} ${T(biggest.away)}.`, 'league', [leader.id, biggest.home, biggest.away], `${COMPS[comp].short} ${r}. hafta`);
  if (comp !== 'SL') return;
  // Haftanın takımı
  const cands = [];
  for (const f of list) for (const [pid, rt] of Object.entries(f.ratings || {})) {
    const p = state.players[pid];
    if (p && p.teamId) cands.push({ p, rt });
  }
  cands.sort((a, b) => b.rt - a.rt);
  const used = new Set();
  const xi = [];
  for (const slot of TOTW_SHAPE) {
    const c = cands.find((x) => !used.has(x.p.id) && SLOT_OK[slot].includes(x.p.pos));
    if (!c) continue;
    used.add(c.p.id);
    xi.push(c);
  }
  if (xi.length < 9) return;
  addNews(state, `⭐ Süper Lig ${r}. haftanın takımı: ${xi.map((x) => `${x.p.name} (${state.teams[x.p.teamId].short}, ${x.rt.toFixed(1)})`).join(', ')}.`, 'award', xi.map((x) => x.p.teamId), `${r}. haftanın takımı`);
  for (const x of xi) {
    if (!isHuman(state, x.p.teamId)) continue;
    x.p.morale = clamp(x.p.morale + 3, 0, 100);
    addMessage(state, { teamId: x.p.teamId, title: `${x.p.name} haftanın takımında!`, body: `${x.p.name}, ${x.rt.toFixed(1)} maç puanıyla Süper Lig ${r}. haftanın takımına seçildi.`, pid: x.p.id, quiet: true });
  }
}

const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

function monthlyAwards(state) {
  const prev = addDays(state.date, -1).slice(0, 7);
  const month = AYLAR[Number(prev.slice(5, 7)) - 1];
  const fx = state.fixtures.filter((f) => f.comp === 'SL' && f.played && f.date.startsWith(prev));
  if (fx.length < 18) return;
  const pl = {};
  const tm = {};
  for (const f of fx) {
    for (const [pid, rt] of Object.entries(f.ratings || {})) {
      const x = (pl[pid] ||= { n: 0, s: 0, g: 0 });
      x.n++; x.s += rt;
    }
    for (const e of f.events || []) if (e.type === 'goal' && pl[e.pid]) pl[e.pid].g++;
    for (const [id, my, their] of [[f.home, f.hg, f.ag], [f.away, f.ag, f.hg]]) {
      const t = (tm[id] ||= { n: 0, pts: 0, gd: 0 });
      t.n++; t.pts += my > their ? 3 : my === their ? 1 : 0; t.gd += my - their;
    }
  }
  const bestP = Object.entries(pl).filter(([, x]) => x.n >= 3).map(([pid, x]) => ({ pid, v: x.s / x.n + x.g * 0.12 })).sort((a, b) => b.v - a.v)[0];
  const bestT = Object.entries(tm).filter(([, x]) => x.n >= 3).sort((a, b) => b[1].pts / b[1].n - a[1].pts / a[1].n || b[1].gd - a[1].gd)[0];
  if (bestP) {
    const p = state.players[bestP.pid];
    if (p?.teamId) {
      addNews(state, `🏅 Süper Lig'de ${month} ayının oyuncusu: ${p.name} (${state.teams[p.teamId].name}).`, 'award', [p.teamId], `${month} ayının oyuncusu`);
      if (isHuman(state, p.teamId)) {
        p.morale = clamp(p.morale + 8, 0, 100);
        addMessage(state, { teamId: p.teamId, title: `${p.name} ayın oyuncusu seçildi`, body: `${p.name}, ${month} ayında Süper Lig'in en iyi oyuncusu seçildi.`, pid: p.id });
      }
    }
  }
  if (bestT) {
    const [tid, x] = bestT;
    const coach = state.managers?.[tid] || state.teams[tid].coach;
    addNews(state, `🎩 ${month} ayının teknik direktörü: ${coach} (${state.teams[tid].name}, ${x.n} maçta ${x.pts} puan).`, 'award', [tid], `${month} ayının teknik direktörü`);
    if (isHuman(state, tid)) {
      const c = careerOf(state, tid);
      if (!c) return;
      c.awards.push({ season: state.season, name: `${month} ayının teknik direktörü`, teamId: tid });
      state.boards[tid].confidence = clamp(state.boards[tid].confidence + 4, 0, 100);
      addFans(state, tid, 4);
      addMessage(state, { teamId: tid, title: 'Ayın teknik direktörü seçildiniz!', body: `${month} ayında ${x.n} maçta ${x.pts} puan topladınız ve Süper Lig'de ayın teknik direktörü seçildiniz.` });
      unlock(state, tid, 'award');
    }
  }
}

function weeklyCareer(state) {
  for (const tid of humansOf(state)) {
    const team = state.teams[tid];
    state.fans[tid] = clamp(fansOf(state, tid) + (60 - fansOf(state, tid)) * 0.03, 0, 100);
    if (team.finance.balance >= 50e6) unlock(state, tid, 'rich');
    for (const pid of team.squad) {
      const p = state.players[pid];
      if (!p?.promise) continue;
      p.promise.mins += p.weekMins || 0;
      if (state.date >= p.promise.until) {
        if (p.promise.mins < 180) {
          p.morale = clamp(p.morale - 15, 0, 100);
          addMessage(state, { teamId: tid, title: `${p.name} sözünüzü tutmadığınızı düşünüyor`, body: `Son 4 haftada yalnızca ${p.promise.mins} dakika oynayan ${p.name}, verdiğiniz forma sözünün tutulmadığını söyledi. Morali ciddi şekilde düştü.`, pid });
        } else {
          p.morale = clamp(p.morale + 4, 0, 100);
        }
        p.promise = null;
      }
    }
    for (const x of state.transferLog.slice(0, 20)) {
      if (x.date < addDays(state.date, -8)) break;
      if (x.toId === tid && x.fee >= 15e6) unlock(state, tid, 'buy_big');
      if (x.fromId === tid && x.fee >= 20e6) unlock(state, tid, 'sell_big');
    }
  }
}

export function careerDaily(state) {
  if (weekday(state.date) === 1) {
    for (const comp of TR_LEAGUES) {
      for (let k = 0; k < 3; k++) roundNews(state, comp);
    }
    weeklyCareer(state);
  }
  if (state.date.endsWith('-01')) monthlyAwards(state);
}

// ===== SEASON END (MEVCUT) =====
export function careerSeasonEnd(state, summary) {
  const events = state.trophyEvents || [];
  for (const tid of humansOf(state)) {
    const c = careerOf(state, tid);
    if (!c) continue;
    const h = summary.humans[tid] || {};
    const won = events.filter((e) => e.teamId === tid && e.season === state.season);
    for (const e of won) {
      c.trophies.push({ season: state.season, comp: e.comp, name: COMPS[e.comp]?.name || e.comp, teamId: tid });
      if (e.comp === 'SL') unlock(state, tid, 'league_title');
      if (e.comp === 'ZTK') unlock(state, tid, 'cup_title');
      if (UEFA.includes(e.comp)) unlock(state, tid, 'euro_title');
    }
    if (won.some((e) => e.comp === 'SL') && won.some((e) => e.comp === 'ZTK')) unlock(state, tid, 'double');
    if (h.promoted) unlock(state, tid, 'promotion');
    c.seasons.push({ season: state.season, teamId: tid, league: h.league, pos: h.pos, cup: h.cup, europe: h.europe, trophies: won.map((e) => e.comp) });
    if (c.seasons.filter((s) => s.teamId === tid).length >= 3) unlock(state, tid, 'seasons3');
    addFans(state, tid, won.length * 8 + (h.promoted ? 10 : 0) - (h.relegated ? 15 : 0));

    if (!state.mp && tid === state.userTeamId && !state.gameOver) {
      const board = state.boards[tid];
      const great = won.length || h.promoted || (h.pos && board && h.pos <= board.target - 2);
      if (great && chance(0.6)) {
        const me = state.teams[tid];
        const clubs = Object.values(state.teams).filter((t) => t.country === 'TR' && t.id !== tid && !isHuman(state, t.id) && t.rep >= me.rep + 4 && t.rep <= managerRep(state, tid) + 6);
        if (clubs.length) {
          const club = pick(clubs);
          addMessage(state, {
            teamId: tid,
            title: `${club.name} sizi teknik direktör olarak istiyor`,
            body: `Başarılı sezonunuzun ardından ${club.name} (${COMPS[club.league].short}) yönetimi sizinle görüşmek istiyor. Kabul ederseniz yeni sezona ${club.name} ile başlarsınız; reddederseniz ${me.name} ile devam edersiniz.`,
            kind: 'job', needsAction: true, data: { teamId: club.id },
          });
        }
      }
    }
  }
}

// ===== JOB OFFERS (MEVCUT) =====
export function managerRep(state, tid) {
  const c = careerOf(state, tid);
  if (!c) return 50;
  const big = c.trophies.filter((t) => ['SL', 'UCL', 'UEL', 'UECL'].includes(t.comp)).length;
  const v = 48 + c.trophies.length * 4 + big * 4 + c.seasons.length * 1.5 + Object.keys(c.achv).length * 0.6 - c.sackings * 3
    + (c.matches.w - c.matches.l) * 0.05;
  return clamp(Math.round(v), 40, 92);
}

export function jobOffers(state, tid) {
  const rep = managerRep(state, tid);
  const clubs = Object.values(state.teams)
    .filter((t) => t.country === 'TR' && t.id !== tid && !isHuman(state, t.id) && t.rep <= rep + 2)
    .sort((a, b) => Math.abs(a.rep - rep) - Math.abs(b.rep - rep));
  const seen = new Set();
  const out = [];
  for (const t of clubs) {
    if (out.length >= 3) break;
    if (seen.has(t.league) && out.length < 2) continue;
    seen.add(t.league);
    out.push(t.id);
  }
  for (const t of clubs) if (out.length < 3 && !out.includes(t.id)) out.push(t.id);
  return out;
}

export function takeJob(state, newTeamId, addHumanFn, makeBoardFn) {
  const old = state.userTeamId;
  const name = state.managers[old] || state.manager;
  state.humans = state.humans.filter((x) => x !== old);
  delete state.managers[old];
  delete state.boards[old];
  if (state.teams[old]) state.teams[old].coach = 'Yeni teknik direktör';
  state.userTeamId = newTeamId;
  state.gameOver = false;
  state.gameOverText = null;
  addHumanFn(state, newTeamId, name);
  state.boards[newTeamId] = makeBoardFn(state, newTeamId);
  state.boards[newTeamId].confidence = 70;
  for (const m of state.inbox) if (m.teamId === old) m.teamId = newTeamId;
  addNews(state, `${state.teams[newTeamId].name}, teknik direktörlük görevine ${name} getirildi.`, 'club', [newTeamId, old], 'Yeni teknik direktör');
  return { ok: true };
}

export { fmtMoney as _fmt };
