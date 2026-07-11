const nodemailer = require("nodemailer");
const logger = require("./logger");

exports.sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"NutriFlow" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    logger.info(`Email sent to: ${to}`);
  } catch (err) {
    logger.error("Email error:", err);
  }
};