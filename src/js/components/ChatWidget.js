import { getAIResponse } from '../services/ai.js';

class ChatWidget {
  constructor() {
    this.isOpen = false;
    this.firstOpen = true;
    this.render();
    this.setupEventListeners();
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

  sendMessage(message) {
    const input = this.chatWindow.querySelector('#chat-input');
    const messageToSend = message || input.value.trim();
    if (!messageToSend) return;

    this.addMessage(messageToSend, 'user');
    if(!message) input.value = '';

    this.setTypingIndicator(true);

    getAIResponse(messageToSend).then(response => {
      this.setTypingIndicator(false);
      this.addMessage(response, 'ai');
    });
  }

  addMessage(message, sender) {
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
      'Suggest a workout',
      'How many calories in an apple?',
      'What are some healthy snacks?',
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
