const { test, describe } = require('node:test');
const assert = require('node:assert');

const listHelper = require('../utils/list_helper');

describe('most blog', () => {
  const mostBlogAuthor = {
    author: 'Robert C. Martin',
    blogs: 3,
  };

  test('author with the most blog', () => {
    const result = listHelper.mostBlog(listHelper.blogList);
    assert.deepStrictEqual(result, mostBlogAuthor);
  });
});
