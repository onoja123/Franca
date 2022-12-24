const express = require("express")

const router = express()
const chatController = require("../controllers/chatController")
const authController = require("../controllers/authController")


router.route("/getusers").get(authController.protect, chatController.getUsers)
router.route("/create").post(authController.protect ,chatController.createChat)
router.route("/get/:userId").get(authController.protect ,chatController.findChat)
router.route("/find/:firstId/:secondId").get(authController.protect, chatController.findTwo)

module.exports = router;