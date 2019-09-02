const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test-helper')
const app = require('../app')
const api = supertest(app)

beforeEach(async () =>{
  await Blog.deleteMany({})

  const blogObjects = helper
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(note => note.save())
  await Promise.all(promiseArray)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(helper.length)
})

afterEach(() =>{
  mongoose.disconnect()
})