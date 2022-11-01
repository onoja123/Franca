const express = require("express")
const router = express()

const authController = require("./../controllers/auth")
//signup users
router.route("/signup")
.post(authController.signUp)

//signup users
router.route("/login")
.post(authController.login)


module.exports = router;