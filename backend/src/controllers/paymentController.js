const User = require('../models/User');
const logger = require('../utils/logger');

exports.createCheckout = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    user.isPremium = true;
    await user.save();
    logger.info('[SIMULACIJA] Premium uspesno aktiviran za: ' + userId);
    return res.status(200).json({ success: true, data: { url: 'http://localhost:3000/dashboard?success=true' } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.status(200).json({ success: true, data: { isPremium: Boolean(user?.isPremium) } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.stripeWebhook = async (req, res) => {
  return res.json({ received: true });
};
