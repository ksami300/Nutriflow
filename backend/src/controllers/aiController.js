import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "OVDE_PRIVREMENO_STAVI_KLJUC"
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