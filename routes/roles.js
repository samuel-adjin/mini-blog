const router = require("express").Router();
const{addRole,removeRole} = require("../controllers/role");
const{roleChecker} = require("../permissions/permission");
const verifyToken = require("../middleware/auth");

router.route('/add-role/:id').post(verifyToken,(req,res,next)=> roleChecker("Admin",req,res,next),addRole);
router.route('/remove-role/:id').post(verifyToken,(req,res,next)=> roleChecker("Admin",req,res,next),removeRole);


module.exports = router;