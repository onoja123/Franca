const mongoose = require("mongoose")

const tutorSchema = new mongoose.Schema(
    {
        is_tutor: {
            type: Boolean,
            default: true
        },
        name: {
            type: String,
            required: [true, "please put it a name"]
        },
        profile_photo: {
            type: String
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
        email : {
            type: String,
            required: [true, "please put in an email"]
        },
        language_skills :{ 
            type: String,
            enum: ["Hausa", "igbo", "yoruba"]
        },
        role: {
            type: String,
            enum: ["student", "admin", "tutor", "organization"],
            default: "tutor"
        },
        eiffiency: {
            type: String
        },
        cerification: {
            type: String

        }
    }
)

const Tutor = mongoose.model("Tutor", tutorSchema)

module.exports =  Tutor