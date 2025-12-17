const API_KEY = 'DEMO_KEY';
const API_URL = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${API_KEY}&dataType=Branded`;

export async function getFoodCalories(foodName) {
  const response = await fetch(`${API_URL}&query=${foodName}`);
  const data = await response.json();

  if (data.foods && data.foods.length > 0) {
    const food = data.foods[0];
    const nutrients = food.foodNutrients;
    const calorieNutrient = nutrients.find(n => n.nutrientName === 'Energy' && n.unitName === 'KCAL');
    if (calorieNutrient) {
      return calorieNutrient.value;
    }
  }
  return null;
}
