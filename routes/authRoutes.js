const express = require("express")
const router = express()

const authController = require("../controllers/authController")


//signup users
router.post('/signup', authController.signup);

router.post("/verify/:token", authController.verifyUsersEmail)

//login users
router.post('/login', authController.login);
//ForgotPassword
router.post('/forgotPassword', authController.forgotPassword);

//Reset Password
router.patch('/resetPassword/:token', authController.resetPassword);

router.post("/resendverification", authController.resendVerification);

//Logout
router.route('/logout').post(authController.logout);

module.exports = router;