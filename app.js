const express = require('express')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const app = express()

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl, {useNewUrlParser: true, useFindAndModify: false})

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.getTokenFrom)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.errorHandler)

module.exports = app