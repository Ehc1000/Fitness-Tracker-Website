import { CalorieForm } from '../../src/js/components/CalorieForm.js';

describe('CalorieForm', () => {
  it('should render the calorie form', () => {
    const form = CalorieForm();
    expect(form).not.toBeNull();
    expect(form.innerHTML).toContain('<label for="food_item">Food Item</label>');
    expect(form.innerHTML).toContain('<input type="text" id="food_item" name="food_item" required="">');
    expect(form.innerHTML).toContain('<label for="calories">Calories</label>');
    expect(form.innerHTML).toContain('<input type="number" id="calories" name="calories" required="">');
    expect(form.innerHTML).toContain('<button type="submit">Add Calorie Log</button>');
  });
});
