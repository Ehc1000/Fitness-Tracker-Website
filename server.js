import express from 'express';
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  // In a real application, you would call a generative AI API here.
  // For now, we'll simulate a dynamic response.
  const aiResponse = `You said: "${userMessage}". I am now a little smarter!`;

  res.json({ response: aiResponse });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
