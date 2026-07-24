module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Autentifikacija neuspešna.' });
  }
  if (!req.user.isPremium) {
    return res.status(403).json({ success: false, message: 'Ova AI opcija je zakljucana! Otkljucajte Premium paket za 9.99€.' });
  }
  next();
};
