const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const crypto = require('crypto')

const authSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "please put it a name"],
        },
        email : {
            type: String,
            required: [true, "please put in an email"],
            trim: true,
            unique: true,
            match: [
              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              "Please enter a valid Email address",
            ],
        },
        password: {
            type: String,
            required: [true, "please put it a password"],
            select: false
        },
        passwordConfirm: {
            type: String,
            required: [true, "please confirm your password"]
        },
        changedPasswordAt: Date,
        passwordResetToken: String,
        passwordExpiresToken: Date
    },
    {
        timestamps: true

    }
)


authSchema.pre('save', async function(next){
    //if password was modified
    if(!this.isModified('password')) return next()
    //hash the password by 12
    this.password = await bcrypt.hash(this.password, 12)
    //delete the password confirm
    this.passwordConfirm = undefined

    next()
})

authSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next()

    this.passwordConfirm = Date.now() - 1000;
    next()
})

authSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

authSchema.methods.changedPasswordAfter = async function(JWTTimestamp){
    if(this.changedPasswordAt){
        const changedStamp = parseInt(this.changedPasswordAt.getTime() / 1000, 10)
        return JWTTimestamp > changedStamp;
    }
    return false
}

authSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest('hex')
    this.passwordExpiresToken = Date.now() + 10 * 60 * 1000

    console.log({resetToken}, this.passwordResetToken)
    return resetToken
}
const Auth = mongoose.model("Auth", authSchema)

module.exports = Auth;