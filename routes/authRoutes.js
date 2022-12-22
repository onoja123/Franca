const express = require("express")
const router = express()

const authController = require("../controllers/authController")


//signup users
router.post('/signup', authController.signup);

//login users
router.post('/login', authController.login);
//ForgotPassword
router.post('/forgotPassword', authController.forgotPassword);

//Reset Password
router.patch('/resetPassword/:token', authController.resetPassword);

//Logout
router.route('/logout').get(authController.logout);

module.exports = router;