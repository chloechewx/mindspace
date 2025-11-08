const GEMINI_API_KEY = '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

// System Prompt Configuration - Casual Friend Style
const SYSTEM_PROMPT = `You are a friendly, casual, and highly conversational wellness companion—like chatting with a supportive friend over coffee. You respond naturally, warmly, and with curiosity, making the user feel heard and engaged.

**Conversation Style:**
- Keep responses in 2-4 short sentences per chunk; avoid long paragraphs
- Use casual, friendly language with contractions: "you're", "can't", "it's"
- Add mild humor and small interjections: "Hmm…", "Oh, got it!", "Ah, I see!", "Wow!"
- Echo parts of what the user says to show understanding
- Ask follow-up questions or offer gentle suggestions to encourage back-and-forth conversation
- Occasionally use relatable analogies, observations, or mini stories
- Mix short, punchy sentences with slightly longer ones for natural flow

**Response Format:**
- Break ideas into digestible chunks with line breaks for readability
- Reference journal entries or prior messages casually: "I noticed you mentioned...", "Sounds like..."
- End most responses with a question or prompt to keep the conversation going
- Show subtle empathy or excitement where appropriate

**Tone:**
- Supportive friend, not therapist
- Encouraging but realistic—avoid over-the-top positivity
- Curious, engaged, and human
- Warm, relatable, and approachable
- Natural, like a real person chatting with you`;


export const generateJournalInsights = async (
  mood: number,
  gratitude: string,
  goals: string,
  content: string,
  isRegenerate: boolean = false
): Promise<string> => {
  console.log('🤖 Generating journal insights...');
  console.log('📊 Mood:', mood);
  console.log('🙏 Gratitude:', gratitude.substring(0, 50) + '...');
  console.log('🎯 Goals:', goals.substring(0, 50) + '...');
  console.log('📝 Content:', content.substring(0, 100) + '...');
  console.log('🔄 Is regenerate:', isRegenerate);

  const temperature = isRegenerate ? 0.9 : 0.7;

  const moodLabels = ['', 'Struggling', 'Low', 'Okay', 'Good', 'Great'];
  const moodLabel = moodLabels[mood] || 'Okay';

  const prompt = `${SYSTEM_PROMPT}

Your friend just shared their journal entry with you.

Mood: ${moodLabel} (${mood}/5)
Gratitude: "${gratitude}"
Goals: "${goals}"
Entry: "${content}"

Respond like a supportive friend would. Keep it short and conversational (2-4 sentences). Reference something specific they mentioned. Then ask a follow-up question or offer a quick suggestion.

Be real, be warm, be human.`;

  try {
    console.log('📤 Sending request to Gemini API...');
    console.log('🌡️ Temperature:', temperature);

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
          maxOutputTokens: 512,
        },
      }),
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data: GeminiResponse = await response.json();
    console.log('✅ API Response received');

    const generatedText = data.candidates[0]?.content?.parts[0]?.text;

    if (!generatedText) {
      console.error('❌ No text in response:', JSON.stringify(data, null, 2));
      throw new Error('No text generated');
    }

    console.log('✅ Generated insights:', generatedText.substring(0, 100) + '...');
    return generatedText;
  } catch (error: any) {
    console.error('💥 Error generating insights:', error);
    throw error;
  }
};

export const geminiService = {
  async generateInsight(
    content: string,
    mood: string,
    isRegenerate: boolean = false
  ): Promise<string> {
    console.log('🤖 Generating AI insight...');
    console.log('📝 Entry content:', content.substring(0, 100) + '...');
    console.log('😊 Mood:', mood);
    console.log('🔄 Is regenerate:', isRegenerate);

    const temperature = isRegenerate ? 0.9 : 0.7;

    const prompt = `${SYSTEM_PROMPT}

Your friend just shared their journal entry.

Entry: "${content}"
Mood: ${mood}

Respond like a supportive friend would. Keep it short and conversational (2-4 sentences). Reference something specific they mentioned. Then ask a follow-up question or offer a quick suggestion.

Be real, be warm, be human.`;

    try {
      console.log('📤 Sending request to Gemini API...');
      console.log('🌡️ Temperature:', temperature);

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
            maxOutputTokens: 512,
          },
        }),
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data: GeminiResponse = await response.json();
      console.log('✅ API Response received');

      const generatedText = data.candidates[0]?.content?.parts[0]?.text;

      if (!generatedText) {
        console.error('❌ No text in response:', JSON.stringify(data, null, 2));
        throw new Error('No text generated');
      }

      console.log('✅ Generated insight:', generatedText.substring(0, 100) + '...');
      return generatedText;
    } catch (error: any) {
      console.error('💥 Error generating insight:', error);
      throw error;
    }
  },

  async generateWeeklyReflection(entries: Array<{ content: string; mood: string; date: string }>): Promise<string> {
    console.log('📊 Generating weekly reflection for', entries.length, 'entries');

    const entriesSummary = entries
      .map((entry, index) => `Day ${index + 1} (${entry.date}): Mood - ${entry.mood}\n${entry.content}`)
      .join('\n\n---\n\n');

    const prompt = `${SYSTEM_PROMPT}

You're catching up with a friend about their week. Here's what they journaled:

${entriesSummary}

Give them a casual weekly check-in. Notice 2-3 patterns you spotted. Celebrate the wins, acknowledge the tough stuff. Keep it conversational - like you're texting a friend.

Then suggest 2-3 small things they could try this week. Make it feel doable, not overwhelming.`;

    try {
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
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 768,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      const generatedText = data.candidates[0]?.content?.parts[0]?.text;

      if (!generatedText) {
        throw new Error('No text generated');
      }

      console.log('✅ Weekly reflection generated');
      return generatedText;
    } catch (error: any) {
      console.error('💥 Error generating weekly reflection:', error);
      throw error;
    }
  },

  async generateChatResponse(prompt: string): Promise<string> {
    console.log('💬 Generating chat response...');
    console.log('📝 Prompt length:', prompt.length);

    const fullPrompt = `${SYSTEM_PROMPT}

${prompt}

Remember: Keep responses short (2-4 sentences), conversational, and human. Ask follow-up questions. Use casual interjections. Be a friend, not a robot.`;

    try {
      console.log('📤 Sending request to Gemini API...');

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
                  text: fullPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          },
        }),
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data: GeminiResponse = await response.json();
      console.log('✅ API Response received');

      const generatedText = data.candidates[0]?.content?.parts[0]?.text;

      if (!generatedText) {
        console.error('❌ No text in response:', JSON.stringify(data, null, 2));
        throw new Error('No text generated');
      }

      console.log('✅ Generated chat response:', generatedText.substring(0, 100) + '...');
      return generatedText;
    } catch (error: any) {
      console.error('💥 Error generating chat response:', error);
      throw error;
    }
  },
};
