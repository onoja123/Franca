const user = require("./../models/user")
const catchAsync = require("./../utils/catchAsync")

exports.getUsers = catchAsync(async(req, res, next) =>{
        const all = await user.find()

        res.status(200).json({
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

        res.status(200).json({
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

exports.updateUser = catchAsync(async(req, res, next)=>{
    const updated = await user.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json({
        status: "sucess",
        data: {
            new: updated
        }
    })
})


exports.deleteUser = catchAsync(async(req, res, next)=>{
    const del = await user.findByIdAndDelete(req.params.id, req.body)
    res.status(200).json({
        status: "sucess",
        message: "deleted user sucessfully",
        data: {
            new: null
        }
    })
})