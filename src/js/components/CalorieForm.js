export function CalorieForm() {
  const form = document.createElement('form');
  form.innerHTML = `
    <label for="food_item">Food Item</label>
    <input type="text" id="food_item" name="food_item" required>
    <button type="submit">Add Calorie Log</button>
  `;
  return form;
}
