# AI Page Summarizer Chrome Extension

## Description

This is a Chrome Extension that extracts content from a webpage and generates a summary using AI.

---

## How to Install and Run (Local Setup)

Follow these steps:

1. Download or clone this repository:

   * Click the green "Code" button on GitHub
   * Select "Download ZIP"
   * Extract the ZIP file to your computer

2. Open Google Chrome

3. Go to:
   chrome://extensions/

4. Turn ON "Developer Mode" (top right corner)

5. Click "Load unpacked"

6. Select the project folder (ai-page-summarizer)

7. The extension should now appear in your Chrome toolbar

---

## How to Use

1. Open any webpage (e.g., article or blog)
2. Click the extension icon
3. Click the "Summarize Page" button
4. Wait for the summary to appear

---

## Security Notes

* API keys are NOT stored in the frontend
* All API requests are handled securely in the background script or backend

---

## Tech Stack

* HTML
* CSS
* JavaScript
* Chrome Extension (Manifest V3)

---

## Project Structure

* manifest.json → Extension configuration
* popup.html → UI layout
* popup.js → Handles user interaction
* content.js → Extracts page content
* background.js → Handles AI requests

---
