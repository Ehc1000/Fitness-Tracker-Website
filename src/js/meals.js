import { CalorieForm } from './components/CalorieForm.js';
import { CalorieList, renderCalorieLogs as originalRenderCalorieLogs } from './components/CalorieList.js';
import { addCalorieLog, getCalorieLogs, initDB, deleteCalorieLog, updateCalorieLog } from './services/db.js';
import { getFoodCalories } from './services/food.js';
import ChatWidget from './components/ChatWidget.js';

const app = document.querySelector('main');
const loader = document.querySelector('.loader');
let calorieLogs = [];

function updateCalorieProgress() {
  const calorieGoal = localStorage.getItem('calorieGoal') || 2000;
  const currentCalories = calorieLogs
    .filter(log => new Date(log.date).toDateString() === new Date().toDateString())
    .reduce((total, log) => total + log.calories, 0);

  document.getElementById('current-calories').textContent = currentCalories;
  document.getElementById('calorie-goal').textContent = calorieGoal;

  const progress = Math.min((currentCalories / calorieGoal) * 100, 100);
  document.getElementById('calorie-progress-bar').style.width = `${progress}%`;
}

function renderCalorieLogs(logs) {
  originalRenderCalorieLogs(logs);
  updateCalorieProgress();
}

function loadCalorieGoal() {
  const calorieGoal = localStorage.getItem('calorieGoal');
  if (calorieGoal) {
    document.getElementById('calorie-goal-input').value = calorieGoal;
    updateCalorieProgress();
  }
}

async function main() {
  loader.hidden = false;
  try {
    await initDB();
    calorieLogs = await getCalorieLogs();
    new ChatWidget();

    const calorieGoalForm = document.getElementById('calorie-goal-form');
    calorieGoalForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const goal = document.getElementById('calorie-goal-input').value;
      if (goal && !isNaN(goal)) {
        localStorage.setItem('calorieGoal', goal);
        updateCalorieProgress();
        alert('Calorie goal updated!');
      } else {
        alert('Please enter a valid number for the calorie goal.');
      }
    });

    const calorieForm = CalorieForm();
    app.appendChild(calorieForm);
    const calorieListContainer = CalorieList();
    app.appendChild(calorieListContainer);
    const calorieList = document.getElementById('calorie-list');
    const calorieInputContainer = document.getElementById('calorie-input-container');
    renderCalorieLogs(calorieLogs);
    loadCalorieGoal();

    calorieList.addEventListener('click', async (event) => {
      const target = event.target;
      if (target.classList.contains('delete')) {
        const logId = target.parentElement.dataset.id;
        loader.hidden = false;
        try {
          await deleteCalorieLog(logId);
          calorieLogs = await getCalorieLogs();
          renderCalorieLogs(calorieLogs);
        } finally {
          loader.hidden = true;
        }
      } else if (target.classList.contains('edit')) {
        const logId = target.parentElement.dataset.id;
        const log = calorieLogs.find(l => l.id == logId);
        if (log) {
          calorieForm.querySelector('input[name="food_item"]').value = log.food_item;
          calorieForm.querySelector('input[name="calories"]').value = log.calories;
          calorieInputContainer.hidden = false;
          calorieForm.dataset.editId = logId;
          calorieForm.querySelector('button[type="submit"]').textContent = 'Update Log';
        }
      }
    });

    calorieForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      loader.hidden = false;
      try {
        const formData = new FormData(calorieForm);
        const foodName = formData.get('food_item');
        const logId = calorieForm.dataset.editId;

        if (logId) {
          const calorieLog = {
            id: logId,
            food_item: foodName,
            calories: formData.get('calories'),
            date: new Date().toISOString()
          };
          await updateCalorieLog(calorieLog);
          delete calorieForm.dataset.editId;
          calorieForm.querySelector('button[type="submit"]').textContent = 'Add Log';
          calorieInputContainer.hidden = true;
        } else {
          const calories = await getFoodCalories(foodName);
          if (calories) {
            const calorieLog = {
              user_id: 1, // hardcoded for now
              food_item: foodName,
              calories: calories,
              date: new Date().toISOString()
            };
            await addCalorieLog(calorieLog);
          } else {
            alert('Could not find calorie information for this food.');
          }
        }

        calorieLogs = await getCalorieLogs();
        renderCalorieLogs(calorieLogs);
        calorieForm.reset();
      } finally {
        loader.hidden = true;
      }
    });
  } catch (err) {
    console.error(err);
    alert('An error occurred. Check the console for details.');
  } finally {
    loader.hidden = true;
  }
}

main();

