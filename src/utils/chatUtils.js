/**
 * Chat Utilities
 * Handles rule matching, AI fallback, and urgency detection
 */

import { faqRules, urgencyKeywords, medicalDisclaimer } from "../data/faqRules";

/**
 * Check if user message contains urgency keywords
 * @param {string} message - User message
 * @returns {boolean} - True if urgent
 */
export const detectUrgency = (message) => {
  const lowerMsg = message.toLowerCase();
  return urgencyKeywords.some((keyword) => lowerMsg.includes(keyword));
};

/**
 * Match user message against FAQ rules
 * @param {string} message - User message
 * @returns {object|null} - Matched rule or null
 */
export const matchFAQRule = (message) => {
  const lowerMsg = message.toLowerCase();

  for (const rule of faqRules) {
    const matchedKeywords = rule.keywords.filter((keyword) =>
      lowerMsg.includes(keyword.toLowerCase())
    );

    // Check if minimum keywords requirement is met
    if (matchedKeywords.length >= rule.minKeywords) {
      return rule;
    }
  }

  return null; // No rule matched
};

/**
 * Call AI API (OpenAI/Gemini) for fallback response
 * @param {string} message - User message
 * @returns {Promise<string>} - AI response
 */
export const callAIAPI = async (message) => {
  const apiKey = import.meta.env.VITE_AI_API_KEY;
  const apiProvider = import.meta.env.VITE_AI_PROVIDER || "openai"; // "openai" or "gemini"

  if (!apiKey) {
    console.error("AI API key not configured");
    return "Sorry, AI service is temporarily unavailable. Please try again later.";
  }

  try {
    if (apiProvider === "gemini") {
      return await callGeminiAPI(message, apiKey);
    } else {
      return await callOpenAIAPI(message, apiKey);
    }
  } catch (error) {
    console.error("AI API Error:", error);
    return "Sorry, I encountered an error processing your request. Please try again.";
  }
};

/**
 * OpenAI API Call (GPT-3.5 or GPT-4)
 * @param {string} message - User message
 * @param {string} apiKey - OpenAI API key
 * @returns {Promise<string>} - AI response
 */
const callOpenAIAPI = async (message, apiKey) => {
  const systemPrompt = `You are a helpful Blood Donation Information Assistant for a Blood Donor Finder App.
  
Guidelines:
1. Provide accurate blood donation information (eligibility, safety, intervals, blood groups)
2. DO NOT provide medical diagnosis or treatment advice
3. Keep responses short, clear, and actionable (max 150 words)
4. Use emojis for better readability
5. Always end with: "For personalized advice, consult a healthcare professional."
6. If user asks medical questions beyond donation info, redirect them to doctors

Current Context:
- This is a Blood Donation Information Platform
- Focus on donation eligibility, safety, process, and logistics
- Never diagnose conditions or recommend treatments`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "OpenAI API Error");
  }

  const data = await response.json();
  const aiMessage =
    data.choices?.[0]?.message?.content || "Unable to process your request.";
  return aiMessage + medicalDisclaimer;
};

/**
 * Google Gemini API Call
 * @param {string} message - User message
 * @param {string} apiKey - Gemini API key
 * @returns {Promise<string>} - AI response
 */
const callGeminiAPI = async (message, apiKey) => {
  const systemPrompt = `You are a helpful Blood Donation Information Assistant for a Blood Donor Finder App.
  
Guidelines:
1. Provide accurate blood donation information (eligibility, safety, intervals, blood groups)
2. DO NOT provide medical diagnosis or treatment advice
3. Keep responses short, clear, and actionable (max 150 words)
4. Use emojis for better readability
5. Always end with: "For personalized advice, consult a healthcare professional."
6. If user asks medical questions beyond donation info, redirect them to doctors`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser Question: ${message}`,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Gemini API Error");
  }

  const data = await response.json();
  const aiMessage =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Unable to process your request.";
  return aiMessage + medicalDisclaimer;
};

/**
 * Main chat processing function
 * Implements hybrid logic: Rules first, then AI fallback
 * @param {string} userMessage - User message
 * @returns {Promise<object>} - { response, isUrgent, source }
 */
export const processMessage = async (userMessage) => {
  const isUrgent = detectUrgency(userMessage);
  let response = "";
  let source = ""; // "faq" or "ai"

  // Step 1: Try to match FAQ rules
  const matchedRule = matchFAQRule(userMessage);

  if (matchedRule) {
    response = matchedRule.response + medicalDisclaimer;
    source = "faq";
  } else {
    // Step 2: Fallback to AI
    response = await callAIAPI(userMessage);
    source = "ai";
  }

  // Step 3: Add urgency suggestion if detected
  if (isUrgent) {
    response += "\n\n🚨 **This seems urgent!** Please contact nearby blood banks or medical services immediately.";
  }

  return {
    response,
    isUrgent,
    source,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Format message for display
 * @param {string} message - Message text
 * @returns {string} - Formatted message
 */
export const formatMessage = (message) => {
  return message.trim();
};

/**
 * Validate message before processing
 * @param {string} message - Message text
 * @returns {boolean} - True if valid
 */
export const isValidMessage = (message) => {
  return message && message.trim().length > 0 && message.trim().length <= 1000;
};
