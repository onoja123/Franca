const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        is_student: {
            type: Boolean,
            default: true
        },
        avatar: {
            type: String,
          },
        cloudinary_id: {
            type: String,
        },
        short_bio: {
            type: String
        },
        phone_number: {
            type: Number
        },
        address: {
            type: String
        },
        role: {
            type: String,
            enum: ["student", "admin", "tutor", "organization"],
            default: "student"
        },
        request: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema)

module.exports = User;