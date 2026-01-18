import { WorkoutForm } from './components/WorkoutForm.js';
import { WorkoutList, renderWorkouts } from './components/WorkoutList.js';
import { addWorkout, getWorkouts, initDB, deleteWorkout, updateWorkout } from './services/db.js';
import { MET_VALUES } from './constants.js';
import ChatWidget from './components/ChatWidget.js';

const app = document.querySelector('main');
const loader = document.querySelector('.loader');

async function main() {
  loader.hidden = false;
  try {
    await initDB();
    let workouts = await getWorkouts();
    new ChatWidget();

    const workoutForm = WorkoutForm();
    app.appendChild(workoutForm);
    const workoutListContainer = WorkoutList();
    app.appendChild(workoutListContainer);
    const workoutList = document.getElementById('workout-list');
    renderWorkouts(workouts);

    workoutList.addEventListener('click', async (event) => {
      const target = event.target;
      if (target.classList.contains('delete')) {
        const workoutId = target.parentElement.dataset.id;
        loader.hidden = false;
        try {
          await deleteWorkout(workoutId);
          workouts = await getWorkouts();
          renderWorkouts(workouts);
        } finally {
          loader.hidden = true;
        }
      } else if (target.classList.contains('edit')) {
        const workoutId = target.parentElement.dataset.id;
        const workout = workouts.find(w => w.id == workoutId);
        if (workout) {
          workoutForm.querySelector('input[name="type"]').value = workout.type;
          workoutForm.querySelector('input[name="duration"]').value = workout.duration;
          workoutForm.querySelector('select[name="intensity"]').value = workout.intensity;
          workoutForm.dataset.editId = workoutId;
          workoutForm.querySelector('button[type="submit"]').textContent = 'Update Workout';
        }
      }
    });

    workoutForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      loader.hidden = false;
      try {
        const formData = new FormData(workoutForm);
        const duration = formData.get('duration');
        const intensity = formData.get('intensity');
        const weight = formData.get('weight');
        const metValue = MET_VALUES[intensity];
        const caloriesBurned = duration * metValue * 3.5 * weight / 200;
        const workoutId = workoutForm.dataset.editId;

        if (workoutId) {
          const workout = {
            id: workoutId,
            type: formData.get('type'),
            duration: duration,
            intensity: intensity,
            date: new Date().toISOString(),
            calories_burned: caloriesBurned
          };
          await updateWorkout(workout);
          delete workoutForm.dataset.editId;
          workoutForm.querySelector('button[type="submit"]').textContent = 'Add Workout';
        } else {
          const workout = {
            user_id: 1, // hardcoded for now
            type: formData.get('type'),
            duration: duration,
            intensity: intensity,
            date: new Date().toISOString(),
            calories_burned: caloriesBurned
          };
          await addWorkout(workout);
        }
        
        workouts = await getWorkouts();
        renderWorkouts(workouts);
        workoutForm.reset();
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
main();
