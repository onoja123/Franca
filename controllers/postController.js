const Post = require("../models/postModel")
const catchAsync = require('../utils/catchAsync');
const AppError = require("../utils/appError")
const apiFeature = require("../utils/apiFeatures")

//Get all Posts
exports.getAllPost = catchAsync(async(req, res, next)=>{
 const all = await Post.find()



    if(!all){
        return next(new AppError("No Post with that ID"), 403)
    }
    res.status(200).json({
        status: true,
        result: all.length,
        data: {
            new: all
        }
    })    
})

// Create Post
exports.createPost = catchAsync(async(req, res, next)=>{
    const {title, request, userId} = req.body;

    const data = await Post.create({title, request, userId })
    if(!data){
        return next(new AppError("No Post with that ID"), 403)
    }
    res.status(201).json({
        status: true,
        data: {
            new: data
        }

    })
})


// Find Post
exports.findPost = catchAsync(async(req, res, next)=>{
    const all = await Post.findById(req.params.id)
    if(!all){
        return next(new AppError("No Post with that ID"), 403)
    }
    res.status(200).json({
        status: true,
        data: {
            data: {
                new: all
            }
        }
    })
})

//// update Post
exports.editPost = catchAsync(async(req, res, next)=>{

    const postId = req.params.id;
    const { userId } = req.body; 

    const post = await Post.findById(postId) 

    if(post.userId === userId){
        await Post.updateOne({$set: req.body})
    }
    res.status(200).json({
        status: true,
        message: "Post updated!",
        data: {
            post
        }
        
    })
})


// Delte Post
exports.deletePost = catchAsync(async(req, res, next)=>{

    const id = req.params.id;
    const { userId } = req.body;
  
    const post = await Post.findById(id)
    if (post.userId === userId){
        await Post.deleteOne()
    }

    res.status(200).json({
        status: true,
        message: "Post deleted!",
    })
})

