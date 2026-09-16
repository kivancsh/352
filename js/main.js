// ===== FORMATION SCREEN - VIRTUAL SCROLL FIX =====
// Problem: 11 oyuncu hepsi DOM'da, formation seçerken 50 FPS
// Solution: Sadece görünen oyuncuları render et

const formationContainer = document.getElementById('formationGrid');
let scrollOffset = 0;

function renderFormationVirtual() {
  const visibleStart = Math.floor(scrollOffset / 40); // Her oyuncu ~40px
  const visibleEnd = visibleStart + 4; // Max 4 oyuncu görün
  
  formationContainer.innerHTML = '';
  
  lineup.forEach((playerId, idx) => {
    // Sadece görünen aralıkta render et
    if (idx >= visibleStart && idx <= visibleEnd) {
      const playerEl = document.createElement('div');
      playerEl.className = 'formation-player';
      playerEl.textContent = getPlayerName(playerId);
      playerEl.style.transform = `translateY(${(idx - visibleStart) * 40}px)`;
      formationContainer.appendChild(playerEl);
    }
  });
}

// Scroll event'i
formationContainer.addEventListener('scroll', (e) => {
  scrollOffset = e.target.scrollTop;
  renderFormationVirtual();
});

// İlk render
renderFormationVirtual();
