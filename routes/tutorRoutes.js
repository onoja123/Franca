const express = require("express")
const router = express()
const upload = require("../utils/multer")
const cloudinary = require("../utils/cloudinary")
const Tutor = require("../models/tutorModel")
const authController = require("../controllers/authController")
const tutorController = require("../controllers/tutorController")



router.patch("/edit/:id", upload.single("image"), async (req, res) => {
    try {
      let user = await Tutor.findById(req.params.id);
     const result = await cloudinary.uploader.upload(req.file.path);
  
      const data = {
        language_skills: req.params.language_skills,
        eiffiency: req.params.eiffiency,
        cerification: req.body.cerification,
        short_bio: req.body.short_bio, 
        phone_number: req.body.phone_number, 
        address: req.body.address,
        avatar: result?.secure_url || user.avatar,
        cloudinary_id: result?.public_id || user.cloudinary_id,
      };
      user = await Tutor.findByIdAndUpdate(req.params.id, data, { new: true });
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


//Get profile
router.route("/getprofile/:id").get(authController.protect ,tutorController.getprofile)


module.exports = router;