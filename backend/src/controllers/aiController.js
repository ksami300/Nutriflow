const aiService = require("../services/aiService");
const logger = require("../utils/logger");

exports.aiCoach = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Message is required and must be a non-empty string",
      });
    }

    const result = await aiService.getAICoachResponse(message);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.message,
      });
    }

    res.json({
      success: true,
      data: {
        reply: result.reply,
      },
    });
  } catch (err) {
    logger.error("AI Coach error:", err);
    res.status(500).json({
      success: false,
      error: "AI service temporarily unavailable",
    });
  }
};