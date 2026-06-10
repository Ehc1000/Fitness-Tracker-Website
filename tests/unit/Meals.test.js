import { addCalorieLog, getCalorieLogs, initDB } from '../../src/js/services/db.js';

// We need to mock db.js before importing meals.js if meals.js calls initDB immediately
jest.mock('../../src/js/services/db.js', () => ({
  initDB: jest.fn().mockResolvedValue(),
  addCalorieLog: jest.fn().mockResolvedValue(),
  getCalorieLogs: jest.fn().mockResolvedValue([]),
  deleteCalorieLog: jest.fn(),
  updateCalorieLog: jest.fn(),
  clearAllCalorieLogs: jest.fn()
}));

// Mock food.js
jest.mock('../../src/js/services/food.js', () => ({
  getFoodCalories: jest.fn()
}));

// Mock ChatWidget
jest.mock('../../src/js/components/ChatWidget.js', () => {
  return jest.fn().mockImplementation(() => ({}));
});

describe('Meals Page Quick Add', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <main>
        <div id="calorie-goal-container">
          <form id="calorie-goal-form">
            <input type="number" id="calorie-goal-input" />
            <button type="submit">Set Goal</button>
          </form>
          <span id="current-calories">0</span>
          <span id="calorie-goal">2000</span>
          <span id="remaining-calories">2000</span>
          <div id="calorie-progress-bar"></div>
        </div>
        <div id="quick-add-container">
          <button class="quick-add-btn" data-food="Apple" data-calories="95">Add Apple</button>
        </div>
        <div class="loader" hidden></div>
      </main>
    `;
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('should log calories when quick add button is clicked', async () => {
    // Import meals.js to attach listeners
    // Note: meals.js might have side effects on import, so we might need to resetModules
    jest.isolateModules(async () => {
      await import('../../src/js/meals.js');
      
      const appleBtn = document.querySelector('.quick-add-btn[data-food="Apple"]');
      const currentCaloriesEl = document.getElementById('current-calories');

      // Setup mock return for updated logs
      getCalorieLogs.mockResolvedValue([{ food_item: 'Apple', calories: 95, date: new Date().toISOString() }]);

      await appleBtn.click();
      
      // Wait for async operations in click handler
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(addCalorieLog).toHaveBeenCalledWith(expect.objectContaining({
        food_item: 'Apple',
        calories: 95
      }));
      
      expect(currentCaloriesEl.textContent).toBe('95');
    });
  });
});
