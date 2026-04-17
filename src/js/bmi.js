import WeightTracker from './components/WeightTracker.js';
import { initDB } from './services/db.js';
import ChatWidget from './components/ChatWidget.js';

const loader = document.querySelector('.loader');

async function main() {
  if (loader) loader.hidden = false;
  try {
    await initDB();
    new ChatWidget();
    new WeightTracker('weight-tracker-container');
  } catch (err) {
    console.error('BMI error:', err);
    alert('An error occurred. Check the console for details.');
  } finally {
    if (loader) loader.hidden = true;
  }
}

main();
