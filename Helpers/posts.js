const getUserPost = (user,post)=>{

    return post.postedBy === user._id
}

module.exports = {getUserPost}