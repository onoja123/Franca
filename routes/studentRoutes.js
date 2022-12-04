const express = require("express")
const router = express()

const cloudinary = require("./../utils/cloudinary");
const upload = require("./../utils/multer");
const User = require("./../models/userModel");

const studentcontroller = require("../controllers/studentController")
const authController = require("./../controllers/authController")


//upload student image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create new user
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
    });
    // Save user
    await user.save();
    res.status(201).json({
        status:"success",
        data: user
    });
  } catch (err) {
    res.status(400).json({
        staus: "failed",
        message: "cant post an empty field"
        
    })
  }
});

//Edit student image
router.patch("/:id", upload.single("image"), async (req, res) => {
    try {
      let user = await User.findById(req.params.id);
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(user.cloudinary_id);
      // Upload image to cloudinary
      let result;
      if (req.file) {
        result = await cloudinary.uploader.upload(req.file.path);
      }
      const data = {
        name: req.body.name || user.name,
        email: req.body.name || user.email,
        avatar: result?.secure_url || user.avatar,
        cloudinary_id: result?.public_id || user.cloudinary_id,
      };
      user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
      res.status(200).json({
        status:"success",
        data: user
    });
    } catch (err) {
        res.status(400).json({
            staus: "failed",
            message: "cant edit an empty id field"
        })
    }
  });
  

router.route("/create").post(studentcontroller.createuser)

router.route("/getprofile").get(studentcontroller.getprofile)

router.route("/edit/:id").patch(authController.protect ,studentcontroller.updateUser)

router.route("/delete/:id").delete(authController.restrict("admin") , authController.protect ,studentcontroller.deleteUser)

module.exports = router;