const OpenAI = require("openai");

class AIService {
  constructor() {
    this.openai = process.env.OPENAI_API_KEY
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : null;
  }

  async getAICoachResponse(message) {
    try {
      if (!this.openai) {
        return {
          success: false,
          message: "AI service is not configured",
        };
      }

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful fitness and nutrition coach. Provide evidence-based advice, be encouraging, and focus on sustainable healthy habits.",
          },
          { role: "user", content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return {
        success: true,
        reply: completion.choices[0].message.content,
      };
    } catch (error) {
      console.error("OpenAI API error:", error);
      return {
        success: false,
        message: "AI service temporarily unavailable",
      };
    }
  }
}

module.exports = new AIService();