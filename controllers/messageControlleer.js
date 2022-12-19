const Message = require("../models/messageModel")
const catchAsync = require('../utils/catchAsync');
const AppError = require("../utils/appError")

exports.create = catchAsync(async(req, res, next)=>{


  const savedMessage = await Message.create(req.body)

  if(!savedMessage){
    return next (new AppError("message not found"), 403)
  }

  res.status(200).json({
    status: "sucess",
    data: {
      new: savedMessage
    }
  })
})


exports.getId = catchAsync(async(req, res, next)=>{
  const messageId = await Message.find({
    conversationId: req.params.conversationId,
  })

  if(!messageId){
    return next(new AppError("message not found"), 403)
  }

  res.status(200).json({
    status: "sucess",
    data: {
      new: messageId
    }
  })
})