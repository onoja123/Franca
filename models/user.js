const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//shcema for users and admin
const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'please input an email']
        },
        password: {
            type: String,
            required: [true, "please put it an password"],
            select: false
        },
        role:{
            type: String,
            enum: ["admin"],
            default: "user"
        },
        passwordConfirm: {
            type: String,
            required: [true, "please confirm your [password"]
        },
        passwordChangedAt: Date
    }
)

userSchema.pre('save', async (next)=>{
    if(!this.modified('password')) return next()
    this.password = bcrypt.hash(password, 12)

    this.password = undefined
    next()
})

userSchema.methods.comparePassword = async(candidatepassword, userpassword)=>{
    return await bcrypt.compare(candidatepassword, userpassword)
}

userSchema.methods.changedPassword = async(JWTTimestamp)=>{
    if(this.passwordChangedAt){
        const timeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return timeStamp < this.passwordChangedAt
    }
    return false
}


const User = mongoose.model("User", userSchema)

module.exports = User