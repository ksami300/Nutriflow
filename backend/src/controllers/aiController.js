import OpenAI from "openai";

const openAiApiKey = process.env.OPENAI_API_KEY;
const client = openAiApiKey ? new OpenAI({ apiKey: openAiApiKey }) : null;

export const aiCoach = async (req, res) => {
  if (!client) {
    return res.status(500).json({ message: "OpenAI API key is not configured" });
  }
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional fitness and nutrition coach with expertise in meal planning, exercise science, and healthy lifestyle coaching."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({ message: "Failed to generate AI response", error: error.message });
  }
};