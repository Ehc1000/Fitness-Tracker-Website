export function CalorieForm() {
  const form = document.createElement('form');
  form.innerHTML = `
    <label for="food_item">Food Item</label>
    <input type="text" id="food_item" name="food_item" required>
    <div id="calorie-input-container" hidden>
      <label for="calories">Calories</label>
      <input type="number" id="calories" name="calories" required min="1">
    </div>
    <button type="submit">Add Log</button>
  `;
  return form;
}
