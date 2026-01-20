import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Streamlined prompt for faster response
const SIMULATION_PROMPT = `Simulate tweet perception on X. Output JSON only.

CRITICAL: Suggestions MUST keep EXACT original format - same emojis (👉✅📌), same line breaks, same structure. NO paragraphs if original uses lists.

{
  "tweet": "original",
  "predicted_likes": <50-5000>,
  "predicted_retweets": <5-800>,
  "predicted_replies": <2-150>,
  "predicted_views": <500-300000>,
  "engagement_outlook": "Low"|"Medium"|"High",
  "engagement_justification": "1-2 sentences why",
  "analysis": ["Hook: insight", "Clarity: insight", "Emotion: insight", "Authority: insight"],
  "suggestions": [
    {
      "version": "Curiosity", 
      "tweet": "KEEP ORIGINAL FORMAT", 
      "reason": "15 words max",
      "audience_reactions": ["Reaction 1 (e.g. 'Love this angle')", "Reaction 2 (e.g. 'I'd click this')", "Reaction 3 (e.g. 'Makes me think')"]
    },
    { "version": "Authority", "tweet": "KEEP FORMAT", "reason": "15 words", "audience_reactions": ["Reaction 1", "Reaction 2", "Reaction 3"] },
    { "version": "Controversy", "tweet": "KEEP FORMAT", "reason": "15 words", "audience_reactions": ["Reaction 1", "Reaction 2", "Reaction 3"] }
  ]
}

NO hashtags. Keep suggestions same length/format as original.

Tweet:`;

const CHAT_PROMPT = `TweetLab AI. Help improve tweets. Be concise.

Context: `;

interface UserContext {
    bio?: string;
    targetAudience?: string;
    aiContext?: string;
}

interface ImageData {
    base64: string;
    mimeType: string;
}

export async function simulateTweet(tweetContent: string, context?: UserContext, imageData?: ImageData) {
    try {
        let prompt = SIMULATION_PROMPT;
        if (context?.targetAudience) {
            prompt += `\n[Audience: ${context.targetAudience}]`;
        }

        type ContentPart = { text: string } | { inlineData: { mimeType: string; data: string } };
        let contents: string | ContentPart[];
        if (imageData) {
            contents = [
                { inlineData: { mimeType: imageData.mimeType, data: imageData.base64 } },
                { text: `${prompt} "${tweetContent}"` },
            ];
        } else {
            contents = `${prompt} "${tweetContent}"`;
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents,
            config: {
                responseMimeType: "application/json",
            },
        });

        const text = response.text;
        if (!text) throw new Error("No response");
        return JSON.parse(text);
    } catch (error) {
        console.error("Simulation error:", error);
        throw error;
    }
}

export async function chatWithAI(message: string, tweetContext?: string) {
    try {
        const prompt = tweetContext
            ? `${CHAT_PROMPT}"${tweetContext}"\n\nUser: ${message}`
            : `${CHAT_PROMPT}None\n\nUser: ${message}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text || "Please try again.";
    } catch (error) {
        console.error("Chat error:", error);
        throw error;
    }
}

export async function* simulateTweetStream(
    tweetContent: string,
    context?: UserContext,
    imageData?: ImageData
): AsyncGenerator<{ partial?: string; complete?: boolean; analysis?: unknown }> {
    try {
        let prompt = SIMULATION_PROMPT;
        if (context?.targetAudience) {
            prompt += `\n[Audience: ${context.targetAudience}]`;
        }

        type ContentPart = { text: string } | { inlineData: { mimeType: string; data: string } };
        let contents: string | ContentPart[];
        if (imageData) {
            contents = [
                { inlineData: { mimeType: imageData.mimeType, data: imageData.base64 } },
                { text: `${prompt} "${tweetContent}"` },
            ];
        } else {
            contents = `${prompt} "${tweetContent}"`;
        }

        const response = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents,
            config: {
                responseMimeType: "application/json",
            },
        });

        let fullText = "";
        for await (const chunk of response) {
            const text = chunk.text;
            if (text) {
                fullText += text;
                yield { partial: fullText };
            }
        }

        try {
            yield { complete: true, analysis: JSON.parse(fullText) };
        } catch {
            yield { complete: true, analysis: { error: "Parse failed" } };
        }
    } catch (error) {
        console.error("Stream error:", error);
        throw error;
    }
}
