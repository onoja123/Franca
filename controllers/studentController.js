const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require("./../utils/appError")
const Blog = require("../models/blogModel")


exports.getAll = catchAsync(async(req, res, next)=>{
  const user = await User.find()

    if(!user) {
      return next(new AppError('Please login',400))
    }
  res.status(200).json({
    status: true,
    data:{
      new: user
    }
  })
})


//Get users profile
exports.getprofile = catchAsync(async(req, res, next)=>{
  const user = await User.findById(req.params.id).select("email")
  if(!user) return next(new AppError('Please login', 400))
  res.status(200).json({
    status: true,
    data:{
      new: user
    }
  })
})


//update profile
exports.update = catchAsync(async(req, res, next)=>{
  
  const update = {short_bio: req.body.short_bio, phone_number:req.body.phone_number, address:req.body.address}
 
  const updatedDocument = await User.findOneAndUpdate(req.params.id, update, { new: true });
 
  if (!updatedDocument) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
     data: {
     user: updatedDocument,
  }
}
  )
})

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


//Create a request
exports.request = catchAsync(async(req, res, next)=>{
  const {title, request, userId } = req.body;

  const data = await Blog.create({
    title,
    request,
    userId
  })
  res.status(201).json({
    status: true,
    data
  })

})

//Get the request
exports.getRequest = catchAsync(async(req, res, next)=>{
  const data = await Blog.findById(req.params.id)
    res.status(200).json(
      {
        status: true,
        data
      }
    )
})



//Delete the request