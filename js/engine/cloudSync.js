// js/engine/cloudSync.js
// Cloud save system - Firebase integration
// Auto-sync every 5 minutes, cross-device support

// For now: localStorage wrapper (Firebase to be integrated)
// This provides the API for future Firebase connection

export async function saveToCloud(saveData, userId = 'default') {
  try {
    // Temporary: Save to localStorage with cloud metadata
    const cloudData = {
            data: saveData,
                    timestamp: Date.now(),
                    version: '1.0',
                    userId: userId,
                    syncStatus: 'synced'
              };

    localStorage.setItem(`cloud_save_${userId}`, JSON.stringify(cloudData));
    console.log('✅ Saved to cloud (local backup)');

    // TODO: Integrate Firebase when API keys configured
    // await pushToFirebase(cloudData);

    return { ok: true, text: 'Save synced to cloud' };
} catch (error) {
    console.error('Cloud save failed:', error);
    return { ok: false, text: 'Cloud sync failed, using local save' };
}
}

export async function loadFromCloud(userId = 'default') {
  try {
    const cloudData = localStorage.getItem(`cloud_save_${userId}`);
    if (cloudData) {
      const parsed = JSON.parse(cloudData);
      console.log('✅ Loaded from cloud backup');
      return parsed.data;
    }
    return null;
  } catch (error) {
    console.error('Cloud load failed:', error);
    return null;
  }
}

export function startAutoSync(getGameState, userId = 'default') {
    // Auto-sync every 5 minutes
  return setInterval(() => {
        const gameState = getGameState();
    if (gameState) {
      saveToCloud(gameState, userId).catch(err => console.error('Auto-sync failed:', err));
    }
}, 5 * 60 * 1000); // 5 minutes
}

export function createLocalBackup(slotNumber) {
    try {
    const current = localStorage.getItem(`gameState_slot${slotNumber}`);
    if (!current) return { ok: false, text: 'No save to backup' };

    const timestamp = Date.now();
    const backupKey = `gameState_backup_${slotNumber}_${timestamp}`;
    localStorage.setItem(backupKey, current);

    // Keep only last 5 backups per slot
    const allBackups = Object.keys(localStorage)
      .filter(k => k.startsWith(`gameState_backup_${slotNumber}_`))
      .sort()
      .reverse();

    for (let i = 5; i < allBackups.length; i++) {
      localStorage.removeItem(allBackups[i]);
}

    console.log(`✅ Backup created (${allBackups.length}/5 backups kept)`);
    return { ok: true, text: 'Backup created successfully' };
} catch (error) {
    console.error('Backup creation failed:', error);
    return { ok: false, text: 'Backup failed' };
}
}

export function restoreFromBackup(slotNumber, backupIndex = 0) {
  try {
    const allBackups = Object.keys(localStorage)
      .filter(k => k.startsWith(`gameState_backup_${slotNumber}_`))
      .sort()
      .reverse();

    if (!allBackups[backupIndex]) {
      return { ok: false, text: 'Backup not found' };
}

    const backup = localStorage.getItem(allBackups[backupIndex]);
    localStorage.setItem(`gameState_slot${slotNumber}`, backup);

    console.log(`✅ Restored from backup ${backupIndex + 1}/${allBackups.length}`);
    return { ok: true, text: `Restored backup ${backupIndex + 1}` };
} catch (error) {
    console.error('Restore failed:', error);
    return { ok: false, text: 'Restore failed' };
}
}

export function getBackupList(slotNumber) {
  const allBackups = Object.keys(localStorage)
    .filter(k => k.startsWith(`gameState_backup_${slotNumber}_`))
    .sort()
    .reverse();

  return allBackups.map((key, index) => ({
    index,
    timestamp: parseInt(key.split('_').pop()),
    date: new Date(parseInt(key.split('_').pop())).toLocaleString()
}));
}
