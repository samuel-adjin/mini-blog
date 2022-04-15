const{PostComment,editComment,deleteComment} = require("../controllers/comment");
const router = require("express").Router();
const verifytoken = require('../middleware/auth')


// router.route("/:id").post(verifytoken,PostComment);
router.route("/:id").put(verifytoken,editComment).delete(verifytoken,deleteComment).post(verifytoken,PostComment);

module.exports = router;