const Tutor = require('../models/tutorModel');
const catchAsync = require('./../utils/catchAsync');
const User = require("../models/userModel")


// exports.getAllStudents = catchAsync(async(req, res, next)=>{
//   // const stud = new apiFeature(student.find(), req.query)
//   // .filter()
//   // .sort()
//   // .limitFields()
//   // .pagination();


//   res.status(200).json({
//     status: "sucess",
//     data: {
//       new: all
//     }
//   })
// })


//Get users profile
exports.getprofile = catchAsync(async(req, res, next)=>{
  const details = await Tutor.findById(req.params.id)

  res.status(201).json({
    status: "Sucess",
    data:{
      new: details
    }
  })
})

  
exports.deleteUser = catchAsync(async(req, res, next)=>{
  const de = await Tutor.findByIdAndDelete(req.User.id, {active: false})

  if (!del) {
    return next(new AppError('No Tutor found with that ID', 404));
  }

  res.status(204).json({
    status:true,
    data: null
  })
})
//create courses

//edit courses

//delete courses



