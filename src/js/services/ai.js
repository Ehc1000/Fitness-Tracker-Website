export async function getAIResponse(message, context = {}) {
  console.log('Sending message to AI backend:', message, 'with context:', context);
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, ...context }),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting AI response:', error);
    return { response: 'Sorry, something went wrong. Please try again.' };
  }
}
