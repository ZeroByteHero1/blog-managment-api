const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Every blog route requires a valid JWT
router.use(protect);

router
  .route("/")
  .get(getAllBlogs)
  .post(upload.single("blogImage"), createBlog);

router
  .route("/:id")
  .get(getSingleBlog)
  .put(upload.single("blogImage"), updateBlog)
  .delete(deleteBlog);

module.exports = router;
