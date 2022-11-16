const cloudinary = require("cloudinary")
const {CloudinaryStorage} = require("multer-storage-cloudinary")
const multer = require("multer")
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "franca"
    }
})

const upload = multer({storage: storage});

exports.upload = upload