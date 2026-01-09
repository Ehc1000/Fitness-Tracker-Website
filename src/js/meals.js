import { CalorieForm } from './components/CalorieForm.js';
import { CalorieList, renderCalorieLogs } from './components/CalorieList.js';
import { addCalorieLog, getCalorieLogs, initDB, deleteCalorieLog, updateCalorieLog } from './services/db.js';
import { getFoodCalories } from './services/food.js';

const app = document.querySelector('main');
const loader = document.querySelector('.loader');

async function main() {
  loader.hidden = false;
  try {
    await initDB();
    let calorieLogs = await getCalorieLogs();

    const calorieForm = CalorieForm();
    app.appendChild(calorieForm);
    const calorieListContainer = CalorieList();
    app.appendChild(calorieListContainer);
    const calorieList = document.getElementById('calorie-list');
    const calorieInputContainer = document.getElementById('calorie-input-container');
    renderCalorieLogs(calorieLogs);

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
