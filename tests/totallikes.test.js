const listHelper = require('../utils/list_helper');

describe('total likes', () => {
  test('total like in blog', () => {
    const result = listHelper.totalLikes(listHelper.blogList);
    expect(result).toBe(36);
  });
});
