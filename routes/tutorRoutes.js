const express = require("express")
const router = express()


const tutorController = require("../controllers/tutorController")
const authController = require("../controllers/authController")

router.route("/create").post(tutorController.createProfile)

router.route("/getprofile").get(tutorController.getprofile)

router.route("/edit/:id").patch(tutorController.updateUser)

module.exports = router;