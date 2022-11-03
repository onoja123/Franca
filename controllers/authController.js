const User = require("../models/user")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const jwt = require("jsonwebtoken")

const signToken = id =>{
    return jwt.sign({id: id}, process.env.JWT_SECRET_kEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

//signup routes
exports.signup = catchAsync(async(req, res, next)=>{
    const Token = signToken(User._id)
    const newUser = await User.create(req.body)
    res.status(200).json({
        status: "sucess",
        message: "sucessfully signedup",
        Token,
        data: {
            user: newUser,
            
        }
    })
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
    const Token = signToken(user._id)
    res.status(200).json({
        status: 'sucess',
        Token

    })
})



exports.protect = catchAsync(async(req, res, next)=>{
    //Get token and check if it's there
    let token;
    if(
        req.headers.authorization 
        &&
        req.headers.authorization.startsWith("bearer")
        ){
            token = req.headers.authorization.split(' ')[1]
        }

        if(!token){
            return next(new AppError(""))
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

})


//admin only
exports.restrict = (...roles)=>{
    return(req, res, next)=>{
        if(!roles.includes(req.user.id)){
            return next (new AppError("you are not allowed, please leave here right away"), 402)
        }
    }
}


exports.forgotPassword = catchAsync(async(req, res, next)=>{
    //Get user based on email

    const user = await User.findOne({email: req.body.email})

    if(!user){
        return next(new AppError("There is no email with this email address"), 401)
    }

    const resetToken = user.createPasswordResetToken()

    await user.save({validateBeforeSave: false})
})

// exports.resetPassword = (()=>{
    
// })

