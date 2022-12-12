const Blog = require("./../models/blogModel")
const catchAsync = require('./../utils/catchAsync');
const AppError = require("./../utils/appError")

//Get all blogs
exports.getAllBlog = catchAsync(async(req, res, next)=>{
    const all = await Blog.find();

    res.status(200).json({
        status: "sucess",
        data: {
            new: all
        }
    })
})

// Create blog
exports.createPost = catchAsync(async(req, res, next)=>{
    const data = await Blog.create(req.body)
    if(!data){
        return next(new AppError("No blog with that ID"), 403)
    }
    res.status(201).json({
        status: "sucess",
        data: {
            new: data
        }

    })
})


// Fnd blog
exports.findPost = catchAsync(async(req, res, next)=>{
    const all = await Blog.findById(req.params.id)
    res.status(200).json({
        status: "sucess",
        data: {
            data: {
                new: all
            }
        }
    })
})

//edit blog
exports.editPost = catchAsync(async(req, res, next)=>{
    const all = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if(!all){
        return next(new AppError("No blog found with that ID"), 403)
    }
    res.status(200).json({
        status: "sucess",
        message: "blog deleted successfully",
        data: {
            data: {
                new: all
            }
        }
    })
})

// Delte blog
exports.deletePost = catchAsync(async(req, res, next)=>{
    const de = await User.findByIdAndDelete(req.User.id, {active: false})

    if (!del) {
      return next(new AppError('No blog found with that ID', 404));
    }
  
    res.status(204).json({
      status:"sucess",
      message: "blog deleted successfully",
      data: null
    })
})
