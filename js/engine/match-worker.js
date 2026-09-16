// ===== MATCH SIMULATION WEB WORKER =====
self.onmessage = (event) => {
  const { gameState, tick, formation } = event.data;
  
  try {
    const aiDecisions = calculateAIDecisions(gameState, formation);
    const updatedState = runPhysicsSimulation(gameState, aiDecisions, tick);
    updatePlayerPositions(updatedState);
    updateBallPhysics(updatedState);
    const renderFrame = buildRenderData(updatedState);
    
    self.postMessage({
      success: true,
      state: updatedState,
      render: renderFrame,
      tick: tick
    });
  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message,
      tick: tick
    });
  }
};

function calculateAIDecisions(state, formation) {
  const decisions = {};
  state.teams?.forEach(team => {
    decisions[team.id] = {
      pass: Math.random() > 0.4,
      shoot: Math.random() > 0.7,
      defendPressure: team.mentality === 'aggressive'
    };
  });
  return decisions;
}

function runPhysicsSimulation(state, decisions, tick) {
  const newState = JSON.parse(JSON.stringify(state));
  
  newState.players?.forEach(player => {
    player.x = (player.x || 0) + (player.vx || 0) * 0.016;
    player.y = (player.y || 0) + (player.vy || 0) * 0.016;
    player.stamina = Math.max(0, (player.stamina || 100) - 0.1);
  });
  
  return newState;
}

function updatePlayerPositions(state) {
  state.players?.forEach(p => {
    p.animated = true;
  });
}

function updateBallPhysics(state) {
  if (!state.ball) return;
  const ball = state.ball;
  ball.x = (ball.x || 0) + (ball.vx || 0) * 0.016;
  ball.y = (ball.y || 0) + (ball.vy || 0) * 0.016;
  
  if (ball.y > 105) ball.vx = (ball.vx || 0) * -0.9;
  ball.vx = (ball.vx || 0) * 0.99;
}

function buildRenderData(state) {
  return {
    players: (state.players || []).map(p => ({
      id: p.id,
      x: p.x,
      y: p.y,
      name: p.name
    })),
    ball: { x: state.ball?.x || 0, y: state.ball?.y || 0 },
    score: state.score || { h: 0, a: 0 },
    time: state.time || 0
  };
}
