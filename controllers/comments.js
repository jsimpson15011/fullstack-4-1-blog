const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')

commentsRouter.get('/:id/comments', async (request, response, next) => {
  try {
    const comments = await Comment.find({blog: request.params.id})
    response.json(comments)
  } catch (e) {
    next(e)
  }
})

commentsRouter.post('/:id/comments', async (request, response, next) => {
  const body = request.body

  try {
    if (body.comment){
      const blog = await Blog.findById(request.params.id)
      const comment = new Comment({
        comment: body.comment,
        blog: blog.id
      })

      const savedComment = await comment.save()
      blog.comments = blog.comments.concat(savedComment.id)

      await blog.save()

      response.status(201).json(savedComment)
    } else {
     response.status(400).json('comment must not be empty')
    }
  } catch (e) {
    next(e)
  }
})

module.exports = commentsRouter