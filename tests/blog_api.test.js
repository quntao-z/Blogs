const {
  test, after, beforeEach, describe,
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

describe('addition of new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      _id: '5a422a851b54a676234d17fd',
      title: 'Awesome Blog Post',
      author: 'Awesome Author',
      url: 'https://awesomeblog.com/',
      likes: 10,
      __v: 0,
    };

    await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    const titles = response.body.map((blog) => blog.title);

    assert.strictEqual(response.body.length, blogList.length + 1);

    assert(titles.includes('Awesome Blog Post'));
  });

  test('blog without likes can be added', async () => {
    const newBlog = {
      _id: '5a422a851b54a676234d17fd',
      title: 'Awesome Blog Post',
      author: 'Awesome Author',
      url: 'https://awesomeblog.com/',
    };

    await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    const titles = response.body.map((blog) => blog.title);

    assert.strictEqual(response.body.length, blogList.length + 1);

    assert(titles.includes('Awesome Blog Post'));
  });

  test('blog without title are not added', async () => {
    const newBlog = {
      _id: '5a422a851b54a676234d17fd',
      author: 'Awesome Author',
      url: 'https://awesomeblog.com/',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);

    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, blogList.length);
  });

  test('blog without url are not added', async () => {
    const newBlog = {
      title: 'Awesome Blog Post',
      _id: '5a422a851b54a676234d17fd',
      author: 'Awesome Author',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);

    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, blogList.length);
  });
});

describe('deletion of new blog', () => {
  test('deleting a single blog post', async () => {
    const deleteBlogId = blogList[0]._id;

    await api.delete(`/api/blogs/${deleteBlogId}`).expect(204);

    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, blogList.length - 1);
  });
});

describe('updating blog', () => {
  test('updating likes of a blog', async () => {
    const deleteBlogId = blogList[0]._id;

    const updatedBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 10,
    };

    const response = await api.put(`/api/blogs/${deleteBlogId}`).send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.likes, 10);
  });
});

after(async () => {
  await mongoose.connection.close();
});
