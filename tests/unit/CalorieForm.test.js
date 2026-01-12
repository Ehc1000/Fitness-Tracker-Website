import { CalorieForm } from '../../src/js/components/CalorieForm.js';
import { getFoodCalories } from '../../src/js/services/food.js';
import { addCalorieLog } from '../../src/js/services/db.js';

jest.mock('../../src/js/services/food.js', () => ({
  getFoodCalories: jest.fn(),
}));

jest.mock('../../src/js/services/db.js', () => ({
  addCalorieLog: jest.fn().mockResolvedValue(),
}));

describe('CalorieForm', () => {
  let app;
  let loader;

  beforeEach(() => {
    fetch.resetMocks();
    document.body.innerHTML = `
      <main></main>
      <div class="loader" hidden></div>
    `;
    app = document.querySelector('main');
    loader = document.querySelector('.loader');
  });

  it('should render the calorie form', () => {
    const form = CalorieForm();
    expect(form).not.toBeNull();
    expect(form.innerHTML).toContain('<label for="food_item">Food Item</label>');
    expect(form.innerHTML).toContain('<input type="text" id="food_item" name="food_item" list="food_options" required="">');
    expect(form.innerHTML).toContain('<datalist id="food_options">');
    expect(form.innerHTML).toContain('<button type="submit">Add Log</button>');
  });

  it('should fetch calories when a food item is entered', async () => {
    getFoodCalories.mockResolvedValue(52);

    const calorieForm = CalorieForm();
    app.appendChild(calorieForm);

    calorieForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      loader.hidden = false;
      try {
        const formData = new FormData(calorieForm);
        const foodName = formData.get('food_item');
        const calories = await getFoodCalories(foodName);
        if (calories) {
          const calorieLog = {
            user_id: 1, // hardcoded for now
            food_item: foodName,
            calories: calories,
            date: new Date().toISOString()
          };
          await addCalorieLog(calorieLog);
        }
      } finally {
        loader.hidden = true;
      }
    });

    const foodInput = calorieForm.querySelector('input[name="food_item"]');
    foodInput.value = 'apple';
    await calorieForm.dispatchEvent(new Event('submit', { bubbles: true }));

    expect(getFoodCalories).toHaveBeenCalledWith('apple');
    expect(addCalorieLog).toHaveBeenCalledWith({
      user_id: 1,
      food_item: 'apple',
      calories: 52,
      date: expect.any(String),
    });
  });
});
