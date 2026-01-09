export function CalorieList() {
  const element = document.createElement('div');
  element.innerHTML = '<h2>Calorie Log</h2><ul id="calorie-list"></ul>';
  return element;
}

export function renderCalorieLogs(calorieLogs) {
  const calorieList = document.querySelector('#calorie-list');
  calorieList.innerHTML = calorieLogs.map(log => `
    <li data-id="${log.id}">
      ${log.food_item} - ${log.calories} calories
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </li>
  `).join('');
}
