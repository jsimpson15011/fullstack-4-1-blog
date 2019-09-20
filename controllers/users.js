const usersRouter = require('express').Router()
const User = require('../models/user')

const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.find({})

    response.json(users)
  } catch (e) {
    console.log(e)
  }

})

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
  }catch (e) {
    console.log(e)
  }
})

module.exports = usersRouter