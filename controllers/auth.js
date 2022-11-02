const User = require("./../models/user")
const AppError = require("./../utils/appError")
const catchAsync = require("./../utils/catchAsync")
const jwt = require("jsonwebtoken")



const signToken = id =>{
    return jwt.sign({id: id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

// creating a user
exports.signUp = catchAsync(async(req, res, next)=>{
   let token = signToken(User._id)
    const newuser = await User.create(req.body)
    res.status(200).json({
        status: "sucess",
        token,
        message: "user created sucessfully",
        data: {
            newuser
        }
    })
})

//logging in a user 

exports.login = catchAsync(async(req, res, next)=>{

    const token = signToken(User._id)
    const {email, password} = req.body;
//check if email and password exist 
    if(!email || !password){
        return next(new AppError("email and password doesnt exist"), 402)
    }

    //check if passowrd is correct

    const user = user.findOne({email}).select('+password')

    if(!user && (!user.comparepassword(password, user.password))){
        return next(new AppError("i think you need to check your email and passowrd"), 402)
    }

    // send sucess once user logs in
    res.status(200).json({
        status: "sucess",
        tok: token
    })

})


//protecting routes
exports.protect = catchAsync(async(req, res, next)=>{

    //getting token and checking if its there
    let token;
    if(req.headers.authorization && req.headers.authorization.startswith("Beares")){
        token = req.headers.authorization.split(" ")[1]
    }

    //check if token doesnt exist
    if(!token){
        return next(new AppError("you are not logged in, please login to get access"), 402)

    }

    //verificaton of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY)

    const currentUser = await User.findById(decoded.id)

    //check if user still exist
    if (!currentUser) {
        return next(
          new AppError(
            'The user belonging to this token does no longer exist.',
            401
          )
        );
      }
      //Check if user changed password after the token was issued
      if(currentUser.changedpassword(decoded.iat)){
        return next(new AppError("User recently changed password, please try again"), 402)
      }

      //granting user access
      req.user = currentUser;

      next()
})


exports.protect = (...roles)=>{
    return(req, res, next)=>{
        if(!roles.includes(req.user.roles)){
            return next(new AppError("You are not allowed, please sign up"), 402)
        }
    }
}

