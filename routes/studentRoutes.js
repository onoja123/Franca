const express = require("express")
const router = express()
const { upload } = require("./../utils/cloudinary")

const studentcontroller = require("../controllers/studentController")
const authController = require("../controllers/authController")

router.route("/create").post(studentcontroller.createuser)

router.route("/getprofile").get(studentcontroller.getprofile)

router.route("/edit/:id").patch(studentcontroller.updateUser)

module.exports = router;