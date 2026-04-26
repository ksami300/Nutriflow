const aiService = require("../services/aiService");

exports.aiCoach = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message is required and must be a non-empty string",
      });
    }

    const result = await aiService.getAICoachResponse(message);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message,
      });
    }

    res.json({
      success: true,
      reply: result.reply,
    });
  } catch (err) {
    console.error("AI Coach error:", err);
    res.status(500).json({
      success: false,
      message: "AI service temporarily unavailable",
    });
  }
};