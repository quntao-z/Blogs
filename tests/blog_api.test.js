const {
  test, after, beforeEach, expect,
} = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const listHelper = require('../utils/list_helper');
const Blog = require('../models/blog');

const api = supertest(app);

const { blogList } = listHelper;

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = blogList.map((blog) => new Blog(blog));
  const promiseBlogArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseBlogArray);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are six notes', async () => {
  const response = await api.get('/api/blogs');

  assert.strictEqual(response.body.length, blogList.length);
});

test('property id exist', async () => {
  const response = await api.get('/api/blogs');

  response.body.forEach((blog) => assert.ok(blog.id !== undefined, 'blog.id is not defined'));
});

test('a valid blog can be added', async () => {
  const newBlog = new Blog({
    _id: '5a422a851b54a676234d17fd',
    title: 'Awesome Blog Post',
    author: 'Awesome Author',
    url: 'https://awesomeblog.com/',
    likes: 10,
    __v: 0,
  });

  await api.post('/api/blogs').send(newBlog.toJSON()).expect(201).expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');

  const titles = response.body.map((blog) => blog.title);

  assert.strictEqual(response.body.length, blogList.length + 1);

  assert(titles.includes('Awesome Blog Post'));
});

test('blog without likes can be added', async () => {
  const newBlog = new Blog({
    _id: '5a422a851b54a676234d17fd',
    title: 'Awesome Blog Post',
    author: 'Awesome Author',
    url: 'https://awesomeblog.com/',
  });

  await api.post('/api/blogs').send(newBlog.toJSON()).expect(201).expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');

  const titles = response.body.map((blog) => blog.title);

  assert.strictEqual(response.body.length, blogList.length + 1);

  assert(titles.includes('Awesome Blog Post'));
});

test('blog without title or url are not added', async () => {
  const newBlog = {
    _id: '5a422a851b54a676234d17fd',
    author: 'Awesome Author',
    url: 'https://awesomeblog.com/',
  }

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(400)

  const response = await api.get('/api/blog')

  assert.strictEqual(response.body.length, blogList.length)

});

after(async () => {
  await mongoose.connection.close();
});
