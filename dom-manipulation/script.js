// Mock server URL
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Sample quotes array
let quotes = [
  { text: "Believe in yourself", category: "Motivation" },
  { text: "Code every day", category: "Programming" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a random quote
function displayRandomQuote() {
  if (quotes.length === 0) return;
  const index = Math.floor(Math.random() * quotes.length);
  document.getElementById('quoteDisplay').textContent = quotes[index].text;
  sessionStorage.setItem('lastQuoteIndex', index);
}

// Add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value;
  const category = document.getElementById('newQuoteCategory').value;
  if (!text || !category) return;
  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  displayRandomQuote();
}

// Populate category dropdown
function populateCategories() {
  const select = document.getElementById('categoryFilter');
  if (!select) return;
  const categories = [...new Set(quotes.map(q => q.category))];
  select.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

// Filter quotes by category
function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  let filteredQuotes = selected === 'all' ? quotes : quotes.filter(q => q.category === selected);
  if (filteredQuotes.length > 0) {
    const index = Math.floor(Math.random() * filteredQuotes.length);
    document.getElementById('quoteDisplay').textContent = filteredQuotes[index].text;
  }
  localStorage.setItem('lastCategory', selected);
}

// ---------------------- Task 3 Fixes ----------------------

// Fetch quotes from server (GET)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();
    // Simulate server quotes format
    return serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Error fetching server quotes:", error);
    return [];
  }
}

// Post a quote to the server (POST)
async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: 'POST',
      body: JSON.stringify(quote),
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error posting quote to server:", error);
  }
}

// Sync quotes (merge local and server)
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  serverQuotes.forEach(sq => {
    const exists = quotes.some(lq => lq.text === sq.text && lq.category === sq.category);
    if (!exists) quotes.push(sq);
  });

  saveQuotes();
  populateCategories();
  displayRandomQuote();
  notifyUser("Quotes synced with server!");
}

// Notification
function notifyUser(message) {
  const div = document.createElement('div');
  div.textContent = message;
  div.style.position = 'fixed';
  div.style.top = '10px';
  div.style.right = '10px';
  div.style.backgroundColor = '#4CAF50';
  div.style.color = '#fff';
  div.style.padding = '10px';
  div.style.borderRadius = '5px';
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}

// Periodically sync every 30 seconds
setInterval(syncQuotes, 30000);

// Event listeners
window.onload = function () {
  populateCategories();
  const lastIndex = sessionStorage.getItem('lastQuoteIndex');
  if (lastIndex !== null && quotes[lastIndex]) displayRandomQuote();
  document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
  syncQuotes();
};
