import { CalorieList, renderCalorieLogs } from '../../src/js/components/CalorieList.js';
import { WorkoutList, renderWorkouts } from '../../src/js/components/WorkoutList.js';

describe('CalorieList Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '<main></main>';
    const main = document.querySelector('main');
    main.appendChild(CalorieList());
  });

  it('should render the "Clear All" button as hidden when there are no logs', () => {
    renderCalorieLogs([]);
    const clearAllBtn = document.getElementById('clear-all-calories');
    expect(clearAllBtn.classList.contains('hidden')).toBe(true);
  });

  it('should render the "Clear All" button when there are logs', () => {
    renderCalorieLogs([{ id: 1, food_item: 'Apple', calories: 95 }]);
    const clearAllBtn = document.getElementById('clear-all-calories');
    expect(clearAllBtn.classList.contains('hidden')).toBe(false);
  });
});

describe('WorkoutList Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '<main></main>';
    const main = document.querySelector('main');
    main.appendChild(WorkoutList());
  });

  it('should render the "Clear All" button as hidden when there are no workouts', () => {
    renderWorkouts([]);
    const clearAllBtn = document.getElementById('clear-all-workouts');
    expect(clearAllBtn.classList.contains('hidden')).toBe(true);
  });

  it('should render the "Clear All" button when there are workouts', () => {
    renderWorkouts([{ id: 1, type: 'Running', duration: 30, intensity: 'moderate', calories_burned: 300 }]);
    const clearAllBtn = document.getElementById('clear-all-workouts');
    expect(clearAllBtn.classList.contains('hidden')).toBe(false);
  });
});
