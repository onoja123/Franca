const mongoose = require("mongoose")


const tutorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "please put it a name"],
        },
        profile_picture: {
            type: String,
        },
        short_bio: {
            type: String,
        },
        phone_number: {
            type: Number,
            required: [true, "please input a number"]
        },
        address: {
            type: String,
            required: [true, "please input an address"]
        },
        email : {
            type: String,
            required: [true, "please put in an email"]
        },
        password: {
            type: String,
            required: [true, "please put it an password"],
            select: false
        },
        language_skill_1: {
            type: String
        },
        language_skill_2: {
            type: String,

        },
        efficiency: {
            type: string
        },
        certifications: {
            type: String,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        referance: {
            type: String,
        }
    }
)

const Tutor = mongoose.model("Tutor", tutorSchema)

module.exports = Tutor