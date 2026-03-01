export function WorkoutList() {
  const element = document.createElement('div');
  element.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Workout History</h2>
      <button id="clear-all-workouts" class="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm hidden">Clear All</button>
    </div>
    <ul id="workout-list"></ul>
  `;
  return element;
}

export function renderWorkouts(workouts) {
  const workoutList = document.querySelector('#workout-list');
  const clearAllBtn = document.querySelector('#clear-all-workouts');

  if (workouts.length > 0) {
    clearAllBtn.classList.remove('hidden');
  } else {
    clearAllBtn.classList.add('hidden');
  }

  workoutList.innerHTML = workouts.map(workout => `
    <li data-id="${workout.id}">
      ${workout.type} - ${workout.duration} minutes - ${workout.intensity} - ${Math.round(workout.calories_burned)} calories burned
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </li>
  `).join('');
}
