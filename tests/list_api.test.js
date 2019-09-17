const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test-helper')
const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
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

test('identifier property is named id', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

test('making a POST request adds a new blog', async () => {
  const newBlog = {
    "title": "Test Blog",
    "author": "Test Man",
    "url": "https://reactpatterns.com/",
    "likes": 7
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
  const blogs = await api.get('/api/blogs')

  expect(blogs.body.length).toBe(helper.length+1)
  expect(blogs.body[blogs.body.length-1]).toEqual(expect.objectContaining(newBlog))
})

test('if likes are not defined the value should default to zero', async () => {
  const newBlog = {
    "title": "Test Blog",
    "author": "Test Man",
    "url": "https://reactpatterns.com/"
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
  const blogs = await api.get('/api/blogs')

  expect(blogs.body[blogs.body.length-1].likes).toBe(0)
})

test('if title and url properties are missing the server will respond with 400', async () => {
  const newBlog = {
    "author": "Test Man"
  }
  const response = await api
    .post('/api/blogs')
    .send(newBlog)

  expect(response.status).toEqual(400)
})

afterEach(() => {
  mongoose.disconnect()
})