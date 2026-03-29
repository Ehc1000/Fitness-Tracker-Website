import WeightTracker from '../../src/js/components/WeightTracker.js';
import { getWeightLogs, addWeightLog } from '../../src/js/services/db.js';

// Mock the db service
jest.mock('../../src/js/services/db.js', () => ({
  getWeightLogs: jest.fn(),
  addWeightLog: jest.fn()
}));

describe('WeightTracker Component', () => {
  let weightTracker;
  const containerId = 'test-container';

  beforeEach(() => {
    document.body.innerHTML = `<div id="${containerId}"></div>`;
    getWeightLogs.mockResolvedValue([]);
    addWeightLog.mockResolvedValue();
    localStorage.clear();
    weightTracker = new WeightTracker(containerId);
  });

  it('should render correctly', () => {
    expect(document.getElementById('weight-tracker')).toBeTruthy();
    expect(document.getElementById('height-input')).toBeTruthy();
    expect(document.getElementById('weight-input')).toBeTruthy();
    expect(document.getElementById('add-weight-btn')).toBeTruthy();
  });

  it('should store and retrieve height from localStorage', () => {
    const heightInput = document.getElementById('height-input');
    heightInput.value = '180';
    heightInput.dispatchEvent(new Event('change'));

    expect(localStorage.getItem('userHeight')).toBe('180');
    expect(weightTracker.height).toBe('180');
  });

  it('should calculate BMI correctly when weight and height are present', async () => {
    getWeightLogs.mockResolvedValue([{ weight: 70, date: new Date().toISOString() }]);
    weightTracker.height = '175';
    
    await weightTracker.calculateBMI();
    
    const bmiResult = document.getElementById('bmi-result');
    // BMI = 70 / (1.75 * 1.75) = 22.857... -> 22.9
    expect(bmiResult.innerHTML).toContain('22.9');
    expect(bmiResult.innerHTML).toContain('Normal');
  });

  it('should show underweight category for low BMI', async () => {
    getWeightLogs.mockResolvedValue([{ weight: 50, date: new Date().toISOString() }]);
    weightTracker.height = '180';
    
    await weightTracker.calculateBMI();
    
    const bmiResult = document.getElementById('bmi-result');
    // BMI = 50 / (1.8 * 1.8) = 15.43...
    expect(bmiResult.innerHTML).toContain('15.4');
    expect(bmiResult.innerHTML).toContain('Underweight');
  });

  it('should show overweight category for high BMI', async () => {
    getWeightLogs.mockResolvedValue([{ weight: 90, date: new Date().toISOString() }]);
    weightTracker.height = '180';
    
    await weightTracker.calculateBMI();
    
    const bmiResult = document.getElementById('bmi-result');
    // BMI = 90 / (1.8 * 1.8) = 27.77...
    expect(bmiResult.innerHTML).toContain('27.8');
    expect(bmiResult.innerHTML).toContain('Overweight');
  });
});
