const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/authModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError'); 
const sendEmail = require('./../utils/email');



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

    const cookieOptions = {
      expiresIn: new Date( Date.now () * process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000)
    ,
    httpOnly: true
    }

    res.cookie("jwt", token ,cookieOptions)

    user.password = undefined

    if(process.env.NODE_ENV === "production") cookieOptions.seucure = true
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



exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
  
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }
  
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_kEY);
  
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }
  
    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }
  
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  });




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
        return next(new AppError("Token is invalid or has expired"), 401)
    }
    user.password = req.body.password,
    user.passwordConfirm = req.body.passwordConfirm,
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined

    await user.save()

    createSendToken(user, 200, res)
})




exports.updatePassword = catchAsync(async (req, res, next) => {
    //  Get user from collection
    const user = await User.findById(req.user.id).select('+password');
  
    //  Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    }
  
    // If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
  
    //  Log user in, send JWT
    createSendToken(user, 200, res);
  });