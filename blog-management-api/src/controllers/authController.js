const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { sendTokenResponse, cookieOptions } = require("../utils/token");

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  if (!name || !email || !password || !phoneNumber) {
    throw new ApiError(400, "name, email, password and phoneNumber are required");
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new ApiError(409, "Email already registered");

  const user = await User.create({ name, email, password, phoneNumber });
  const safeUser = await User.findById(user._id);

  sendTokenResponse(safeUser, 201, res, "Registration successful");
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Email and password are required");

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const safeUser = await User.findById(user._id);
  sendTokenResponse(safeUser, 200, res, "Login successful");
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  res
    .clearCookie("token", { ...cookieOptions(), maxAge: undefined })
    .json({ success: true, message: "Logged out successfully" });
});

module.exports = { register, login, logout };
