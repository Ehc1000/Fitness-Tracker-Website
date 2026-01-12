import { ProgressCharts } from './components/ProgressCharts.js';
import { getWorkouts, getCalorieLogs, initDB } from './services/db.js';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);



async function main() {
  try {
    await initDB();
    const workouts = await getWorkouts();
    const calorieLogs = await getCalorieLogs();

    // Charts
    const chartsContainer = document.querySelector('#charts');
    if (chartsContainer) {
      if (!document.getElementById('caloriesBurnedChart')) {
        const progressCharts = ProgressCharts();
        chartsContainer.appendChild(progressCharts);
      }
      renderCaloriesBurnedChart(workouts);
      renderCalorieIntakeChart(calorieLogs);
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred. Check the console for details.');
  }
}

let caloriesBurnedChart;
function renderCaloriesBurnedChart(workouts) {
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
function renderCalorieIntakeChart(calorieLogs) {
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

main();

window.addEventListener('pageshow', main);
