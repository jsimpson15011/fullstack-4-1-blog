const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (likes, blog) => {
        return likes + blog.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (favorite, blog) => {
        return blog.likes >= favorite.likes ?
            blog
            : favorite
    }

    return blogs.reduce(reducer, {title: "No Blogs", likes: "0"})
}

const mostBlogs = (blogs) => {
    const groupedBlogs = _.groupBy(blogs, 'author')
    const reducer = (highest, blogCollection) => {
        return blogCollection.length >= highest.length ?
            blogCollection
            : highest
    }
    const blogsArray = _.values(groupedBlogs).reduce(reducer, [])

    return {
        author: blogsArray[0].author,
        blogs: blogsArray.length
    }
}

const mostLikes = (blogs) => {
    const groupedBlogs = _(blogs).groupBy('author')
        .map((objs, key) => ({
            'author': key,
            'likes': _.sumBy(objs, 'likes')
        }))
        .value()
    const reducer = (highest, currentAuthor) => {
        return currentAuthor.likes > highest.likes?
            currentAuthor
            :highest
    }
    return groupedBlogs.reduce(reducer)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}