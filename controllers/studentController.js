const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require("./../utils/appError")
const Blog = require("../models/postModel")


exports.getAll = catchAsync(async(req, res, next)=>{
  const user = await User.find()

    if(!user) {
      return next(new AppError('Please login',400))
    }
  res.status(200).json({
    status: true,
    result: user.length,
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


