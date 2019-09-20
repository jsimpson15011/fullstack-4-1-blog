const express = require('express')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const app = express()

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl, {useNewUrlParser: true, useFindAndModify: false})

app.use(cors())
app.use(bodyParser.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

module.exports = app