import express from 'express';
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  let aiResponse;

  switch (userMessage) {
    case 'Suggest a workout':
      aiResponse = 'How about a 20-minute HIIT workout? It includes jumping jacks, push-ups, squats, and burpees. Remember to warm up first!';
      break;
    case 'How many calories in an apple?':
      aiResponse = 'A medium-sized apple has about 95 calories.';
      break;
    case 'What are some healthy snacks?':
      aiResponse = 'Some healthy snacks include almonds, yogurt, berries, or a piece of dark chocolate.';
      break;
    default:
      aiResponse = `I'm not sure how to answer that yet, but I'm learning! You said: "${userMessage}"`;
      break;
  }

  res.json({ response: aiResponse });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
