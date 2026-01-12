import { foodItems } from '../services/foodItems.js';

export function CalorieForm() {
  const form = document.createElement('form');
  form.innerHTML = `
    <label for="food_item">Food Item</label>
    <input type="text" id="food_item" name="food_item" list="food_options" required>
    <datalist id="food_options"></datalist>
    <div id="calorie-input-container" hidden>
      <label for="calories">Calories</label>
      <input type="number" id="calories" name="calories" required min="1">
    </div>
    <button type="submit">Add Log</button>
  `;

  const foodInput = form.querySelector('#food_item');
  const foodOptions = form.querySelector('#food_options');

  const populateDatalist = (filter = '') => {
    foodOptions.innerHTML = '';
    const filteredItems = foodItems.filter(item => item.toLowerCase().includes(filter.toLowerCase()));
    filteredItems.forEach(item => {
      const option = document.createElement('option');
      option.value = item;
      foodOptions.appendChild(option);
    });
  };

  populateDatalist();

  foodInput.addEventListener('input', () => {
    populateDatalist(foodInput.value);
  });

  return form;
}
