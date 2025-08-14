// URL of mock server for simulation (using JSONPlaceholder for demonstration)
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // replace with real API if needed

// Function to simulate fetching server data
async function fetchServerQuotes() {
  try {
    const response = await fetch(SERVER_URL);
    if (!response.ok) throw new Error("Failed to fetch server data");
    const serverData = await response.json();

    // Map server data to quote format (simulated)
    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    // Conflict resolution: server data takes precedence
    serverQuotes.forEach(sq => {
      const exists = quotes.some(local => local.text === sq.text && local.category === sq.category);
      if (!exists) quotes.push(sq);
    });

    saveQuotes();
    populateCategories();
    displayRandomQuote();

    notifyUser("Data synced with server successfully!");
  } catch (error) {
    console.error("Server sync error:", error);
  }
}

// Notify user about updates or conflict resolution
function notifyUser(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '10px';
  notification.style.right = '10px';
  notification.style.backgroundColor = '#4CAF50';
  notification.style.color = '#fff';
  notification.style.padding = '10px';
  notification.style.borderRadius = '5px';
  notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 4000);
}

// Periodically sync with server every 30 seconds
setInterval(fetchServerQuotes, 30000);

// Initial sync on page load
window.onload = function() {
  populateCategories();

  // Show last selected category
  const lastIndex = sessionStorage.getItem('lastQuoteIndex');
  if (lastIndex !== null && quotes[lastIndex]) {
    displayRandomQuote();
  } else {
    displayRandomQuote();
  }

  document.getElementById('newQuote').addEventListener('click', displayRandomQuote);

  // Sync server data immediately on load
  fetchServerQuotes();
};
