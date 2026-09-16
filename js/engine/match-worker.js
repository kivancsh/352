// ===== MATCH SIMULATION WEB WORKER =====
// Heavy calculation'ı separate thread'te çalıştır
// Ana thread'i free tut, 60 FPS smooth kalsın

self.onmessage = (event) => {
  const { gameState, tick, formation } = event.data;
  
  try {
    // ===== HEAVY COMPUTATION (Main thread'i block etmez) =====
    
    // 1. AI Decision Logic
    const aiDecisions = calculateAIDecisions(gameState, formation);
    
    // 2. Physics Update
    const updatedState = runPhysicsSimulation(gameState, aiDecisions, tick);
    
    // 3. Player Position Update
    updatePlayerPositions(updatedState);
    
    // 4. Ball Movement
    updateBallPhysics(updatedState);
    
    // 5. Render Frame Build
    const renderFrame = buildRenderData(updatedState);
    
    // ===== GERI GÖNDER =====
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

// ===== HELPER FUNCTIONS =====
function calculateAIDecisions(state, formation) {
  // AI takımların kararlarını hesapla
  const decisions = {};
  state.teams.forEach(team => {
    decisions[team.id] = {
      pass: Math.random() > 0.4,
      shoot: Math.random() > 0.7,
      defendPressure: team.mentality === 'aggressive'
    };
  });
  return decisions;
}

function runPhysicsSimulation(state, decisions, tick) {
  // Oyuncu pozisyonları, top hareketi, collision'lar
  const newState = JSON.parse(JSON.stringify(state)); // Deep copy
  
  // Update positions based on AI decisions
  newState.players.forEach(player => {
    player.x += player.vx * 0.016; // 60 FPS tick
    player.y += player.vy * 0.016;
    player.stamina -= 0.1;
  });
  
  return newState;
}

function updatePlayerPositions(state) {
  state.players.forEach(p => {
    p.animated = true;
  });
}

function updateBallPhysics(state) {
  const ball = state.ball;
  ball.x += ball.vx * 0.016;
  ball.y += ball.vy * 0.016;
  
  if (ball.y > 105) ball.vx *= -0.9; // Boundary collision
  ball.vx *= 0.99; // Friction
}

function buildRenderData(state) {
  return {
    players: state.players.map(p => ({
      id: p.id,
      x: p.x,
      y: p.y,
      name: p.name
    })),
    ball: { x: state.ball.x, y: state.ball.y },
    score: state.score,
    time: state.time
  };
}
