const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const crypto = require('crypto')

const userSchema = new mongoose.Schema(
    {
        user_type: {
            enum: ["beginner", "intermediate", "advanced"]
        },
        name: {
            type: String,
            required: [true, "please put it a name"],
        },
        is_student: {
            type: Boolean,
            default: true
        },
        is_tutor: {
            type: Boolean,
            default: true
        },
        is_organization: {
            type: Boolean,
            default: true
        },
        profile_photo: {
            type: string
        },
        short_bio: {
            type: string
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
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        password: {
            type: String,
            required: [true, "please put it an password"],
            select: false
        },
        passwordConfirm: {
            type: String,
            required: [true, "please confirm your password"]
        },
        changedPasswordAt: Date,
        passwordResetToken: String,
        passwordExpiresToken: Date
    }
)


userSchema.pre('save', async function(next){
    //if password was modified
    if(!this.isModified('password')) return next()
    //hash the password by 12
    this.password = await bcrypt.hash(this.password, 12)
    //delete the password confirm
    this.passwordConfirm = undefined

    next()
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = async function(JWTTimestamp){
    if(this.changedPasswordAt){
        const changedStamp = parseInt(this.changedPasswordAt.getTime() / 1000, 10)
        return JWTTimestamp > changedStamp;
    }
    return false
}

userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest('hex')
    this.passwordExpiresToken = Date.now() + 10 * 60 * 1000

    console.log({resetToken}, this.passwordResetToken)
    return resetToken
}
const User = mongoose.model("User", userSchema)

module.exports = User