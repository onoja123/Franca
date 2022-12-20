const express = require("express")

const router = express()
const chatController = require("../controllers/chatController")

router.route("/create").post(chatController.createChat)
router.route("/get/:userId").get(chatController.findChat)
router.route("/find/:firstId/:secondId").get(chatController.findTwo)

module.exports = router;