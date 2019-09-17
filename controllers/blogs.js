const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (e) {
    console.log(e)
  }
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const result = await blog.save()
  if (blog.title || blog.url) {
    response.status(201).json(result)
  } else {
    response.status(400).json(result)
  }

})

module.exports = blogsRouter