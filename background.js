chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarize") {
    summarizeWithAI(request.content, request.title)
      .then(summary => sendResponse({ success: true, summary }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }
});

async function summarizeWithAI(content, title) {
  const API_KEY = ;

  const prompt = `
    Summarize this webpage titled "${title}".
    Content: ${content}
    Please provide:
    1. A bullet-point summary (5-7 points)
    2. Key insights (3 points)
    3. Estimated reading time for the original
    Format your response clearly with these three sections.
  `;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 800
      })
    }
  );

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(`${response.status}: ${errorBody?.error?.message || "API call failed"}`);
  }

  const data = await response.json();

  if (!data.choices || !data.choices[0]) {
    throw new Error("No response returned from Groq.");
  }

  return data.choices[0].message.content;
}