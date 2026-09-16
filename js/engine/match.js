// Match simulation and AI logic
// Handles match flow, player actions, and AI decision making

export class Match {
  constructor(state, fx, opts = {}) {
    this.state = state;
    this.fx = fx;
    this.autoUser = opts.autoUser ?? true;
    this.difficulty = opts.difficulty || 'normal';
    
    this.sides = fx.teams.map((tid) => ({
      teamId: tid,
      players: state.teams[tid].lineup || [],
      formation: state.teams[tid].formation,
      mentality: state.teams[tid].mentality,
      possession: 50,
      shots: 0,
      shotsOnTarget: 0,
      passes: 0,
      passAccuracy: 0.75,
      corners: 0,
      fouls: 0,
      yellowCards: [],
      redCards: [],
      injuries: [],
      manual: false,
    }));
    
    this.ball = { x: 50, y: 50, possession: 0 };
    this.time = 0;
    this.finished = false;
    this.events = [];
    this.fresh = [];
  }

  get homeTeamId() { return this.fx.teams[0]; }
  get awayTeamId() { return this.fx.teams[1]; }

  snapshot() {
    return {
      id: this.fx.id,
      teams: this.fx.teams,
      score: this.fx.score,
      time: this.time,
      sides: this.sides.map(s => ({
        teamId: s.teamId,
        possession: s.possession,
        shots: s.shots,
        shotsOnTarget: s.shotsOnTarget
      })),
      events: this.events.slice(-20)
    };
  }

  static restore(state, snap) {
    if (!snap || !snap.id) return null;
    const fx = state.fixtures.find(f => f.id === snap.id);
    if (!fx) return null;
    const m = new Match(state, fx);
    m.time = snap.time;
    return m;
  }

  // ===== AI DIFFICULTY CONFIGURATION =====
  getAIDifficulty() {
    const difficulties = {
      easy: {
        name: 'Easy',
        aggressionMultiplier: 0.7,
        accuracyBonus: 0.0,
        decisionSpeed: 1.0,
        defenseSharpness: 0.7,
        playerWinRate: 0.75,
        description: 'Introductory difficulty'
      },
      
      normal: {
        name: 'Normal',
        aggressionMultiplier: 1.0,
        accuracyBonus: 0.0,
        decisionSpeed: 1.0,
        defenseSharpness: 1.0,
        playerWinRate: 0.55,
        description: 'Balanced challenge'
      },
      
      hard: {
        name: 'Hard',
        aggressionMultiplier: 1.3,
        accuracyBonus: 0.08,
        decisionSpeed: 1.3,
        defenseSharpness: 1.3,
        playerWinRate: 0.40,
        description: 'Competitive difficulty'
      },
      
      extreme: {
        name: 'Extreme',
        aggressionMultiplier: 1.3,      // 1.6 → 1.3 (FIXED)
        accuracyBonus: 0.08,            // 0.15 → 0.08 (FIXED)
        decisionSpeed: 1.2,             // 2.0 → 1.2 (FIXED)
        defenseSharpness: 1.25,
        playerWinRate: 0.25,            // Now beatable
        description: 'Extreme challenge - for hardcore players'
      }
    };
    
    return difficulties[this.difficulty] || difficulties.normal;
  }

  // ===== AI TEAM DECISION MAKING =====
  getAITeamMove(sideIdx) {
    const side = this.sides[sideIdx];
    const opponent = this.sides[1 - sideIdx];
    const aiConfig = this.getAIDifficulty();
    
    // Base stats
    const possession = side.possession / 100;
    const teamPower = this.state.teams[side.teamId].power || 75;
    const opponentPower = this.state.teams[opponent.teamId].power || 75;
    const powerDiff = (teamPower - opponentPower) / 100;
    
    // Difficulty-adjusted aggression
    const aggression = aiConfig.aggressionMultiplier * (1 + powerDiff * 0.3);
    const accuracy = 0.75 + aiConfig.accuracyBonus;
    
    // Decision weights
    const passWeight = 0.55 * aggression;
    const shootWeight = 0.35 * aggression;
    const dribbleWeight = 0.10 * aggression;
    
    return {
      action: this.chooseAction(passWeight, shootWeight, dribbleWeight),
      accuracy: accuracy,
      defenseSharpness: aiConfig.defenseSharpness,
      mentality: side.mentality || 'balanced'
    };
  }

  chooseAction(passWeight, shootWeight, dribbleWeight) {
    const total = passWeight + shootWeight + dribbleWeight;
    const rand = Math.random() * total;
    
    if (rand < passWeight) return 'pass';
    if (rand < passWeight + shootWeight) return 'shoot';
    return 'dribble';
  }

