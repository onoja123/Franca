const express = require("express")
const router = express()

const userController = require("../controllers/user")


router.route("/")
.get(userController.getUsers)
.post(userController.createUser)

router.route("/:id").get(userController.findUser)


module.exports = router;