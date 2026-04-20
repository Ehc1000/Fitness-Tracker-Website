import { getAIResponse } from '../services/ai.js';
import { addUserMemory, getUserMemories, getWorkouts, getCalorieLogs } from '../services/db.js';

class ChatWidget {
  constructor() {
    console.log('ChatWidget constructor called');
    this.isOpen = false;
    this.firstOpen = true;
    this.memories = [];
    this.history = [];
    this.userId = 1; // hardcoded for now
    this.render();
    this.setupEventListeners();
    
    // Small delay to ensure DB is definitely ready even if there's some race condition
    setTimeout(() => {
      this.loadMemories();
    }, 500);
  }

  async loadMemories() {
    console.log('ChatWidget: loadMemories called');
    try {
      this.memories = await getUserMemories(this.userId);
      console.log('ChatWidget: Loaded memories:', this.memories);
    } catch (e) {
      console.error('ChatWidget: Failed to load memories:', e);
    }
  }

  render() {
    this.chatIcon = document.createElement('div');
    this.chatIcon.classList.add('chat-icon');
    this.chatIcon.innerHTML = '💬';

    this.chatWindow = document.createElement('div');
    this.chatWindow.classList.add('chat-window');
    this.chatWindow.innerHTML = `
      <div class="chat-header">
        <h2>AI Assistant</h2>
        <button class="close-chat">&times;</button>
      </div>
      <div class="chat-body">
        <div class="chat-messages"></div>
      </div>
      <div class="chat-footer">
        <div class="quick-replies"></div>
        <input type="text" id="chat-input" placeholder="Ask a question...">
        <button id="send-chat">Send</button>
      </div>
    `;

    document.body.appendChild(this.chatIcon);
    document.body.appendChild(this.chatWindow);
  }

  setupEventListeners() {
    this.chatIcon.addEventListener('click', () => this.toggleChatWindow());
    this.chatWindow.querySelector('.close-chat').addEventListener('click', () => this.toggleChatWindow());
    this.chatWindow.querySelector('#send-chat').addEventListener('click', () => this.sendMessage());
    this.chatWindow.querySelector('#chat-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
  }

  toggleChatWindow() {
    this.isOpen = !this.isOpen;
    this.chatWindow.style.display = this.isOpen ? 'flex' : 'none';
    this.chatIcon.style.display = this.isOpen ? 'none' : 'block';

    if (this.isOpen && this.firstOpen) {
      this.firstOpen = false;
      this.addMessage("Hello! I'm your AI fitness assistant. Ask me anything about workouts, nutrition, or your fitness goals.", 'ai');
      this.renderQuickReplies();
    }
  }

  async sendMessage(message) {
    const input = this.chatWindow.querySelector('#chat-input');
    const messageToSend = message || input.value.trim();
    if (!messageToSend) return;

    this.addMessage(messageToSend, 'user');
    this.history.push({ role: 'user', content: messageToSend });
    
    if(!message) input.value = '';

    this.setTypingIndicator(true);

    try {
      console.log('Fetching stats for AI context...');
      const workouts = await getWorkouts();
      const calorieLogs = await getCalorieLogs();
      
      const stats = {
        workoutCount: workouts ? workouts.length : 0,
        totalCaloriesBurned: workouts ? workouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0) : 0,
        totalCaloriesConsumed: calorieLogs ? calorieLogs.reduce((sum, l) => sum + (l.calories || 0), 0) : 0,
        recentWorkout: (workouts && workouts.length > 0) ? workouts[workouts.length - 1].type : 'none',
      };

      const context = {
        memories: this.memories || [],
        history: (this.history || []).slice(-10),
        stats: stats
      };

      console.log('Requesting AI response with context:', context);
      const result = await getAIResponse(messageToSend, context);
      console.log('AI result received:', result);
      
      this.setTypingIndicator(false);
      
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid AI response format');
      }

      const { response, remember } = result;
      
      if (response) {
        this.addMessage(response, 'ai');
        this.history.push({ role: 'ai', content: response });
      } else {
        console.warn('AI response was empty');
        this.addMessage("I'm not sure what to say to that.", 'ai');
      }

      if (remember && remember.key && remember.value) {
        console.log('Saving new memory:', remember);
        await addUserMemory(this.userId, remember.key, remember.value);
        await this.loadMemories(); // Refresh memories
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
      this.setTypingIndicator(false);
      this.addMessage('Sorry, I encountered an error. Please try again.', 'ai');
    }
  }

  addMessage(message, sender) {
    if (!message) {
      console.warn('Attempted to add empty message from:', sender);
      return;
    }
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', `${sender}-message`);
    messageElement.textContent = message;
    this.chatWindow.querySelector('.chat-messages').appendChild(messageElement);
    this.chatWindow.querySelector('.chat-messages').scrollTop = this.chatWindow.querySelector('.chat-messages').scrollHeight;
  }

  setTypingIndicator(isTyping) {
    let typingIndicator = this.chatWindow.querySelector('.typing-indicator');
    if (isTyping) {
      if (!typingIndicator) {
        typingIndicator = document.createElement('div');
        typingIndicator.classList.add('chat-message', 'ai-message', 'typing-indicator');
        typingIndicator.textContent = '...';
        this.chatWindow.querySelector('.chat-messages').appendChild(typingIndicator);
      }
    } else if (typingIndicator) {
      typingIndicator.remove();
    }
    this.chatWindow.querySelector('.chat-messages').scrollTop = this.chatWindow.querySelector('.chat-messages').scrollHeight;
  }
  
  renderQuickReplies() {
    const quickRepliesContainer = this.chatWindow.querySelector('.quick-replies');
    quickRepliesContainer.innerHTML = '';
    const quickReplies = [
      'How am I doing?',
      'Suggest a workout',
      'How many calories in an apple?',
    ];

    quickReplies.forEach(reply => {
      const button = document.createElement('button');
      button.textContent = reply;
      button.addEventListener('click', () => this.sendMessage(reply));
      quickRepliesContainer.appendChild(button);
    });
  }
}

export default ChatWidget;
