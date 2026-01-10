import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if API key is configured
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { prompt, temperature = 0.7, maxTokens = 512 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: temperature,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: maxTokens,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return res.status(response.status).json({ error: 'Gemini API error', details: errorText });
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return res.status(500).json({ error: 'No text generated' });
    }

    return res.status(200).json({ text: generatedText });
  } catch (error: any) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}