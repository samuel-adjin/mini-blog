const router = require('express').Router();
const{register,verifyEmail,login,resetLink,resetPassword} = require('../controllers/auth');
const { permChecker } = require('../permissions/permission');

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/verify-email').post(verifyEmail);
router.route('/reset-link').post(resetLink);
router.route('/reset-password').post(resetPassword);




module.exports = router;