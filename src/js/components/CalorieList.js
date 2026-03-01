export function CalorieList() {
  const element = document.createElement('div');
  element.innerHTML = `
    <div id="macro-summary" class="mb-6 p-4 bg-gray-800 rounded-lg text-white">
      <h3 class="text-xl font-bold mb-2">Daily Totals</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <p class="text-gray-400">Calories</p>
          <p id="total-calories" class="text-2xl font-bold">0</p>
        </div>
        <div>
          <p class="text-gray-400">Protein</p>
          <p id="total-protein" class="text-2xl font-bold">0g</p>
        </div>
        <div>
          <p class="text-gray-400">Carbs</p>
          <p id="total-carbs" class="text-2xl font-bold">0g</p>
        </div>
        <div>
          <p class="text-gray-400">Fat</p>
          <p id="total-fat" class="text-2xl font-bold">0g</p>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Calorie Log</h2>
      <button id="clear-all-calories" class="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm hidden">Clear All</button>
    </div>
    <ul id="calorie-list"></ul>
  `;
  return element;
}

export function renderCalorieLogs(calorieLogs) {
  const calorieList = document.querySelector('#calorie-list');
  const clearAllBtn = document.querySelector('#clear-all-calories');
  const totalCalories = calorieLogs.reduce((sum, log) => sum + log.calories, 0);

  document.querySelector('#total-calories').textContent = totalCalories;
  // Placeholders for other macros as data is not available
  document.querySelector('#total-protein').textContent = '0g';
  document.querySelector('#total-carbs').textContent = '0g';
  document.querySelector('#total-fat').textContent = '0g';

  if (calorieLogs.length > 0) {
    clearAllBtn.classList.remove('hidden');
  } else {
    clearAllBtn.classList.add('hidden');
  }

  calorieList.innerHTML = calorieLogs.map(log => `
    <li data-id="${log.id}" class="flex justify-between items-center bg-gray-800 p-3 rounded-lg mb-2">
      <span>${log.food_item} - ${log.calories} calories</span>
      <div>
        <button class="edit bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-xs">Edit</button>
        <button class="delete bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-xs">Delete</button>
      </div>
    </li>
  `).join('');
}
