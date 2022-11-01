const user = require("./../models/user")
const catchAsync = require("./../utils/catchAsync")

exports.getUsers = catchAsync(async(req, res, next) =>{
        const all = await user.find()

        res.statusCode(200).json({
            status: "sucess",
            length: user.length,
            data: {
                new: all
            }
        })
    }
)

exports.createUser = catchAsync(async(req, res, next) =>{
        const newuser = await user.create(req.body)

        res.statusCode(200).json({
            status: "sucess",
            data: {
                new: newuser
            }
        })
    }
)

exports.findUser = catchAsync(async(req, res, next)=>{
    const foundUser = await user.findById(req.params.id)

    res.status(200).json({
        status: "sucess",
        data:{
            new: foundUser
        }
    })
})