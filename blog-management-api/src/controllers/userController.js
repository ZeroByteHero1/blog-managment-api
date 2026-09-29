const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/users/me
const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// PUT /api/users/me
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phoneNumber, password } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (name !== undefined) user.name = name;
  if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
  if (password !== undefined) {
    if (password.length < 6) throw new ApiError(400, "Password must be at least 6 characters");
    user.password = password; // hashed by pre-save hook
  }

  await user.save();
  const updated = await User.findById(user._id);

  res.json({ success: true, message: "Profile updated", user: updated });
});

module.exports = { getProfile, updateProfile };
