import { getAIResponse } from '../services/ai.js';

class ChatWidget {
  constructor() {
    this.isOpen = false;
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
  }

  sendMessage() {
    const input = this.chatWindow.querySelector('#chat-input');
    const message = input.value.trim();
    if (!message) return;

    this.addMessage(message, 'user');
    input.value = '';

    getAIResponse(message).then(response => {
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
}

export default ChatWidget;
