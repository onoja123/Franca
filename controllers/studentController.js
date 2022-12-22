const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require("./../utils/appError")


const filterObj = (obj, ...allowedFields)=>{
  const newObj = {}
  Object.keys(filterObj).forEach(el =>{
    if(allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}


//Get uers profile
exports.getprofile = catchAsync(async(req, res, next)=>{
  const user = await User.findById(req.user)
  if(!user) return next(new AppError('Please login', 400))
  res.status(200).json({
    status: true,
    data:{
      new: user
    }
  })
})



//update profile
exports.updateUser = catchAsync(async (req, res, next) => {
  if(req.body.password || req.body.passwordConfirm){
    return next(new AppError("This is not the route for password update"), 404)
  }

  //filter out unwated field name that are not allowed to be updated
  const filter = filterObj(req.body,  "email")
    const updatedUser = await User.findByIdAndUpdate(req.params.id, filter , {
      new: true,
      runValidators: true
  })

  if (!updatedUser) {
    return next(new AppError('No user found with that ID', 404));
  }
      res.status(200).json({
        status: 'success',
         data: {
         user: updatedUser
      }
    }
  )
});

exports.deleteUser = catchAsync(async(req, res, next)=>{
  const de = await User.findByIdAndDelete(req.User.id, {active: false})

  if (!del) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).json({
    status:true,
    data: null
  })
})

