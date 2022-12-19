const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Blog title required"],
            unique: true,
          },
          description: {
            type: String,
            required: [true, "Blog description required"],
          },
          tags: {
            type: Array,
            required: false,
          },
          author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
          },
          active: {
            type: Boolean,
            default: true,
            select: false
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

  blogSchema.pre(/^find/, function(next){
       this.populate({
     path: 'author',
     select: 'name'
      })
      next()
  })

const Blog = mongoose.model("Blog", blogSchema)

module.exports =  Blog;