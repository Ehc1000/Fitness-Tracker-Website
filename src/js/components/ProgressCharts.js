export function ProgressCharts() {
  const element = document.createElement('div');
  element.innerHTML = `
    <h2>Progress</h2>
    <div class="charts-container">
      <canvas id="caloriesBurnedChart"></canvas>
      <canvas id="calorieIntakeChart"></canvas>
    </div>
  `;
  return element;
}
