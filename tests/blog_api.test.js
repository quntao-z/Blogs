const { test, after, beforeEach } = require('node:test');
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

  for (const blog of blogList) {
    const blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are six notes', async () => {
  const response = await api.get('/api/blogs');

  assert.strictEqual(response.body.length, 6);
});

after(async () => {
  await mongoose.connection.close();
});
