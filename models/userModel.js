const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const crypto = require('crypto')
const validator = require("validator")

const userSchema = new mongoose.Schema(
    {
      first_name: {
            type: String,
            required: true, 
        },
      last_name: {
          type: String,
          required: true,
      },
      email : {
            type: String,
            required: true,
            trim: true,
            unique: true,
            match: [
              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              "Please enter a valid Email address",
            ],
            validate: [validator.isEmail, 'Please provide a valid email']
        },
        user_type: {
          type: String,
          enum: ["student", "tutor", "organisation"],
          required: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        passwordConfirm: {
            type: String,
        },
        avatar: {
          type: String,
          default: " "
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
      request: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Blog"
      },
        changedPasswordAt: Date,
        passwordResetToken: String,
        passwordExpiresToken: Date,
        verifyEmailToken: {
          type: String,
          select: false,
        },
        active: {
          type: Boolean,
          default: true,
          select: false
        }
    },
    {
        timestamps: true

    }
)


userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
  
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
  });
  
userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function(next){
  this.find({active: {$ne: false}})
  next()
})

  
userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
  
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
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
  
userSchema.methods.createPasswordResetToken = function() {
  
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

userSchema.methods.getVerifyEmailToken = function(){
  const resetToken = crypto.randomBytes(20).toString("hex")
  this.verifyEmailToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  return resetToken;
}

const User = mongoose.model("User", userSchema)

module.exports = User;