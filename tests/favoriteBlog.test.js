const listHelper = require('../utils/list_helper');

describe('favorite blog', () => {
  const blog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12,
  };
  test('find favorite blog with the most likes', () => {
    const result = listHelper.favoriteBlog(listHelper.blogList);
    expect(result).toEqual(blog);
  });
});
