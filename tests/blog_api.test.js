const { test, after, beforeEach, expect } = require('node:test');
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

  assert.strictEqual(response.body.length, 6);
});

test('property id exist', async () => {
  const response = await api.get('/api/blogs');

  response.body.forEach((blog) => assert.ok(blog.id !== undefined, 'blog.id is not defined'));
});

after(async () => {
  await mongoose.connection.close();
});
