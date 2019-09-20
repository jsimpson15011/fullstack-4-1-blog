const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test-helper')
const app = require('../app')
const api = supertest(app)

describe('when there are notes in the database', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(note => note.save())
    await Promise.all(promiseArray)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body.length).toBe(helper.initialBlogs.length)
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

    expect(blogs.body.length).toBe(helper.initialBlogs.length+1)
    expect(blogs.body[blogs.body.length-1]).toEqual(expect.objectContaining(newBlog))
  })

  test('and likes are not defined the value should default to zero', async () => {
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

  test('POSTs with missing title and url properties will have a status of 400', async () => {
    const newBlog = {
      "author": "Test Man"
    }
    const response = await api
      .post('/api/blogs')
      .send(newBlog)

    expect(response.status).toEqual(400)
  })
})

describe('when there is at least one user in the database', () => {
  beforeEach( async () =>{
    await User.deleteMany({})
    const user = new User ({ username: 'test', password: 'password' })
    await user.save()
  })

  test('creation fails with username or password with less than 3 characters', async () => {
    const newUser = new User ({ username: 'te', password: 'te' })
    const usersAtStart = helper.usersInDb()
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = helper.usersInDb()

    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})