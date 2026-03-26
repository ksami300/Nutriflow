import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const aiCoach = async (req, res) => {
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