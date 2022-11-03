const express = require('express')

const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const router = express.Router()



router.route("/")
.get(authController.protect ,userController.getUsers)
.post(userController.createUser)

//Only admin can delete user
router.route("/:id")
.get(userController.findUser)
.delete(authController.protect ,authController.restrict("admin"),userController.deleteUser)
.patch(userController.updateUser)


module.exports = router;

