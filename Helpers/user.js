const isUser = (user,id)=>{
    return user._id === id;
}

module.exports = {isUser}