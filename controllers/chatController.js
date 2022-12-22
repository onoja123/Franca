const Chat = require("../models/chatModel")
const catchAsync = require('../utils/catchAsync');

exports.createChat = catchAsync(async(req, res, next)=>{
  const newChat = new Chat({
    members: [req.body.senderId, req.body.receiverId],
  });
  const result = await newChat.save();
  res.status(200).json({
    sucess: true,
    result
  })

})

exports.findChat = catchAsync(async(req, res, next)=>{

  const newChat = await Chat.find({
    members: {$in: [req.params.userId]}
  })

  res.status(200).json({
    sucess: true,
    newChat
  })
 
})

exports.findTwo = catchAsync(async(req, res, next)=>{

  const chat = await Chat.findOne({
    members: { $all: [req.params.firstId, req.params.secondId] },
  });
  res.status(200).json({
    sucess: true,
    chat
  })
})