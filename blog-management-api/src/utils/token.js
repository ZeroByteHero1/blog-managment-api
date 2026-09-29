const jwt = require("jsonwebtoken");

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: (Number(process.env.COOKIE_EXPIRES_DAYS) || 7) * 24 * 60 * 60 * 1000,
});

const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id);
  res
    .status(statusCode)
    .cookie("token", token, cookieOptions())
    .json({ success: true, message, token, user });
};

module.exports = { generateToken, cookieOptions, sendTokenResponse };
