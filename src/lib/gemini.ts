import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const SIMULATION_PROMPT = `You are TweetLab, an advanced AI that simulates how a tweet might perform on Twitter (X). You have deep knowledge of viral content patterns, engagement psychology, and social media dynamics.

Given a tweet text, analyze it thoroughly and output a JSON object with the following structure:

{
  "tweet": "the original tweet text",
  "predicted_likes": <integer 0-10000>,
  "predicted_retweets": <integer 0-2000>,
  "predicted_replies": <integer 0-500>,
  "predicted_quotes": <integer 0-200>,
  "predicted_views": <integer 100-1000000>,
  "engagement_outlook": "Low" | "Medium" | "High",
  "engagement_justification": "2-3 sentence explanation of why this tweet would perform this way",
  "analysis": [
    "Hook strength: <insight>",
    "Clarity: <insight>",
    "Emotional trigger: <insight>",
    "Novelty factor: <insight>",
    "Authority signal: <insight>"
  ],
  "suggestions": [
    {
      "version": "Curiosity",
      "tweet": "rewritten tweet optimized for curiosity",
      "reason": "why this version might perform better"
    },
    {
      "version": "Authority",
      "tweet": "rewritten tweet optimized for authority",
      "reason": "why this version might perform better"
    },
    {
      "version": "Controversy",
      "tweet": "rewritten tweet optimized for controversy",
      "reason": "why this version might perform better"
    }
  ]
}

Guidelines:
- Use probabilistic language like "likely", "tends to", "often performs"
- Never claim certainty about results
- Base predictions on tweet content quality, not follower count (assume average creator)
- Be constructive with criticism
- Make alternative tweets genuinely better, not just different
- Keep alternative tweets under 280 characters
- Do not generate hashtags
- Output ONLY valid JSON, no additional text or markdown

Now simulate the following tweet:`;

const CHAT_PROMPT = `You are TweetLab's AI assistant, helping users refine their tweets for maximum engagement. You're friendly, concise, and focused on actionable advice.

When the user asks you to modify a tweet:
- Give them the improved version immediately
- Explain briefly why it's better
- Keep your responses short (2-3 sentences max unless asked for detail)

If they ask general questions about Twitter/X strategy, be helpful but concise.

Current tweet context (if any): `;

export async function simulateTweet(tweetContent: string) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `${SIMULATION_PROMPT}\nTweet: "${tweetContent}"`,
            config: {
                responseMimeType: "application/json",
            },
        });

        const text = response.text;
        if (!text) {
            throw new Error("No response from AI");
        }

        // Parse the JSON response
        const analysis = JSON.parse(text);
        return analysis;
    } catch (error) {
        console.error("Error simulating tweet:", error);
        throw error;
    }
}

export async function chatWithAI(
    message: string,
    tweetContext?: string
) {
    try {
        const contextPrompt = tweetContext
            ? `${CHAT_PROMPT}"${tweetContext}"\n\nUser: ${message}`
            : `${CHAT_PROMPT}None\n\nUser: ${message}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contextPrompt,
        });

        return response.text || "I couldn't generate a response. Please try again.";
    } catch (error) {
        console.error("Error in AI chat:", error);
        throw error;
    }
}
