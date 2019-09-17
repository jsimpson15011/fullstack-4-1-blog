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
  try {
    const result = await blog.save()
    if (blog.title || blog.url) {
      response.status(201).json(result)
    } else {
      response.status(400).json(result)
    }
  } catch (e) {
    console.log(e)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (e) {
    console.log(e)
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, {new: true})
    response.json(updatedBlog.toJSON())
  } catch (e) {
    console.log(e)
  }
})

module.exports = blogsRouter