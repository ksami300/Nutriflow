import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export const aiCoach = async (req, res) => {
  const { message } = req.body;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: "You are a fitness coach." },
      { role: "user", content: message },
    ],
  });

  res.json({ reply: completion.choices[0].message.content });
};