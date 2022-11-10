const express = require("express")
const router = express()

const studentcontroller = require("../controllers/studentController")
const authController = require("../controllers/authController")


router.route("/updateUser")
.patch(authController.protect, studentcontroller.updateUser)

module.exports = router;