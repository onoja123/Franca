const express = require("express")
const router = express()


const tutorController = require("../controllers/tutorController")

router.route("/create").post(tutorController.createProfile)

router.route("/allstudent").get(tutorController.getAllStudents)

router.route("/getprofile").get(tutorController.getprofile)

router.route("/edit/:id").patch(tutorController.updateUser)


module.exports = router;