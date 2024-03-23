const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const { body } = request;

  if (body.title == null || body.url == null) {
    response.status(400).json({ error: 'Title and URL are required' });
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
    });

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const { body } = request;

  const updatedBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });

  await Blog.findByIdAndDelete(request.params.id, updatedBlog, { new: true, runValidators: true, context: 'query' });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
