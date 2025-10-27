
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
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

  const prompt = `You are a compassionate mental wellness companion. A user has shared a journal entry with you.

Mood: ${moodLabel} (${mood}/5)
Gratitude: "${gratitude}"
Goals: "${goals}"
Entry Content: "${content}"

Please provide a warm, empathetic response that:
1. Acknowledges their feelings and validates their experience
2. References specific words or phrases they used to show you're truly listening
3. Offers 3 specific, actionable suggestions they can try within the next 24-48 hours
4. Matches the severity of your response to their actual situation (don't catastrophize minor concerns)
5. Maintains a conversational, supportive tone (like talking to a caring friend)

Format your response as:

💭 **Reflection**
[2-3 sentences acknowledging their feelings and referencing their specific words]

✨ **Suggestions**
1. [Specific, achievable action]
2. [Specific, achievable action]
3. [Specific, achievable action]

Keep the tone warm and encouraging. Be specific and practical.`;

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
          maxOutputTokens: 1024,
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

    const prompt = `You are a compassionate mental wellness companion. A user has shared a journal entry with you.

Entry Content: "${content}"
Current Mood: ${mood}

Please provide a warm, empathetic response that:
1. Acknowledges their feelings and validates their experience
2. References specific words or phrases they used to show you're truly listening
3. Offers 3 specific, actionable suggestions they can try within the next 24-48 hours
4. Matches the severity of your response to their actual situation (don't catastrophize minor concerns)
5. Maintains a conversational, supportive tone (like talking to a caring friend)

Format your response as:

💭 **Reflection**
[2-3 sentences acknowledging their feelings and referencing their specific words]

✨ **Suggestions**
1. [Specific, achievable action]
2. [Specific, achievable action]
3. [Specific, achievable action]

Keep the tone warm and encouraging. Be specific and practical.`;

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
            maxOutputTokens: 1024,
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

    const prompt = `You are a compassionate mental wellness companion reviewing a user's week of journal entries.

Here are their entries from the past week:

${entriesSummary}

Please provide a thoughtful weekly reflection that:
1. Identifies 2-3 key themes or patterns you noticed
2. Celebrates positive moments and growth
3. Acknowledges challenges with empathy
4. Provides an actionable "Action Plan" with 3 specific suggestions for the coming week

Format your response as:

🌟 **Weekly Reflection**
[2-3 paragraphs discussing themes, patterns, and observations]

📋 **Action Plan for Next Week**
1. [Specific, achievable goal]
2. [Specific, achievable goal]
3. [Specific, achievable goal]

Keep the tone warm, encouraging, and forward-looking.`;

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
            maxOutputTokens: 1024,
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
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
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
