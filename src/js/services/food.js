const API_KEY = 'DEMO_KEY';
const API_URL = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${API_KEY}`;

function getRelevantNutrient(nutrients, nutrientName, unitName) {
  return nutrients.find(n => n.nutrientName === nutrientName && n.unitName === unitName);
}

function processFood(food) {
  const nutrients = food.foodNutrients;
  const calorieNutrient = getRelevantNutrient(nutrients, 'Energy', 'KCAL');
  if (calorieNutrient) {
    return calorieNutrient.value;
  }
  return null;
}

export async function getFoodCalories(foodName) {
  let response = await fetch(`${API_URL}&query=${foodName}&dataType=Foundation,SR Legacy`);
  let data = await response.json();

  if (data.foods && data.foods.length > 0) {
    for (const food of data.foods) {
      const calories = processFood(food);
      if (calories) {
        return calories;
      }
    }
  } else {
    // If no results, try adding ", raw" to the query
    response = await fetch(`${API_URL}&query=${foodName},%20raw&dataType=Foundation,SR Legacy`);
    data = await response.json();
    if (data.foods && data.foods.length > 0) {
      for (const food of data.foods) {
        const calories = processFood(food);
        if (calories) {
          return calories;
        }
      }
    }
  }

  return null;
}
