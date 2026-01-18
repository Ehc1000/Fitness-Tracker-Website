export async function getAIResponse(message) {
  console.log('AI request received for:', message);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("This is a mock AI response. I'll be fully implemented soon!");
    }, 500);
  });
}
