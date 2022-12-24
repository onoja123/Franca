const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Blog title required"],
            unique: true,
          },
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          request: {
            type: String,
            required: [true, "Blog description required"],
          },
          tags: {
            type: [String],
            required: false,
          },
          author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
          },
          createdAt: {
            type: Date,
            defualt: Date.now()
          }
    },
    {
        timestamps: true
    }
)
blogSchema.pre(/^find/, function(next){
    this.find({active: {$ne: false}})
    next()
  });



const Blog = mongoose.model("Blog", blogSchema)

module.exports =  Blog;