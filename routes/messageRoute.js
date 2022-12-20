const express = require("express")

const router = express()
const messageController = require("../controllers/messageControlleer")

router.route("/create").post(messageController.addMessage)
router.route("/get/:chatId").get(messageController.getChat)
module.exports = router;