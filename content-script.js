chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getContent") {
    try {
      const article = document.querySelector('article') ||
        document.querySelector('main') ||
        document.querySelector('.post-content') ||
        document.body;

      let text = article.innerText
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 15000);

      sendResponse({
        success: true,
        content: text,
        title: document.title,
        url: window.location.href
      });

    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
  return true;
});