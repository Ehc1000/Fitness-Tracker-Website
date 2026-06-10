import { initDB, addSleepLog, getSleepLogs, addStepLog, getStepLogs } from './services/db.js';

export function initWaterTracker() {
  const waterCountEl = document.getElementById('water-count');
  const progressBarEl = document.getElementById('water-progress-bar');
  const waterGoalEl = document.getElementById('water-goal');
  const addBtn = document.getElementById('add-water-btn');
  const removeBtn = document.getElementById('remove-water-btn');
  const resetBtn = document.getElementById('reset-water-btn');
  const setGoalBtn = document.getElementById('set-water-goal-btn');
  const goalInput = document.getElementById('water-goal-input');

  if (!waterCountEl || !progressBarEl || !addBtn || !removeBtn) {
    console.warn('Water tracker elements missing');
    return;
  }

  let waterGoal = parseInt(localStorage.getItem('waterGoal')) || 8;
  let waterData = JSON.parse(localStorage.getItem('waterIntake')) || { date: new Date().toDateString(), count: 0 };

  // Ensure waterData is in correct format
  if (typeof waterData !== 'object' || waterData === null || !('count' in waterData)) {
    waterData = { date: new Date().toDateString(), count: 0 };
  }

  // Reset if it's a new day
  if (waterData.date !== new Date().toDateString()) {
    waterData = { date: new Date().toDateString(), count: 0 };
    localStorage.setItem('waterIntake', JSON.stringify(waterData));
  }

  const updateWaterUI = () => {
    waterCountEl.textContent = waterData.count;
    if (waterGoalEl) waterGoalEl.textContent = waterGoal;
    const progress = Math.min((waterData.count / waterGoal) * 100, 100);
    progressBarEl.style.width = `${progress}%`;
  };

  addBtn.addEventListener('click', () => {
    waterData.count++;
    localStorage.setItem('waterIntake', JSON.stringify(waterData));
    updateWaterUI();
  });

  removeBtn.addEventListener('click', () => {
    if (waterData.count > 0) {
      waterData.count--;
      localStorage.setItem('waterIntake', JSON.stringify(waterData));
      updateWaterUI();
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      waterData.count = 0;
      localStorage.setItem('waterIntake', JSON.stringify(waterData));
      updateWaterUI();
    });
  }

  if (setGoalBtn && goalInput) {
    setGoalBtn.addEventListener('click', () => {
      const newGoal = parseInt(goalInput.value);
      if (newGoal && newGoal > 0) {
        waterGoal = newGoal;
        localStorage.setItem('waterGoal', waterGoal);
        updateWaterUI();
        goalInput.value = '';
      }
    });
  }

  updateWaterUI();
}

export async function initSleepTracker() {
  const sleepInput = document.getElementById('sleep-input');
  const addSleepBtn = document.getElementById('add-sleep-btn');
  const currentSleepEl = document.getElementById('current-sleep');
  const sleepGoalEl = document.getElementById('sleep-goal');
  const progressBarEl = document.getElementById('sleep-progress-bar');

  if (!sleepInput || !addSleepBtn || !currentSleepEl || !progressBarEl) {
    return;
  }

  const sleepGoal = localStorage.getItem('sleepGoal') || 8;
  if (sleepGoalEl) sleepGoalEl.textContent = sleepGoal;

  const updateSleepUI = async () => {
    const sleepLogs = await getSleepLogs();
    const today = new Date().toDateString();
    const todaySleep = sleepLogs
      .filter(log => new Date(log.date).toDateString() === today)
      .reduce((total, log) => total + log.duration, 0);

    currentSleepEl.textContent = todaySleep;
    const progress = Math.min((todaySleep / sleepGoal) * 100, 100);
    progressBarEl.style.width = `${progress}%`;
  };

  addSleepBtn.addEventListener('click', async () => {
    const duration = parseFloat(sleepInput.value);
    if (duration && duration > 0) {
      await addSleepLog({
        user_id: 1,
        duration: duration,
        date: new Date().toISOString()
      });
      sleepInput.value = '';
      await updateSleepUI();
    }
  });

  await updateSleepUI();
}

export async function initStepTracker() {
  const stepInput = document.getElementById('step-input');
  const addStepBtn = document.getElementById('add-step-btn');
  const currentStepsEl = document.getElementById('current-steps');
  const stepGoalEl = document.getElementById('step-goal');
  const progressBarEl = document.getElementById('step-progress-bar');

  if (!stepInput || !addStepBtn || !currentStepsEl || !progressBarEl) {
    return;
  }

  const stepGoal = localStorage.getItem('stepGoal') || 10000;
  if (stepGoalEl) stepGoalEl.textContent = stepGoal;

  const updateStepUI = async () => {
    const stepLogs = await getStepLogs();
    const today = new Date().toDateString();
    const todaySteps = stepLogs
      .filter(log => new Date(log.date).toDateString() === today)
      .reduce((total, log) => total + log.steps, 0);

    currentStepsEl.textContent = todaySteps.toLocaleString();
    const progress = Math.min((todaySteps / stepGoal) * 100, 100);
    progressBarEl.style.width = `${progress}%`;
  };

  addStepBtn.addEventListener('click', async () => {
    const steps = parseInt(stepInput.value);
    if (steps && steps > 0) {
      await addStepLog({
        user_id: 1,
        steps: steps,
        date: new Date().toISOString()
      });
      stepInput.value = '';
      await updateStepUI();
    }
  });

  await updateStepUI();
}

export function initMoodTracker() {
  const moodBtns = document.querySelectorAll('.mood-btn');
  const moodStatus = document.getElementById('mood-status');
  
  if (!moodBtns.length || !moodStatus) return;

  const today = new Date().toDateString();
  const savedMoodData = JSON.parse(localStorage.getItem('dailyMood')) || {};

  if (savedMoodData.date === today) {
    const selectedBtn = document.querySelector(`.mood-btn[data-mood="${savedMoodData.mood}"]`);
    if (selectedBtn) {
      selectedBtn.classList.add('selected');
      moodStatus.textContent = `You're feeling ${savedMoodData.mood} today!`;
    }
  }

  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.getAttribute('data-mood');
      
      // Update UI
      moodBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      moodStatus.textContent = `You're feeling ${mood} today!`;

      // Save to localStorage
      localStorage.setItem('dailyMood', JSON.stringify({
        date: today,
        mood: mood
      }));
    });
  });
}

async function main() {
  console.log('Wellness initialization started');
  
  // Local storage based trackers - should work even if DB fails
  try {
    initMoodTracker();
    console.log('Mood tracker initialized');
  } catch (err) {
    console.error('Mood tracker initialization failed:', err);
  }

  try {
    initWaterTracker();
    console.log('Water tracker initialized');
  } catch (err) {
    console.error('Water tracker initialization failed:', err);
  }

  // DB based trackers
  try {
    await initDB();
    console.log('DB initialized');
    await initSleepTracker();
    console.log('Sleep tracker initialized');
    await initStepTracker();
    console.log('Step tracker initialized');
  } catch (err) {
    console.error('DB/Sleep/Step tracker initialization failed:', err);
  }
}

// Call main directly as this is a module script
main();
