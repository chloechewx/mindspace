export const generateAIInsights = async (content: string, mood: string): Promise<string> => {
  try {
    const response = await fetch('undefined', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer undefined`,
      },
      body: JSON.stringify({
        url: 'https://api.anthropic.com/v1/messages',
        method: 'POST',
        headers: {
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: {
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: `As a compassionate wellness coach, analyze this diary entry and provide supportive insights. 

Entry: "${content}"
Current Mood: ${mood}

Please provide:
1. A brief empathetic reflection (2-3 sentences)
2. One positive pattern or strength you notice
3. One gentle suggestion for growth or self-care

Keep the tone warm, encouraging, and non-judgmental. Focus on growth and self-compassion.`,
            },
          ],
        },
      }),
    });

    const data = await response.json();
    
    if (data.content && data.content[0] && data.content[0].text) {
      return data.content[0].text;
    }
    
    return 'Thank you for sharing your thoughts today. Remember, every entry is a step toward greater self-awareness and growth.';
  } catch (error) {
    console.error('AI insights error:', error);
    return 'Thank you for sharing your thoughts today. Keep reflecting on your journey—you\'re doing great!';
  }
};

export const generateWeeklySummary = async (entries: string[]): Promise<string> => {
  try {
    const entriesText = entries.join('\n\n---\n\n');
    
    const response = await fetch('undefined', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer undefined`,
      },
      body: JSON.stringify({
        url: 'https://api.anthropic.com/v1/messages',
        method: 'POST',
        headers: {
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: {
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: `As a wellness coach, analyze these diary entries from the past week and provide a supportive summary:

${entriesText}

Please provide:
1. Key themes and patterns you notice
2. Emotional journey overview
3. Strengths and positive moments
4. Areas for gentle growth
5. Encouraging message for the week ahead

Keep it warm, insightful, and empowering.`,
            },
          ],
        },
      }),
    });

    const data = await response.json();
    
    if (data.content && data.content[0] && data.content[0].text) {
      return data.content[0].text;
    }
    
    return 'Your week has been filled with reflection and growth. Keep nurturing your wellness journey!';
  } catch (error) {
    console.error('Weekly summary error:', error);
    return 'Your week has been meaningful. Continue your journey of self-discovery and growth!';
  }
};

// Export as default object for easier importing
export const aiService = {
  generateInsights: async (entries: Array<{ content: string; mood: string }>) => {
    if (entries.length === 0) return '';
    
    const latestEntry = entries[0];
    return generateAIInsights(latestEntry.content, latestEntry.mood);
  },
  generateWeeklySummary: async (entries: Array<{ content: string }>) => {
    const contents = entries.map(e => e.content);
    return generateWeeklySummary(contents);
  }
};
