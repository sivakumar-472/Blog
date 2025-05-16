const Blog = require('../models/Blog');

exports.getBlogs = async (req, res) => {
  const { category, author } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (author) filter.author = author;

  try {
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createBlog = async (req, res) => {
  const { title, category, content, image } = req.body;
  const userId = req.user._id; // from auth middleware
  const author = req.user.name;

  try {
    const blog = new Blog({
      title,
      category,
      content,
      image,
      userId,
      author,
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBlog = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.user._id;
  const { title, category, content, image } = req.body;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    blog.title = title || blog.title;
    blog.category = category || blog.category;
    blog.content = content || blog.content;
    blog.image = image || blog.image;
    blog.updatedAt = Date.now();

    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteBlog = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.user._id;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await blog.remove();
    res.status(200).json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
