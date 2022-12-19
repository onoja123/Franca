const express = require("express")

const router = express()
const blogController = require("./../controllers/blogController")
const authController = require("./../controllers/authController")

router.route("/createBlog").post(blogController.createPost)
router.route("/getAllBlogs").get(blogController.getAllBlog)
router.route("/getAllBlogs/:id").get(blogController.getAllBlog)
router.route("/editBlog/:id").post(blogController.editPost)
router.route("/getBlog").get(blogController.findPost)
router.route("/deletePost").delete(blogController.deletePost)

module.exports = router;