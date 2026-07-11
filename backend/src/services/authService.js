const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const env = require("../config/envConfig");

const createAccessToken = (user) =>
  jwt.sign(
    {
      id: user._id.toString(),
      isPremium: user.isPremium,
    },
    env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );

const createRefreshToken = () => crypto.randomBytes(64).toString("hex");

const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "none",
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/",
});

const attachRefreshCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, getCookieOptions());
};

const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", {
    ...getCookieOptions(),
    maxAge: 0,
    expires: new Date(0),
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  attachRefreshCookie,
  clearRefreshCookie,
  getCookieOptions,
};
