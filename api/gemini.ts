import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Fix #13: Verify the caller is an authenticated Supabase user.
  // The client must send its Supabase access token in the Authorization header.
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const token = authHeader.replace('Bearer ', '');
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
    } catch {
      return res.status(401).json({ error: 'Authentication failed' });
    }
  }

  try {
    const { prompt, temperature = 0.7, maxTokens = 512 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Fix #14: Clamp user-controlled generation parameters to safe ranges
    const safeTemperature = Math.min(Math.max(Number(temperature) || 0.7, 0), 1);
    const safeMaxTokens = Math.min(Math.max(Number(maxTokens) || 512, 1), 2048);

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
          temperature: safeTemperature,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: safeMaxTokens,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: 'Gemini API error' });
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return res.status(500).json({ error: 'No text generated' });
    }

    return res.status(200).json({ text: generatedText });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
