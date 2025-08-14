// Initialize quotes array from localStorage or default
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" }
];

// Function to display a random quote
function displayRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById('quoteDisplay').innerText = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById('quoteDisplay').innerText = `"${quote.text}" - ${quote.category}`;

  // Save last displayed quote in session storage
  sessionStorage.setItem('lastQuoteIndex', randomIndex);
}

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please provide both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  displayRandomQuote();

  // Clear input fields
  textInput.value = '';
  categoryInput.value = '';
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Export quotes to JSON file
function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid JSON format");
      importedQuotes.forEach(q => {
        if (q.text && q.category) quotes.push(q);
      });
      saveQuotes();
      displayRandomQuote();
      alert('Quotes imported successfully!');
    } catch (error) {
      alert('Failed to import quotes: ' + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize page
window.onload = function() {
  // If a quote was shown last session, show it
  const lastIndex = sessionStorage.getItem('lastQuoteIndex');
  if (lastIndex !== null && quotes[lastIndex]) {
    document.getElementById('quoteDisplay').innerText = `"${quotes[lastIndex].text}" - ${quotes[lastIndex].category}`;
  } else {
    displayRandomQuote();
  }

  document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
};
