import OpenAI from "openai";

const openAiApiKey = process.env.OPENAI_API_KEY;
const client = openAiApiKey ? new OpenAI({ apiKey: openAiApiKey }) : null;

export const aiCoach = async (req, res) => {
  if (!client) {
    return res.status(500).json({ message: "OpenAI API key is not configured" });
  }
  try {
    const { message } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Ti si profesionalni fitness i nutricionistički trener."
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
    console.error("AI ERROR:", error);
    res.status(500).json({ message: "AI greška" });
  }
};