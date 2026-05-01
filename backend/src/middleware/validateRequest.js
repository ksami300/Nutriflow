module.exports = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: "Validation failed", details });
  }

  req.body = value;
  next();
};
