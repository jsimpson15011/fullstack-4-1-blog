const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
  } catch (e) {
    console.log(e)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const token = request.token

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({error: 'token missing or invalid'})
    }

    if (body.title || body.url) {
      const user = await User.findById(decodedToken.id)

      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes ? body.likes : 0,
        user: user._id
      })

      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()

      response.status(201).json(savedBlog)
    } else {
      response.status(400).json('missing title or url')
    }
  } catch (e) {
    console.log(e)
    response.status(400).json(e)
    next()
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const token = request.token

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const blogId = request.params.id

    if (!token || !decodedToken.id) {
      return response.status(401).json({error: 'token missing or invalid'})
    }

    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(blogId)

    console.log(user._id, blog.user._id)
    if ( user._id.toString() === blog.user.toString() ){
      await Blog.findByIdAndRemove(blogId)
      response.status(204).end()
    } else {
      response.status(401).json('you are not the owner of this blog')
    }

  } catch (e) {
    response.status(400)
    next(e)
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