const express = require("express")

const router = express()
const messageController = require("../controllers/messageControlleer")
const authController = require("../controllers/authController")



router.route("/create").post(authController.protect ,messageController.addMessage)
router.route("/get/:chatId").get(authController.protect ,messageController.getChat)

module.exports = router;