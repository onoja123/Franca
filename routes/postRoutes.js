const express = require("express")

const router = express()
const postController = require("../controllers/postController")
const authController = require("../controllers/authController")

router.route("/getallpost").get(authController.protect, postController.getAllPost)

router.route("/createpost").post(authController.protect, postController.createPost)

router.route("/getpost/:id").get(authController.protect, postController.findPost)

router.route("/editpost/:id").patch(authController.protect, postController.editPost)

router.route("/deletepost/:id").delete(authController.protect, postController.deletePost)

module.exports = router;