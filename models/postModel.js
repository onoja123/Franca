const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        title: {
            type: String,
            required: [true, "Post title required"],
            unique: true,
          },
        request: {
            type: String,
            required: [true, "Post description required"],
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
const Post = mongoose.model("Post", postSchema)

module.exports =  Post;