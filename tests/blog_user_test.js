const {
  test, after, beforeEach, describe,
} = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../app');
const User = require('../models/user');
const helper = require('../utils/list_helper');
const mongoose = require('mongoose');

const api = supertest(app);

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('Swordfish', 10);

    const user = new User({ username: 'root', passwordHash });
    user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'ghopper',
      name: 'Grace Hopper',
      password: 'cobol',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });
});

after(async () => {
  await mongoose.connection.close();
});
