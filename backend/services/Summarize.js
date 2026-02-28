import { GoogleGenAI } from "@google/genai"

let geminiClient = null;

const getGeminiClient = () => {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
};

const buildSummarizePrompt = (noteText) => {
  return `
You are a helpful assistant that summarizes private notes.

STRICT RULES:
1. Only use information from the note provided below
2. Do NOT add any external information or assumptions
3. Keep the summary short — 3 to 5 bullet points maximum
4. Each bullet point should be one clear sentence
5. Start each bullet point with "•"
6. If the note is very short or simple, use fewer bullet points

NOTE CONTENT:
${noteText}

Please summarize the above note now.
  `.trim();
};

const summarizeNote = async (noteText) => {
  const client = getGeminiClient();

  if (!client) {
    return '• AI summarization is not configured.\n• Please add your GEMINI_API_KEY to the .env file.';
  }

  try {
    const prompt = buildSummarizePrompt(noteText);

    const response = await client.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      config: {
        maxOutputTokens: 300,
        temperature: 0.3,
      },
    });

    const summary = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!summary) {
      throw new Error('AI returned an empty response');
    }

    return summary;

  } catch (err) {
    console.error('Gemini error:', err);

    if (err.status === 429) {
      throw {
        status: 429,
        message: 'AI service is busy. Please try again in a moment.',
      };
    }

    if (err.status === 400) {
      throw {
        status: 400,
        message: 'Could not process this note for summarization.',
      };
    }

    throw {
      status: 500,
      message: 'AI summarization failed. Please try again.',
    };
  }
};

export default summarizeNote