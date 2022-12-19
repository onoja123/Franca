const express = require("express")

const router = express()
const messageController = require("./../controllers/messageControlleer")

router.route("/create").post(messageController.create)
router.route("/get/:messageId").get(messageController.getId)
module.exports = router;