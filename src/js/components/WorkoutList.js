export function WorkoutList() {
  const element = document.createElement('div');
  element.innerHTML = '<h2>Workout History</h2><ul id="workout-list"></ul>';
  return element;
}

export function renderWorkouts(workouts) {
  const workoutList = document.querySelector('#workout-list');
  workoutList.innerHTML = workouts.map(workout => `
    <li data-id="${workout.id}">
      ${workout.type} - ${workout.duration} minutes - ${workout.intensity} - ${Math.round(workout.calories_burned)} calories burned
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </li>
  `).join('');
}
