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


authSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
  
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
  });
  
authSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
});
  

  
authSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
  
authSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return JWTTimestamp < changedTimestamp;
}
  
    // False means NOT changed
    return false;
  };
  
authSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    console.log({ resetToken }, this.passwordResetToken);
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
};
  
  
const Auth = mongoose.model("Auth", authSchema)

module.exports = Auth;