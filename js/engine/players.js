// Player rating and value calculation
// Handles stat weights, player power, and market value

export const STAT_WEIGHTS = {
  speed: {
    weight: 1.0,
    impactFactor: 0.16,
    description: 'Pace, positioning, reaction time'
  },
  
  technique: {
    weight: 1.1,
    impactFactor: 0.14,
    description: 'Pass accuracy, dribbling, ball control'
  },
  
  physical: {
    weight: 1.0,
    impactFactor: 0.12,
    description: 'Strength, durability, physical duels'
  },
  
  positioning: {
    weight: 0.9,
    impactFactor: 0.08,
    description: 'Off-ball movement, awareness'
  },
  
  stamina: {
    weight: 0.9,
    impactFactor: 0.06,
    description: 'Late-game performance, pressing'
  },
  
  mental: {
    weight: 0.8,
    impactFactor: 0.04,
    description: 'Composure, mentality, decision making'
  }
};

export function calculatePlayerPower(stats) {
  const {
    speed = 75,
    technique = 75,
    physical = 75,
    positioning = 75,
    stamina = 75,
    mental = 75
  } = stats;
  
  const weightedPower = 
    (speed * STAT_WEIGHTS.speed.weight * 0.20) +
    (technique * STAT_WEIGHTS.technique.weight * 0.22) +
    (physical * STAT_WEIGHTS.physical.weight * 0.18) +
    (positioning * STAT_WEIGHTS.positioning.weight * 0.12) +
    (stamina * STAT_WEIGHTS.stamina.weight * 0.14) +
    (mental * STAT_WEIGHTS.mental.weight * 0.14);
  
  return Math.round(weightedPower);
}

export function calculatePlayerValue(player) {
  if (!player) return 0;
  
  const baseValue = 500000;
  const ageDecay = Math.max(0.1, 1 - Math.abs(player.age - 26) / 50);
  const potentialBonus = (player.potential || player.rating) - player.rating;
  const positionMultiplier = {
    'GK': 0.8, 'CB': 0.9, 'LB': 0.95, 'RB': 0.95,
    'CDM': 1.0, 'CM': 1.1, 'CAM': 1.15, 'LW': 1.2, 'RW': 1.2,
    'ST': 1.3
  }[player.position] || 1.0;
  
  const value = baseValue * 
    Math.pow(player.rating / 75, 2.5) * 
    ageDecay * 
    (1 + potentialBonus / 100) * 
    positionMultiplier;
  
  return Math.max(100000, value);
}

export function calculatePlayerAge(yearBorn, currentYear) {
  return currentYear - yearBorn;
}

export function getPlayerForm(stats) {
  const formRating = (stats.form || 7) / 10;
  return Math.max(0.7, Math.min(1.3, formRating));
}

export function getPlayerPosition(positionCode) {
  const positions = {
    'GK': 'Goalkeeper', 'CB': 'Center Back', 'LB': 'Left Back', 'RB': 'Right Back',
    'CDM': 'Defensive Midfielder', 'CM': 'Midfielder', 'CAM': 'Attacking Midfielder',
    'LW': 'Left Winger', 'RW': 'Right Winger', 'ST': 'Striker', 'CF': 'Center Forward'
  };
  return positions[positionCode] || 'Unknown';
}

export function
