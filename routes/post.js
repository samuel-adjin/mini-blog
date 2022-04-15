const router = require('express').Router();
const {searchPost,deletePost,getPost,showAllPost,editPost,createPost} = require('../controllers/post');
const verifytoken = require('../middleware/auth')
const {setPost,permChecker,roleChecker}  = require("../permissions/permission")


router.route('/').get(verifytoken,showAllPost).post(verifytoken,createPost).get(verifytoken,searchPost);;
router.route('/:id').get(verifytoken,getPost).put(verifytoken,setPost,editPost).delete(verifytoken,setPost,(req, res, next) => permChecker("delete-post", req, res, next),deletePost);


module.exports = router;