const multer = require("multer")
const path = require("path")

const {
    nextTick
} = require("process")
const fs = require("fs")

/** @type {*} */
const storage = multer.diskStorage({
    destination: (req, res, cb) =>{
        var dir = "./public/upload/";
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir)
        }
        cb(null,dir)
    },
    filename: (req,res, cb) =>{
        cb(null, file.filename + "-"+ "FRANCA" + "-" + Date.now() + path.extname(file.originalname));
    }
}) 

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} cb
 */
const filefilter = (req, res, cb) =>{
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg"){
    cb(null, true)
    
    }else {
        console.log("fail to upload file extension not suported")
        cb(null, false)
    }
}

upload = multer({
    storage: storage,
    limit: 1024 * 1024 * 5,
    filefilter: filefilter
});

module.exports = helper;


