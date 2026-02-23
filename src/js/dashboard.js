import { ProgressCharts } from './components/ProgressCharts.js';
import Quote from './components/Quote.js';
import { getWorkouts, getCalorieLogs, initDB } from './services/db.js';
import { Chart, registerables } from 'chart.js';
import ChatWidget from './components/ChatWidget.js';
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

export async function main() {
  console.log('Main function started');
  try {
    await initDB();
    console.log('DB initialized');
    const workouts = await getWorkouts();
    const calorieLogs = await getCalorieLogs();
    console.log('Workouts and calorie logs fetched', { workouts, calorieLogs });
    new ChatWidget();

    // Quote of the day
    const quote = new Quote();
    const quoteElement = quote.render();
    document.querySelector('main').prepend(quoteElement);

    // Calorie progress
    updateCalorieProgressDashboard(calorieLogs);

    // Charts
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
    document.getElementById('set-goal-btn').addEventListener('click', async () => {
      const newGoal = document.getElementById('calorie-goal-input').value;
      if (newGoal) {
        localStorage.setItem('calorieGoal', newGoal);
        const calorieLogs = await getCalorieLogs();
        updateCalorieProgressDashboard(calorieLogs);
        document.getElementById('calorie-goal-input').value = '';
      }
    });
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
