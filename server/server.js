require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/summarize", async (req, res) => {
  const { content, title } = req.body;

  const prompt = `
Summarize this webpage titled "${title}".

Content:
${content}

Return:
1. Bullet points (5–7)
2. Key insights (3)
3. Reading time estimate
`;

  try {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800
      })
    }
  );

  const data = await response.json(); 

  console.log("GROQ RESPONSE:", JSON.stringify(data, null, 2));

  if (!data.choices || !data.choices[0]) {
    return res.status(500).json({
      error: "Invalid Groq response",
      raw: data
    });
  }

  res.json({
    summary: data.choices[0].message.content
  });

  } catch (err) {
    console.log("FULL ERROR:", err);
    res.status(500).json({
      error: err.message,
      details: err
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});