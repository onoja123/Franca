const express = require("express")
const router = express()

const authController = require("../controllers/authController")

//signup users
router.route("/signup")
.post(authController.signup)

//signup users
router.route("/login")
.post(authController.login)

router.route("/forgotPassword")
.post(authController.forgotPassword)

router.route("/resetPassword/:token")
.patch(authController.resetPassword)

router.route("/updatePassword/:token")
.patch(authController.protect, authController.updatePassword)

module.exports = router;