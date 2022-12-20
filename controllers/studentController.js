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


exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
}


//Get uers profile
exports.getprofile = catchAsync(async(req, res, next)=>{
  const data = await User.find({_id: req.user._id}).select({auth_id:0, _id:0})
  res.status(201).json({
    status: "Sucess",
    data:{
      new: data
    }
  })
})


//create Profile
exports.createuser = catchAsync(async(req, res, next)=>{

  const {auth_id, is_student, profile_picture, short_bio, phone_number, address} = req.body
 
    const newUser = await User.create(
      {
      auth_id: auth_id,
      is_student: is_student,
      profile_picture: profile_picture,
      short_bio: short_bio,
      phone_number: phone_number,
      address: address,
    }
      )
  
      res.status(201).json({
        status: "sucess",
        data: {
          new: newUser
        }
      })
})
  

//update profile
exports.updateUser = catchAsync(async (req, res, next) => {
  if(req.body.password || req.body.passwordConfirm){
    return next(new AppError("This is not the route for password update"), 404)
  }

  //filter out unwated field name that are not allowed to be updated
  const filter = filterObj(req.body, "name", "email", "profile_picture")
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
    status:"sucess",
    data: null
  })
})
