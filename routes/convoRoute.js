const express = require("express")

const router = express()
const conversationController = require("./../controllers/conversationController")

router.route("/create").post(conversationController.create)
router.route("/get/:userId").get(conversationController.getId)


module.exports = router;