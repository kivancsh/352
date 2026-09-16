// js/engine/exportCareer.js
// Export career data as JSON or CSV

export function exportCareerAsJSON(slotNumber) {
    try {
          const saveData = localStorage.getItem(`gameState_slot${slotNumber}`);
          if (!saveData) {
                  return { ok: false, text: 'No save found' };
          }

      const save = JSON.parse(saveData);
          const c = save.career?.['me'] || save.career?.[Object.keys(save.career)[0]];

      if (!c) {
              return { ok: false, text: 'Career data corrupted' };
      }

      const totalMatches = c.matches.w + c.matches.d + c.matches.l;
          const winRate = totalMatches > 0 ? ((c.matches.w / totalMatches) * 100).toFixed(1) : 0;

      const exported = {
              exportDate: new Date().toISOString(),
              career: {
                        since: c.since,
                        currentSeason: save.season || 1,
                        teams: c.teams,
                        trophies: c.trophies.length,
                        awards: c.awards.length,
                        achievements: Object.keys(c.achv).length
              },
              statistics: {
                        totalMatches,
                        wins: c.matches.w,
                        draws: c.matches.d,
                        losses: c.matches.l,
                        goalsFor: c.matches.gf,
                        goalsAgainst: c.matches.ga,
                        goalDifference: c.matches.gf - c.matches.ga,
                        winRate: `${winRate}%`,
                        bestStreak: c.bestStreak,
                        trophyCount: c.trophies.length,
                        seasonCount: c.seasons.length
              },
              achievements: c.achv,
              trophies: c.trophies,
              seasons: c.seasons
      };

      const dataStr = JSON.stringify(exported, null, 2);
          downloadFile(dataStr, `career-export-${new Date().toISOString().split('T')[0]}.json`);

      return { ok: true, text: 'Career exported as JSON' };
    } catch (error) {
          console.error('Export failed:', error);
          return { ok: false, text: 'Export failed: ' + error.message };
    }
}

export function exportCareerAsCSV(slotNumber) {
    try {
          const saveData = localStorage.getItem(`gameState_slot${slotNumber}`);
          if (!saveData) {
                  return { ok: false, text: 'No save found' };
          }

      const save = JSON.parse(saveData);
          const c = save.career?.['me'] || save.career?.[Object.keys(save.career)[0]];

      if (!c) {
              return { ok: false, text: 'Career data corrupted' };
      }

      const totalMatches = c.matches.w + c.matches.d + c.matches.l;
          const winRate = totalMatches > 0 ? ((c.matches.w / totalMatches) * 100).toFixed(1) : 0;

      let csv = 'Career Statistics Export\n';
          csv += `Export Date,${new Date().toLocaleString()}\n\n`;

      csv += 'OVERVIEW\n';
          csv += `Total Matches,${totalMatches}\n`;
          csv += `Wins,${c.matches.w}\n`;
          csv += `Draws,${c.matches.d}\n`;
          csv += `Losses,${c.matches.l}\n`;
          csv += `Win Rate,${winRate}%\n`;
          csv += `Goals For,${c.matches.gf}\n`;
          csv += `Goals Against,${c.matches.ga}\n`;
          csv += `Goal Difference,${c.matches.gf - c.matches.ga}\n\n`;

      csv += 'ACHIEVEMENTS\n';
          csv += `Total Achievements,${Object.keys(c.achv).length}\n`;
          csv += `Trophies Won,${c.trophies.length}\n`;
          csv += `Seasons Played,${c.seasons.length}\n`;
          csv += `Best Streak,${c.bestStreak} matches\n\n`;

      csv += 'TROPHIES\n';
          csv += 'Season,Competition,Date\n';
          c.trophies.forEach(t => {
                  csv += `${t.season},${t.comp},${t.name}\n`;
          });

      downloadFile(csv, `career-statistics-${new Date().toISOString().split('T')[0]}.csv`);

      return { ok: true, text: 'Career exported as CSV' };
    } catch (error) {
          console.error('CSV export failed:', error);
          return { ok: false, text: 'CSV export failed: ' + error.message };
    }
}

function downloadFile(content, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

  setTimeout(() => {
        document.body.removeChild(element);
  }, 100);
}

export function exportAllSlots() {
    const allSlots = [];
    for (let i = 1; i <= 20; i++) {
          const save = localStorage.getItem(`gameState_slot${i}`);
          if (save) {
                  allSlots.push({
                            slot: i,
                            data: JSON.parse(save),
                            lastModified: new Date(parseInt(save.slice(-10))).toLocaleString()
                  });
          }
    }

  const csv = JSON.stringify(allSlots, null, 2);
    downloadFile(csv, `all-saves-${new Date().toISOString().split('T')[0]}.json`);

  return { ok: true, text: `Exported ${allSlots.length} save slots` };
}
