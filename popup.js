document.addEventListener('DOMContentLoaded', async () => {

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  document.getElementById('page-title').textContent = tab.title;

  // Check cache first
  const cached = await getCachedSummary(tab.url);
  if (cached) {
    showSummary(cached);
    return;
  }

  // Summarize button
  document.getElementById('summarize-btn').addEventListener('click', async () => {
    document.getElementById('error').textContent = '';
    setLoading(true);

    try {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content-script.js']
        });
      } catch (injectErr) {
      }

      await new Promise(r => setTimeout(r, 300));

      // STEP 2: Get page content
      let response;
      try {
        response = await chrome.tabs.sendMessage(tab.id, { action: "getContent" });
      } catch (msgErr) {
        throw new Error("Content script error: " + msgErr.message);
      }

      if (!response) {
        throw new Error("No response from content script. Refresh the page and try again.");
      }

      if (!response.success) {
        throw new Error("Content script failed: " + response.error);
      }

      if (!response.content || response.content.length < 20) {
        throw new Error("Page has no readable content.");
      }

      // Send to AI
      let result;
      try {
        result = await chrome.runtime.sendMessage({
          action: "summarize",
          content: response.content,
          title: response.title
        });
      } catch (bgErr) {
        throw new Error("Background script error: " + bgErr.message);
      }

      if (!result) {
        throw new Error("No response from background script.");
      }

      if (!result.success) {
        throw new Error(result.error);
      }

      // Show summary
      await cacheSummary(tab.url, result.summary);
      showSummary(result.summary);

    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  });

  // Clear button
  document.getElementById('clear-btn').addEventListener('click', () => {
    document.getElementById('summary-output').textContent = '';
    document.getElementById('error').textContent = '';
    document.getElementById('clear-btn').style.display = 'none';
    document.getElementById('summarize-btn').style.display = 'block';
  });

});

function setLoading(isLoading) {
  document.getElementById('loading').style.display = isLoading ? 'block' : 'none';
  document.getElementById('summarize-btn').disabled = isLoading;
}

function showSummary(text) {
  document.getElementById('summary-output').textContent = text;
  document.getElementById('clear-btn').style.display = 'block';
  document.getElementById('summarize-btn').style.display = 'none';
}

function showError(msg) {
  document.getElementById('error').textContent = "⚠ " + msg;
}

async function cacheSummary(url, summary) {
  return chrome.storage.local.set({ [url]: summary });
}

async function getCachedSummary(url) {
  const result = await chrome.storage.local.get(url);
  return result[url] || null;
}