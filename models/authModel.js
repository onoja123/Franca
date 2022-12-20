const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const crypto = require('crypto')
const validator = require("validator")

const authSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: [true, "please put it a name"],
        },
        last_name: {
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
            validate: [validator.isEmail, 'Please provide a valid email']
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
        is_student: {
            type: Boolean,
            default: false,
            required: [true]
        },
        is_tutor: {
            type: Boolean,
            default: false,
            required: [true]
        },
        is_organization: {
            type: Boolean,
            default: false,
            required: [true]
        },
        userId: {
          type: mongoose.SchemaTypes.ObjectId,
          required: false,
          ref: "user",
          default: null,
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
  
     // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.passwordExpiresToken = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
  
  
const Auth = mongoose.model("Auth", authSchema)

module.exports = Auth;