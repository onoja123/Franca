const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError'); 
const sendEmail = require('./../utils/email');
const User = require("./../models/userModel")


/**
 *
 *
 * @param {*} id
 * @return {*} 
 */
const signToken = id =>{
    return jwt.sign({id: id}, process.env.JWT_SECRET_KEY, {
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
        status: true,
        token,
        data: {
            user
        }
    })
}



//signup routes
exports.signup = catchAsync(async(req, res, next)=>{
  const {first_name, last_name, email, user_type, password} = req.body;
 
     //check for required fields
     switch ((first_name, last_name, email, user_type, password)) {
      case !first_name && !last_name && !email && !user_type && !password:
        return res.status(400).send("Please fill in the required fields");
      case !first_name:
        return res.status(400).send("Please enter your firstname");
      case !last_name:
        return res.status(400).send("Please enter your lastname");
      case !email:
        return res.status(400).send("Please enter your email address");
      case !user_type:
        return res.status(400).send("Please enter your user type");
      case !password:
        return res.status(400).send("Please enter your password");
    }

    const newUser = await User.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      user_type: user_type,
      password: password,
      
    })

    const emailToken = newUser.getVerifyEmailToken()
    const URL = "https://franca-test.onrender.com";
    const resetURL = `${URL}/api/auth/verify/${emailToken}`
    // const resetURL = `${req.protocol}://${req.get(
    //   'host'
    // )}/api/auth/verify/${emailToken}`;
  
    const message = `
    <p>Hi ${req.body.email}, welcome to Franca 🚀</p>
    <p>Before doing anything, we recommend verifying your account to use most of the features available.</p>
    <a href="${resetURL}" clicktracking=off>Verify Account</a>
    <p>Franca. 🚀</p>
`;
  try {
      await sendEmail({
        email: newUser.email,
        subject:  "Welcome to Franca 🚀",
        message
      });
      
  }catch(err){
    newUser.getVerifyEmailToken = undefined
    await newUser.save();

    return res.status(500).send({
      status: true,
      message: "Couldn't send the verification email"});
  }
  
createSendToken(newUser, 201, res)
})


exports.verifyUsersEmail = catchAsync(async(req, res, next)=>{
  const verifyEmailToken = await crypto
  .createHash("sha256")
  .update(req.params.token)
  .digest("hex");

  const user = await User.findOne({
    verifyEmailToken: verifyEmailToken
  }).select("+verifyEmailToken");


  res.status(200).json({
    status: true,
    message: "Account verified"
  })
})


exports.resendVerification = catchAsync(async(req, res, next)=>{

  const user = await User.findOne({email: req.body.email})
  if (!user) return res.status(400).json({
    status: true,
    message: "Please login"});

  const emailToken = user.getVerifyEmailToken()

    await user.save({validateBeforeSave: true});

    const URL = "https://franca-test.onrender.com";
    const resetURL = `${URL}/api/auth/verify/${emailToken}`
    // const resetURL = `${req.protocol}://${req.get(
    //   'host'
    // )}/api/auth/verify/${emailToken}`;
  
    const message = `
    <p>Hi ${req.body.email}, welcome to Franca 🚀</p>
    <p>Here's a new link to verify your account.</p>
    <a href="${resetURL}" clicktracking=off>Verify Account</a>
    <p>Franca. 🚀</p>
`;
  try {
      await sendEmail({
        email: user.email,
        subject:  "Verification Link 🚀",
        message
      });

      res.status(200).json({
        status: true,
        message: "Verification Link Sent!"});
  }catch(err){
    user.getVerifyEmailToken = undefined
    await user.save();

    return res.status(500).json({
      status: true,
      message: "Couldn't send the verification email"});
  }

})

exports.login = catchAsync(async(req, res, next)=>{
    //check if user and password exist
    
    const { email, password } = req.body;
   // 1) Check if email and password exist
    switch((email, password)){
      case !email || !password:
        return  next(new AppError("Please provide email and password!"),400)
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
  
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }
  
    //once everything is okay, send token
    createSendToken(user, 200, res)
})

//logout

exports.logout = async(req, res) => {

  try {
    res
      .status(200)
      .cookie("accessToken", "", {
        expiresIn: new Date(0),
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true,
      })
      .cookie("refreshToken", "", {
        expiresIn: new Date(0),
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true,
      })
      .json({
        status: true,      
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

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
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
  
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
    

  console.log(resetToken)
      const URL = "https://franca-test.onrender.com";
      const resetURL = `${URL}/api/auth/resetPassword/${resetToken}`;
      // const resetURL = `${req.protocol}://${req.get(
      //   'host'
      // )}/api/auth/resetPassword/${resetToken}`;
    
          const message = `
          <p>Hi ${user.email}</p>
          <p>We heard you are having problems with your password.</p>
          <p>Click on the link below to reset your password, link expires in 10 minutes.</p>  
        <a href="${resetURL}" clicktracking=off>Reset Password</a>
        `;
    try {
        await sendEmail({
          email: user.email,
          subject: "Password Reset",
          message
        });
    
        res.status(200).json({
          status: true,
          message: 'Email sent successfully!'
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
        return next(new AppError("Invalid reset token"), 401)
    }
    user.password = req.body.password,
    user.passwordConfirm = req.body.passwordConfirm,
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined

    await user.save()

    createSendToken(user, 200, res)
})


