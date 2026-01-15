
class Quote {
  constructor() {
    this.quoteContainer = document.createElement('div');
    this.quoteContainer.id = 'quote-container';
    this.quoteText = document.createElement('p');
    this.quoteText.id = 'quote-text';
    this.quoteAuthor = document.createElement('p');
    this.quoteAuthor.id = 'quote-author';
    this.quoteContainer.appendChild(this.quoteText);
    this.quoteContainer.appendChild(this.quoteAuthor);
  }

  async fetchQuote() {
    try {
      const response = await fetch('https://zenquotes.io/api/random');
      const [quote] = await response.json();
      this.quoteText.textContent = `"${quote.q}"`;
      this.quoteAuthor.textContent = `- ${quote.a}`;
    } catch (error) {
      console.error('Error fetching quote:', error);
      this.quoteText.textContent = '"The only bad workout is the one that didn\'t happen."';
      this.quoteAuthor.textContent = '- Unknown';
    }
  }

  render() {
    this.fetchQuote();
    return this.quoteContainer;
  }
}

export default Quote;
