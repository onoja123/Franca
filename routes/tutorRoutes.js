const express = require("express")
const router = express()

const authController = require("../controllers/authController")
const tutorController = require("../controllers/tutorController")

//Query all student
// router.route("/allstudent").get(tutorController.getAllStudents)


// router.patch("/edit/:id", upload.single("image"), async (req, res) => {
//     try {
//       let user = await User.findById(req.params.id);
//      const result = await cloudinary.uploader.upload(req.file.path);
  
//       const data = {
//         short_bio: req.body.short_bio, 
//         phone_number:req.body.phone_number, 
//         address:req.body.address,
//         avatar: result?.secure_url || user.avatar,
//         cloudinary_id: result?.public_id || user.cloudinary_id,
//       };
//       user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
//       res.status(200).json({
//         status: true,
//          user
//       })
//     } catch (err) {
//       res.status(400).json({
//         status: false,
//          message: "Please set your profile and try again"
//       })
//     }
//   });

//Get profile
router.route("/getprofile").get(tutorController.getprofile)


module.exports = router;