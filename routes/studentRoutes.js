const express = require("express")
const router = express()

const studentcontroller = require("../controllers/studentController")
const authController = require("./../controllers/authController")


router.route("/create").post(studentcontroller.createuser)

router.route("/getprofile").get(studentcontroller.getprofile)

router.route("/edit/:id").patch(studentcontroller.updateUser)

router.route("/delete/:id").delete(authController.restrict("admin") ,studentcontroller.deleteUser)

module.exports = router;