import { WorkoutForm } from '../../src/js/components/WorkoutForm.js';

describe('WorkoutForm', () => {
  it('should render the workout form', () => {
    const form = WorkoutForm();
    expect(form).not.toBeNull();
    expect(form.innerHTML).toContain('<label for="type">Workout Type</label>');
    expect(form.innerHTML).toContain('<input type="text" id="type" name="type" required="">');
    expect(form.innerHTML).toContain('<label for="duration">Duration (minutes)</label>');
    expect(form.innerHTML).toContain('<input type="number" id="duration" name="duration" required="">');
    expect(form.innerHTML).toContain('<label for="intensity">Intensity</label>');
    expect(form.innerHTML).toContain('<select id="intensity" name="intensity" required="">');
    expect(form.innerHTML).toContain('<button type="submit">Add Workout</button>');
  });
});