  // ===== MAIN SIMULATION LOOP =====
  step() {
    if (this.finished) return;
    
    // Time increment
    this.time += 1;
    
    // Get AI moves for both sides
    const homeMove = this.getAITeamMove(0);
    const awayMove = this.getAITeamMove(1);
    
    // Process possession
    this.updatePossession(homeMove, awayMove);
    
    // Execute action
    const actionSide = this.ball.possession === 0 ? 0 : 1;
    const action = actionSide === 0 ? homeMove : awayMove;
    
    switch (action.action) {
      case 'pass':
        this.attemptPass(actionSide, action.accuracy);
        break;
      case 'shoot':
        this.attemptShot(actionSide, action.accuracy);
        break;
      case 'dribble':
        this.attemptDribble(actionSide, action.accuracy);
        break;
    }
    
    // Check match end
    if (this.time >= 90) {
      this.finished = true;
    }
  }

  updatePossession(homeMove, awayMove) {
    // Possession dynamics based on team power
    const homePower = this.state.teams[this.homeTeamId].power || 75;
    const awayPower = this.state.teams[this.awayTeamId].power || 75;
    const powerFactor = (homePower - awayPower) / 150;
    
    if (this.ball.possession === 0) {
      // Home team has possession
      if (Math.random() < (0.15 - powerFactor * 0.1)) {
        this.ball.possession = 1; // Loss of possession
      } else {
        this.sides[0].possession += 0.5;
      }
    } else {
      // Away team has possession
      if (Math.random() < (0.15 + powerFactor * 0.1)) {
        this.ball.possession = 0; // Loss of possession
      } else {
        this.sides[1].possession += 0.5;
      }
    }
    
    // Cap possession at 100
    this.sides.forEach(s => s.possession = Math.min(100, s.possession));
  }

  attemptPass(teamIdx, accuracy) {
    const side = this.sides[teamIdx];
    side.passes += 1;
    
    if (Math.random() < accuracy) {
      // Successful pass
      side.passAccuracy = (side.passAccuracy + accuracy) / 2;
    } else {
      // Failed pass - turnover
      this.ball.possession = 1 - teamIdx;
      this.addEvent(`${this.state.teams[side.teamId].name} loses possession`);
    }
  }

  attemptShot(teamIdx, accuracy) {
    const side = this.sides[teamIdx];
    const opponent = this.sides[1 - teamIdx];
    
    side.shots += 1;
    
    const finalAccuracy = accuracy * (Math.random() * 0.4 + 0.6);
    
    if (finalAccuracy > 0.7) {
      // Goal!
      this.fx.score[teamIdx] += 1;
      side.shotsOnTarget += 1;
      this.addEvent(`⚽ GOAL! ${this.state.teams[side.teamId].name} scores!`);
    } else if (finalAccuracy > 0.4) {
      // Shot on target
      side.shotsOnTarget += 1;
      this.addEvent(`📌 Shot on target by ${this.state.teams[side.teamId].name}`);
    } else {
      // Missed shot
      this.addEvent(`❌ ${this.state.teams[side.teamId].name} misses`);
    }
    
    this.ball.possession = 1 - teamIdx;
  }

  attemptDribble(teamIdx, accuracy) {
    const side = this.sides[teamIdx];
    const opponent = this.sides[1 - teamIdx];
    
    if (Math.random() < accuracy * 0.8) {
      // Successful dribble
      this.addEvent(`🏃 ${this.state.teams[side.teamId].name} dribbles forward`);
    } else {
      // Failed dribble - turnover
      this.ball.possession = 1 - teamIdx;
      this.addEvent(`🔄 Turnover`);
    }
  }

  setMentality(sideIdx, mentality) {
    this.sides[sideIdx].mentality = mentality;
  }

  substitute(sideIdx, outIdx, inIdx) {
    const side = this.sides[sideIdx];
    const lineup = side.players;
    
    if (!lineup.includes(outIdx) || !this.state.teams[side.teamId].squad.includes(inIdx)) {
      return false;
    }
    
    const idx = lineup.indexOf(outIdx);
    lineup[idx] = inIdx;
    return true;
  }

  playToEnd() {
    while (!this.finished) {
      this.step();
    }
  }

  addEvent(text) {
    this.events.push({
      time: this.time,
      text: text
    });
  }

  apply() {
    return {
      homeGoals: this.fx.score[0],
      awayGoals: this.fx.score[1],
      played: true,
      events: this.events
    };
  }
}

// ===== DIFFICULTY PRESETS =====
export const MATCH_DIFFICULTY = {
  EASY: 'easy',
  NORMAL: 'normal',
  HARD: 'hard',
  EXTREME: 'extreme'
};
