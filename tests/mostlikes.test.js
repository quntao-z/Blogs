const { test, describe } = require('node:test');
const assert = require('node:assert');

const listHelper = require('../utils/list_helper');

describe('most likes', () => {
  const blog = {
    author: 'Edsger W. Dijkstra',
    likes: 17,
  };
  test('find favorite author with the most likes', () => {
    const result = listHelper.mostLikes(listHelper.blogList);
    assert.deepStrictEqual(result, blog);
  });
});
