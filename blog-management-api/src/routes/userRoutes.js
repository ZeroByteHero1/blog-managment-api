const express = require("express");
const { getProfile, updateProfile } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);
router.route("/me").get(getProfile).put(updateProfile);

module.exports = router;
