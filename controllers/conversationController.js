const Conversation = require("../models/messageModel")
const catchAsync = require('../utils/catchAsync');
const AppError = require("../utils/appError")

exports.create = catchAsync(async(req, res, next)=>{

    const {senderId, receiverId} = req.body

    const newConversation = await Conversation.create({
        senderId: senderId,
        receiverId: receiverId
    })
      if(!newConversation){
        return next(new AppError("senderID or receiverId is not found"), 403)
      }
      res.status(200).json({
        status: "sucess",
        data: {
            new: newConversation
        }
      })      
})

exports.getId = catchAsync(async(req, res, next)=>{
    const conversation = await Conversation.find({
        members: { $in: [req.params.userId] },
      })
      if(!conversation){
        return next(new AppError("User not found"), 404)
      }
      res.status(200).json({
        status: "sucess",
        data: {
            new: conversation
        }
      })
})