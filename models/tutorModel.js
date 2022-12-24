const mongoose = require("mongoose")

const tutorSchema = new mongoose.Schema(
    {
        avatar: {
            type: String,
            default: " "
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
        language_skills :{ 
            type: String,
            enum: ["Hausa", "igbo", "yoruba"]
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