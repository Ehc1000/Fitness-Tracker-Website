
class Quote {
  constructor() {
    this.quoteContainer = document.createElement('div');
    this.quoteContainer.id = 'quote-container';
    
    this.contentWrapper = document.createElement('div');
    this.contentWrapper.id = 'quote-content';
    
    this.quoteText = document.createElement('p');
    this.quoteText.id = 'quote-text';
    this.quoteAuthor = document.createElement('p');
    this.quoteAuthor.id = 'quote-author';
    
    this.refreshBtn = document.createElement('button');
    this.refreshBtn.id = 'quote-refresh-btn';
    this.refreshBtn.innerHTML = '&#8635;'; // Refresh icon
    this.refreshBtn.title = 'Fetch new quote';
    this.refreshBtn.addEventListener('click', () => this.fetchQuote());

    this.contentWrapper.appendChild(this.quoteText);
    this.contentWrapper.appendChild(this.quoteAuthor);
    this.quoteContainer.appendChild(this.contentWrapper);
    this.quoteContainer.appendChild(this.refreshBtn);
  }

  async fetchQuote() {
    this.refreshBtn.classList.add('spinning');
    try {
      // Use a proxy or different API if CORS becomes an issue, but let's stick with this for now
      const response = await fetch('https://zenquotes.io/api/random');
      const [quote] = await response.json();
      this.quoteText.textContent = `"${quote.q}"`;
      this.quoteAuthor.textContent = `- ${quote.a}`;
    } catch (error) {
      console.error('Error fetching quote:', error);
      this.quoteText.textContent = '"The only bad workout is the one that didn\'t happen."';
      this.quoteAuthor.textContent = '- Unknown';
    } finally {
      setTimeout(() => this.refreshBtn.classList.remove('spinning'), 500);
    }
  }

  render() {
    this.fetchQuote();
    return this.quoteContainer;
  }
}

export default Quote;
