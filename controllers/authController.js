const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/authModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
require("./../utils/cloudinary")


/**
 *
 *
 * @param {*} id
 * @return {*} 
 */
const signToken = id =>{
    return jwt.sign({id: id}, process.env.JWT_SECRET_kEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user, statusCode, res) =>{
    const token = signToken(user._id)
    res.status(statusCode).json({
        status: "sucess",
        token,
        data: {
            user
        }
    })
}

//signup routes
exports.signup = catchAsync(async(req, res, next)=>{
    const newUser = await User.create(req.body)
    createSendToken(newUser, 201, res)
})



exports.login = catchAsync(async(req, res, next)=>{
    //check if user and password exist
    
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
  
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }
  
    //once everything is okay, send token
    createSendToken(user, 200, res)
})



exports.protect = catchAsync(async(req, res, next)=>{
    //Get token and check if it's there
    let token;
    if(
        req.headers.authorization 
        &&
        req.headers.authorization.startsWith("Bearer")
        ){
            token = req.headers.authorization.split(' ')[1]
        }

        if(!token){
            return next(new AppError("you are not loggeg in! please log in to get access."), 401)
        }
    //verfication of token
        const decoded = promisify(jwt.verify)(token, process.env.JWT_SECRET_kEY)
    //check if user exist
        const currentuser = await User.findById(decoded.id)
        if(!currentuser){
            return next(new AppError("The user belonging to this token doesnt exist", 401))
        }


    //check if user chnaged password after token was issued

    if(currentuser.changedPasswordAfter(decoded.iat)){
        return next (new AppError("user recently changed password, please login again"), 401)
    }
    
    //Grant acces to protected route
    req.user = currentuser
    next()

})


//admin only
exports.restrict = (...roles)=>{
    return(req, res, next)=>{
        if(!roles.includes(req.user.roles)){
            return next (new AppError('You do not have permission to perform this action', 403))
        }
        next()
    }
}


exports.forgotPassword = catchAsync(async(req, res, next)=>{
    //Get user based on email

    const user = await User.findOne({email: req.body.email})

    if(!user){
        return next(new AppError("There is no email with this email address"), 404)
    }

    const resetToken = user.createPasswordResetToken()

    await user.save({validateBeforeSave: false})
    

      const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/auth/resetPassword/${resetToken}`;

  /** @type {*} */
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;


    try {
        await sendEmail({
          email: user.email,
          subject: 'Your password reset token (valid for 10 min)',
          message
        });
    
        res.status(200).json({
          status: 'success',
          message: 'Token sent to email!'
        });
      } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
    
        return next(
          new AppError('There was an error sending the email. Try again later!'),
          500
        );
      }
})

exports.resetPassword = catchAsync(async(req, res, next)=>{

    //Get user based on the token
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest('hex')

    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}})


    //Check if token expired, and if there is user, set new password

    if(!user){
        return next(new AppError("Token is invalid or has expired"), 400)
    }
    user.password = req.body.password,
    user.passwordConfirm = req.body.passwordConfirm,
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined

    await user.save()

    createSendToken(user, 200, res)
})



exports.updatePassword = catchAsync(async(req, res, next)=>{
    const user =  await User.findById(req.user.id).select('password')

    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
        return next(new AppError("Your current password is wrong"), 401)
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.psswordConfirm

    await user.save()

    createSendToken(user, 200, res)
})