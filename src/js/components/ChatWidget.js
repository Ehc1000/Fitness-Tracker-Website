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
        <div class="chat-actions">
          <button class="clear-chat" title="Clear History">🗑️</button>
          <button class="close-chat">&times;</button>
        </div>
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
    this.chatWindow.querySelector('.clear-chat').addEventListener('click', () => this.clearHistory());
    this.chatWindow.querySelector('#send-chat').addEventListener('click', () => this.sendMessage());
    this.chatWindow.querySelector('#chat-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
  }

  clearHistory() {
    if (confirm('Are you sure you want to clear your chat history?')) {
      this.history = [];
      const messagesContainer = this.chatWindow.querySelector('.chat-messages');
      messagesContainer.innerHTML = '';
      this.firstOpen = true;
      // Re-trigger the welcome message if they clear it
      this.addMessage("History cleared. I'm your **AI fitness assistant**. How can I help you now?", 'ai');
      this.renderQuickReplies();
    }
  }

  toggleChatWindow() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.chatWindow.classList.add('open');
      this.chatWindow.style.display = 'flex';
      this.chatIcon.style.display = 'none';
    } else {
      this.chatWindow.classList.remove('open');
      this.chatWindow.style.display = 'none';
      this.chatIcon.style.display = 'flex';
    }

    if (this.isOpen && this.firstOpen) {
      this.firstOpen = false;
      this.addMessage("Hello! I'm your **AI fitness assistant**. Ask me anything about workouts, nutrition, or your fitness goals.", 'ai');
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

    const container = document.createElement('div');
    container.classList.add('chat-message-container', `${sender}-message-container`);

    if (sender === 'ai') {
      const avatar = document.createElement('div');
      avatar.classList.add('bot-avatar');
      avatar.innerHTML = '🤖';
      container.appendChild(avatar);
    }

    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', `${sender}-message`);
    
    // Simple markdown support
    if (sender === 'ai') {
      messageElement.innerHTML = this.parseMarkdown(message);
      
      const copyBtn = document.createElement('button');
      copyBtn.classList.add('copy-msg-btn');
      copyBtn.innerHTML = '📋';
      copyBtn.title = 'Copy message';
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(message).then(() => {
          copyBtn.innerHTML = '✅';
          setTimeout(() => copyBtn.innerHTML = '📋', 2000);
        });
      };
      container.appendChild(copyBtn);
    } else {
      messageElement.textContent = message;
    }

    container.appendChild(messageElement);

    const timestamp = document.createElement('div');
    timestamp.classList.add('message-timestamp');
    timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    container.appendChild(timestamp);

    this.chatWindow.querySelector('.chat-messages').appendChild(container);
    this.chatWindow.querySelector('.chat-messages').scrollTop = this.chatWindow.querySelector('.chat-messages').scrollHeight;
  }

  parseMarkdown(text) {
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Newlines
    text = text.replace(/\n/g, '<br>');
    return text;
  }

  setTypingIndicator(isTyping) {
    let typingIndicator = this.chatWindow.querySelector('.typing-indicator-container');
    if (isTyping) {
      if (!typingIndicator) {
        typingIndicator = document.createElement('div');
        typingIndicator.classList.add('chat-message-container', 'ai-message-container', 'typing-indicator-container');
        typingIndicator.innerHTML = `
          <div class="bot-avatar">🤖</div>
          <div class="chat-message ai-message typing-indicator">...</div>
        `;
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
