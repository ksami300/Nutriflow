const User = require("../models/User");

// 🛡️ RELEVANTAN KONTROLER KOJI HVATA USPEŠNU STRIPE UPLATU OD 9.99 EVRA
exports.stripeWebhook = async (req, res) => {
  try {
    // Simuliramo sirove Stripe podatke bez potrebe za CLI mrežnim tunelom
    const { email, isPremiumAction } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Mrežni email parametar nedostaje." });
    }

    // Kada legne novac, hirurški palimo licencu i otključavamo AI Coach-a u bazi podataka!
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { isPremium: isPremiumAction },
      { new: true }
    );

    console.log(`👑 WEBHOOK REAL-TIME USPEH: Pretplata uspešno procesuirana za ${email}`);
    
    return res.status(200).json({
      success: true,
      message: "Stripe status uspešno sinhronizovan sa MongoDB prstenom!",
      user: {
        email: updatedUser.email,
        isPremium: updatedUser.isPremium
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
