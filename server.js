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

function getLocalAIResponse(message) {
  for (const category in knowledgeBase) {
    for (const pattern of knowledgeBase[category].patterns) {
      if (pattern.test(message)) {
        return getRandomResponse(knowledgeBase[category].responses);
      }
    }
  }
  return getRandomResponse(defaultResponses);
}

app.post('/api/chat', (req, res) => {
  const userMessage = req.body.message;
  const aiResponse = getLocalAIResponse(userMessage);
  res.json({ response: aiResponse });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
