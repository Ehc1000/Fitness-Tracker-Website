import { WorkoutForm } from './components/WorkoutForm.js';
import { WorkoutList, renderWorkouts } from './components/WorkoutList.js';
import { CalorieForm } from './components/CalorieForm.js';
import { CalorieList, renderCalorieLogs } from './components/CalorieList.js';
import { ProgressCharts } from './components/ProgressCharts.js';
import { addWorkout, getWorkouts, initDB, addCalorieLog, getCalorieLogs } from './services/db.js';
import { getFoodCalories } from './services/food.js';
import { MET_VALUES } from './constants.js';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


const app = document.querySelector('#app');
const charts = document.querySelector('#charts');

async function main() {
  try {
    await initDB();

    const workouts = await getWorkouts();
    const calorieLogs = await getCalorieLogs();

    // Forms and Lists
    const app = document.querySelector('#app');
    const workoutForm = WorkoutForm();
    app.appendChild(workoutForm);
    const workoutList = WorkoutList();
    app.appendChild(workoutList);
    renderWorkouts(workouts);

    workoutForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(workoutForm);
      const duration = formData.get('duration');
      const intensity = formData.get('intensity');
      const weight = formData.get('weight');
      const metValue = MET_VALUES[intensity];
      const caloriesBurned = duration * metValue * 3.5 * weight / 200;
      const workout = {
        user_id: 1, // hardcoded for now
        type: formData.get('type'),
        duration: duration,
        intensity: intensity,
        date: new Date().toISOString(),
        calories_burned: caloriesBurned
      };
      await addWorkout(workout);
      const newWorkouts = await getWorkouts();
      renderWorkouts(newWorkouts);
      renderCaloriesBurnedChart(newWorkouts);
      workoutForm.reset();
    });

    const calorieForm = CalorieForm();
    app.appendChild(calorieForm);
    const calorieList = CalorieList();
    app.appendChild(calorieList);
    renderCalorieLogs(calorieLogs);

    calorieForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(calorieForm);
      const foodName = formData.get('food_item');
      const calories = await getFoodCalories(foodName);

      if (calories) {
        const calorieLog = {
          user_id: 1, // hardcoded for now
          food_item: foodName,
          calories: calories,
          date: new Date().toISOString()
        };
        await addCalorieLog(calorieLog);
        const newCalorieLogs = await getCalorieLogs();
        renderCalorieLogs(newCalorieLogs);
        renderCalorieIntakeChart(newCalorieLogs);
        calorieForm.reset();
      } else {
        alert('Could not find calorie information for this food.');
      }
    });

    // Charts
    const chartsContainer = document.querySelector('#charts');
    const progressCharts = ProgressCharts();
    chartsContainer.appendChild(progressCharts);
    renderCaloriesBurnedChart(workouts);
    renderCalorieIntakeChart(calorieLogs);

  } catch (err)
  {
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
