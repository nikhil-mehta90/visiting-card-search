const OPENAI_API_KEY = "Enter your Open-AI key here"; 

/**
 * GPT function for Google Sheets.
 * @param {string} prompt The prompt to send to GPT-4.1-nano.
 * @param {number} [temperature=0.5] The randomness of response.
 * @return The response from GPT-4.1-nano.
 * @customfunction
 */
function GPT(prompt, temperature = 0.2) {
  if (!prompt) return 'Prompt is empty';

  const url = 'https://api.openai.com/v1/chat/completions';

  const payload = {
    model: "gpt-4.1-nano",
    messages: [
      { "role": "system", "content": "You are an expert in extracting company info from visiting cards." },
      { "role": "user", "content": prompt }
    ],
    temperature: temperature,
    max_tokens: 200
  };

  const options = {
    method: 'POST',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + OPENAI_API_KEY
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());

    if (result.choices && result.choices.length > 0) {
      return result.choices[0].message.content.trim();
    } else if (result.error) {
      return `Error: ${result.error.message}`;
    } else {
      return "Unknown error.";
    }
  } catch (e) {
    return `Exception: ${e.message}`;
  }
}
