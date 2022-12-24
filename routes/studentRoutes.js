const express = require("express")
const router = express()

const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const User = require("./../models/userModel");

const studentcontroller = require("../controllers/studentController")
const authController = require("./../controllers/authController")



//Edit student image
router.patch("/edit/:id", upload.single("image"), async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
   const result = await cloudinary.uploader.upload(req.file.path);

    const data = {
      short_bio: req.body.short_bio, 
      phone_number:req.body.phone_number, 
      address:req.body.address,
      avatar: result?.secure_url || user.avatar,
      cloudinary_id: result?.public_id || user.cloudinary_id,
    };
    user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({
      status: true,
       user
    })
  } catch (err) {
    res.status(400).json({
      status: false,
       message: "Please set your profile and try again"
    })
  }
});

  //Get all students
router.get("/get/all", studentcontroller.getAll)

//Get profile
router.route("/getprofile/:id").get(authController.protect ,studentcontroller.getprofile)

//create a request

router.post("/create/request", studentcontroller.request)

router.get("/get/:id", studentcontroller.getRequest)

//Delete account
router.route("/delete/:id").delete(authController.restrict("admin") , authController.protect ,studentcontroller.deleteUser)

module.exports = router;