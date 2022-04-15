const router = require('express').Router();
const { showAllUsers, getUser, updateUser, deleteUser, searchUser, token, lockAccount,allUserPost } = require('../controllers/user');
const verifytoken = require('../middleware/auth')
const { roleChecker, permChecker } = require('../permissions/permission')
const decodeRefreshToken = require("../middleware/refreshDecoder");



router.route('/:id')
.put(verifytoken, updateUser)
.delete(verifytoken, (req, res, next) => roleChecker("Admin", req, res, next), deleteUser)
.get(verifytoken, getUser)
.post(verifytoken, (req, res, next) => permChecker("lock-account", req, res, next), lockAccount);

router.route('/post/:id').get(verifytoken,allUserPost);
router.route('/token').post(decodeRefreshToken,token);
router.route('/').get(verifytoken, showAllUsers).get(verifytoken, searchUser);


module.exports = router;