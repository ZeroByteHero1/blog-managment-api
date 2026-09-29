const fs = require("fs");
const path = require("path");
const Blog = require("../models/Blog");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const parseTags = (tags) => {
  if (tags === undefined) return undefined;
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
  const str = String(tags).trim();
  if (str.startsWith("[")) {
    try {
      return JSON.parse(str).map((t) => String(t).trim()).filter(Boolean);
    } catch (e) {
      /* fall through to comma split */
    }
  }
  return str.split(",").map((t) => t.trim()).filter(Boolean);
};

const removeImage = (imagePath) => {
  if (!imagePath) return;
  const full = path.join(__dirname, "..", "..", imagePath.replace(/^\//, ""));
  fs.unlink(full, () => {});
};

// POST /api/blogs
const createBlog = asyncHandler(async (req, res) => {
  const { title, content, authorName, tags } = req.body;

  if (!title || !content) {
    if (req.file) removeImage(`/uploads/${req.file.filename}`);
    throw new ApiError(400, "title and content are required");
  }

  const blog = await Blog.create({
    title,
    content,
    authorName: authorName || req.user.name,
    tags: parseTags(tags) || [],
    blogImage: req.file ? `/uploads/${req.file.filename}` : "",
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, message: "Blog created", blog });
});

// GET /api/blogs
const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: blogs.length, blogs });
});

// GET /api/blogs/:id
const getSingleBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy", "name email");
  if (!blog) throw new ApiError(404, "Blog not found");
  res.json({ success: true, blog });
});

// PUT /api/blogs/:id  (creator only)
const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    if (req.file) removeImage(`/uploads/${req.file.filename}`);
    throw new ApiError(404, "Blog not found");
  }

  if (blog.createdBy.toString() !== req.user._id.toString()) {
    if (req.file) removeImage(`/uploads/${req.file.filename}`);
    throw new ApiError(403, "You can only update your own blogs");
  }

  const { title, content, authorName, tags } = req.body;
  if (title !== undefined) blog.title = title;
  if (content !== undefined) blog.content = content;
  if (authorName !== undefined) blog.authorName = authorName;
  if (tags !== undefined) blog.tags = parseTags(tags);

  if (req.file) {
    removeImage(blog.blogImage);
    blog.blogImage = `/uploads/${req.file.filename}`;
  }

  await blog.save();
  res.json({ success: true, message: "Blog updated", blog });
});

// DELETE /api/blogs/:id  (creator only)
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError(404, "Blog not found");

  if (blog.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own blogs");
  }

  removeImage(blog.blogImage);
  await blog.deleteOne();

  res.json({ success: true, message: "Blog deleted" });
});

module.exports = { createBlog, getAllBlogs, getSingleBlog, updateBlog, deleteBlog };
