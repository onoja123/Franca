const Message = require("../models/messageModel")
const catchAsync = require('../utils/catchAsync');


exports.addMessage = catchAsync(async(req, res, next)=>{
  const newMessage = new Message({
    text: req.body.text,
    senderId: req.body.senderId,
    chatId: req.body.chatId
  })

  const result = await newMessage.save()

  res.status(200).json({
    status: true,
    result
  })
})

exports.getChat = catchAsync(async(req, res, next)=>{
  const {chatId} = req.params;

  const result = await Message.find({ chatId });
  res.status(200).json({
    status: true,
    result
  })
})