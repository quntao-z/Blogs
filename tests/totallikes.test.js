const { test, describe } = require('node:test');
const assert = require('node:assert');

const listHelper = require('../utils/list_helper');

describe('total likes', () => {
  test('total like in blog', () => {
    const result = listHelper.totalLikes(listHelper.blogList);
    assert.strictEqual(result, 36);
  });
});
