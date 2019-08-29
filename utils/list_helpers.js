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
        return blog.likes >= favorite.likes?
            blog
            :favorite
    }

    return blogs.reduce(reducer,{title:"No Blogs", likes:"0"})
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}