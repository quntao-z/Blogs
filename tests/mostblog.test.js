const listHelper = require('../utils/list_helper');

const mostBlogAuthor = {
  author: 'Robert C. Martin',
  blogs: 3,
};

describe('most blog', () => {
  test('author with the most blog', () => {
    const result = listHelper.mostBlog(listHelper.blogList);
    expect(result).toEqual(mostBlogAuthor);
  });
});
