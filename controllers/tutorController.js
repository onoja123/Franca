const Tutor = require('../models/tutorModel');
const catchAsync = require('./../utils/catchAsync');

//Get users profile
exports.getprofile = catchAsync(async(req, res, next)=>{
  const details = await Tutor.find()

  res.status(201).json({
    status: "Sucess",
    data:{
      new: details
    }
  })
})



//create Profile
exports.createProfile = catchAsync(async(req, res, next)=>{

  const {name, is_tutor, profile_picture, short_bio, phone_number, address, email, language_skill_1, language_skill_2, efficiency, cerification} = req.body
 
    const newUser = await Tutor.create(
        {
        name: name,
        is_tutor: is_tutor,
        profile_picture: profile_picture,
        short_bio: short_bio,
        phone_number: phone_number,
        address: address,
        email: email,
        language_skill_1: language_skill_1,
        language_skill_2: language_skill_2,
        efficiency: efficiency,
        cerification: cerification

        }
      )
  if(!newUser){
    return next(new AppError)
  }
      res.status(201).json({
        status: "sucess",
        data: {
          new: newUser
        }
      })
})
  

//update profile
exports.updateUser = catchAsync(async (req, res, next) => {

  const updatedUser = await Tutor.findByIdAndUpdate(req.params.id, req.body, {
    new: true
})

if (!updatedUser) {
  return next(new AppError('No Tutor found with that ID', 404));
}
    res.status(200).json({
      status: 'success',
       data: {
       user: updatedUser
    }
  }
)
});
