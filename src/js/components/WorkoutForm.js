export function WorkoutForm() {
  const form = document.createElement('form');
  form.innerHTML = `
    <label for="type">Workout Type</label>
    <input type="text" id="type" name="type" required>
    <label for="duration">Duration (minutes)</label>
    <input type="number" id="duration" name="duration" required min="1">
    <label for="intensity">Intensity</label>
    <select id="intensity" name="intensity" required>
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>
    <label for="weight">Your Weight (kg)</label>
    <input type="number" id="weight" name="weight" required min="1">
    <button type="submit">Add Workout</button>
  `;
  return form;
}
