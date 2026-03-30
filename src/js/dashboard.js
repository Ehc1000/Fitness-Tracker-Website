import { ProgressCharts } from './components/ProgressCharts.js';
import Quote from './components/Quote.js';
import { getWorkouts, getCalorieLogs, initDB } from './services/db.js';
import { Chart, registerables } from 'chart.js';
import ChatWidget from './components/ChatWidget.js';
import WeightTracker from './components/WeightTracker.js';
Chart.register(...registerables);

export function updateCalorieProgressDashboard(calorieLogs) {
  const calorieGoal = localStorage.getItem('calorieGoal') || 2000;
  const currentCalories = calorieLogs
    .filter(log => new Date(log.date).toDateString() === new Date().toDateString())
    .reduce((total, log) => total + log.calories, 0);

  const currentCaloriesEl = document.getElementById('current-calories-dashboard');
  const calorieGoalEl = document.getElementById('calorie-goal-dashboard');
  const remainingCaloriesEl = document.getElementById('remaining-calories-dashboard');
  const progressBarEl = document.getElementById('calorie-progress-bar-dashboard');

  if (currentCaloriesEl && calorieGoalEl && progressBarEl) {
    currentCaloriesEl.textContent = currentCalories;
    calorieGoalEl.textContent = calorieGoal;

    if (remainingCaloriesEl) {
      const remaining = Math.max(0, calorieGoal - currentCalories);
      remainingCaloriesEl.textContent = remaining;
    }

    const progress = Math.min((currentCalories / calorieGoal) * 100, 100);
    progressBarEl.style.width = `${progress}%`;
  }
}

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

export async function main() {
  console.log('Main function started');
  try {
    await initDB();
    console.log('DB initialized');
    const workouts = await getWorkouts();
    const calorieLogs = await getCalorieLogs();
    console.log('Workouts and calorie logs fetched', { workouts, calorieLogs });
    
    try {
      new ChatWidget();
    } catch (e) { console.error('Error initializing ChatWidget:', e); }

    // Quote of the day
    try {
      const quote = new Quote();
      const quoteElement = quote.render();
      document.querySelector('main').prepend(quoteElement);
    } catch (e) { console.error('Error initializing Quote:', e); }

    // Calorie progress
    try {
      updateCalorieProgressDashboard(calorieLogs);
    } catch (e) { console.error('Error updating Calorie Progress:', e); }

    // Water tracker
    try {
      initWaterTracker();
    } catch (e) { console.error('Error initializing Water Tracker:', e); }

    // Weight tracker
    try {
      new WeightTracker('weight-tracker-container');
    } catch (e) { console.error('Error initializing Weight Tracker:', e); }

    // Charts
    try {
      const chartsContainer = document.querySelector('#charts');
      console.log('Charts container:', chartsContainer);
      if (chartsContainer) {
        if (!document.getElementById('caloriesBurnedChart')) {
          console.log('Chart canvas not found, creating it');
          const progressCharts = ProgressCharts();
          chartsContainer.appendChild(progressCharts);
        }
        renderCaloriesBurnedChart(workouts);
        renderCalorieIntakeChart(calorieLogs);
      }
    } catch (e) { console.error('Error rendering Charts:', e); }

    const setGoalBtn = document.getElementById('set-goal-btn');
    if (setGoalBtn) {
      setGoalBtn.addEventListener('click', async () => {
        const goalInput = document.getElementById('calorie-goal-input');
        const newGoal = goalInput ? goalInput.value : null;
        if (newGoal) {
          localStorage.setItem('calorieGoal', newGoal);
          const calorieLogs = await getCalorieLogs();
          updateCalorieProgressDashboard(calorieLogs);
          goalInput.value = '';
        }
      });
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred. Check the console for details.');
  }
  console.log('Main function finished');
}

let caloriesBurnedChart;
export function renderCaloriesBurnedChart(workouts) {
  console.log('Rendering calories burned chart', workouts);
  const ctx = document.getElementById('caloriesBurnedChart').getContext('2d');
  const labels = workouts.map(w => `${new Date(w.date).toLocaleDateString()} - ${w.type}`);
  const data = workouts.map(w => w.calories_burned);

  if (caloriesBurnedChart) {
    caloriesBurnedChart.destroy();
  }

  caloriesBurnedChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Calories Burned',
        data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    }
  });
}

let calorieIntakeChart;
export function renderCalorieIntakeChart(calorieLogs) {
  console.log('Rendering calorie intake chart', calorieLogs);
  const ctx = document.getElementById('calorieIntakeChart').getContext('2d');
  const labels = calorieLogs.map(l => `${new Date(l.date).toLocaleDateString()} - ${l.food_item}`);
  const data = calorieLogs.map(l => l.calories);

  if (calorieIntakeChart) {
    calorieIntakeChart.destroy();
  }

  calorieIntakeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Calorie Intake',
        data,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    }
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  await main();
});
