const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');


//Get users profile
exports.getprofile = catchAsync(async(req, res, next)=>{
  const details = await User.find()

  res.status(201).json({
    status: "Sucess",
    data:{
      new: details
    }
  })
})


//create Profile
exports.createuser = catchAsync(async(req, res, next)=>{

  const {name, is_student, profile_picture, short_bio, phone_number, address, email} = req.body
 
    const newUser = await User.create(
      {
      name: name,
      is_student: is_student,
      profile_picture: profile_picture,
      short_bio: short_bio,
      phone_number: phone_number,
      address: address,
      email: email
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

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
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
  const de = await User.findByIdAndDelete(req.params.id, req.body)

  if (!del) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status:"sucess",
    data: null
  })
})
