import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// A more "intelligent" local AI knowledge base
const knowledgeBase = {
  greetings: {
    patterns: [/hello/i, /hi/i, /hey/i, /good morning/i, /good afternoon/i],
    responses: ["Hello! I'm Sparky, your AI fitness assistant. How can I help you today?", "Hi there! Ready to crush some fitness goals?", "Hey! What's on your mind?"],
  },
  workouts: {
    patterns: [/workout/i, /exercise/i, /routine/i, /training/i],
    responses: [
      "For a great full-body workout, try a circuit of squats, push-ups, and planks. 3 rounds, 1 minute each!",
      "How about a 20-minute HIIT session? It's a fantastic way to burn calories and boost your metabolism.",
      "Cardio is key! A 30-minute run, bike ride, or brisk walk can do wonders.",
      "Looking for something specific? Ask me about exercises for legs, arms, or abs!"
    ],
  },
  nutrition: {
    patterns: [/calories/i, /nutrition/i, /diet/i, /food/i, /eat/i, /snacks/i],
    responses: [
      "A balanced diet is crucial. Make sure you're getting a good mix of protein, carbs, and healthy fats.",
      "For healthy snacks, consider fruits, nuts, yogurt, or veggies with hummus.",
      "An apple has about 95 calories. A banana has about 105. Great choices for a pre-workout boost!",
      "Staying hydrated is just as important as eating right. Are you drinking enough water?"
    ],
  },
  farewells: {
    patterns: [/bye/i, /goodbye/i, /see you/i, /later/i],
    responses: ["Goodbye! Keep up the great work.", "Catch you later! Stay active.", "Bye! Remember, consistency is key."],
  },
  gratitude: {
    patterns: [/thanks/i, /thank you/i],
    responses: ["You're welcome!", "Happy to help!", "Any time! What's next?"],
  },
};

const defaultResponses = [
  "I'm not sure how to answer that, but I'm always learning. Try asking me about workouts or nutrition.",
  "That's a great question. For now, I'm focused on helping you with your fitness journey.",
  "Interesting! Let's get back to your fitness goals. What would you like to work on?",
];

function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

function getLocalAIResponse(message, memories = [], history = [], stats = {}) {
  // Check for memory-learning patterns
  const nameMatch = message.match(/my name is ([\w\s]+)/i);
  if (nameMatch) {
    const name = nameMatch[1].trim();
    return {
      response: `Nice to meet you, ${name}! I've remembered your name.`,
      remember: { key: 'name', value: name }
    };
  }

  const preferenceMatch = message.match(/i (?:love|like|prefer) ([\w\s]+)/i);
  if (preferenceMatch) {
    const preference = preferenceMatch[1].trim();
    return {
      response: `I've noted that you like ${preference}. I'll use this to tailor my suggestions!`,
      remember: { key: 'preference', value: preference }
    };
  }

  // Check for progress-related questions
  if (message.match(/how (?:am i doing|is my progress|are my stats)/i) || message.match(/summary/i)) {
    const { workoutCount = 0, totalCaloriesBurned = 0, recentWorkout = 'none' } = stats;
    let response = `You've completed ${workoutCount} workouts so far, burning a total of ${Math.round(totalCaloriesBurned)} calories. `;
    if (recentWorkout !== 'none') {
      response += `Your last workout was ${recentWorkout}. Keep it up!`;
    } else {
      response += `You haven't logged any workouts yet. Why not start today?`;
    }
    return { response };
  }

  // Use memories to personalize
  const nameMemory = memories.find(m => m.key === 'name');
  const greetingPrefix = nameMemory ? `Hello again, ${nameMemory.value}! ` : '';

  for (const category in knowledgeBase) {
    for (const pattern of knowledgeBase[category].patterns) {
      if (pattern.test(message)) {
        let response = getRandomResponse(knowledgeBase[category].responses);
        if (category === 'greetings' && nameMemory) {
          response = greetingPrefix + response;
        }
        return { response };
      }
    }
  }

  // Personalization for general questions if we have preferences
  const preferences = memories.filter(m => m.key === 'preference').map(m => m.value);
  if (preferences.length > 0 && (message.includes('suggest') || message.includes('what'))) {
    const pref = getRandomResponse(preferences);
    return { response: `Since you mentioned you like ${pref}, maybe you should try something related to that today!` };
  }

  return { response: getRandomResponse(defaultResponses) };
}

app.post('/api/chat', (req, res) => {
  console.log('Incoming chat request:', req.body);
  const { message, memories, history, stats } = req.body;
  const result = getLocalAIResponse(message, memories, history, stats);
  console.log('AI response:', result);
  res.json(result);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
