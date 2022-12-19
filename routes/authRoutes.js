const express = require("express")
const router = express()

const authController = require("../controllers/authController")


//signup users
router.post('/signup', authController.signup);

//login users
router.post('/login', authController.login);

//ForgotPassword
router.post('/forgotPassword', authController.forgotPassword);

//ResetPassword
router.patch('/resetPassword/:token', authController.resetPassword);

//UpdatePassword
router.route("/updatePassword")
.patch(authController.protect, authController.updatePassword)

router.route('/logout').get(authController.protect ,authController.logout);

module.exports = router;