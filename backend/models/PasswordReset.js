import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  otpCode: {
    type: String,
    required: true,
    length: 6,
    index: true
  },
  otpExpiresAt: {
    type: Date,
    required: true,
    index: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0,
    max: 5
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for cleanup of expired OTPs
passwordResetSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to generate OTP
passwordResetSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Static method to check if email has active OTP
passwordResetSchema.statics.hasActiveOTP = async function(email) {
  const activeOTP = await this.findOne({
    email: email.toLowerCase(),
    isUsed: false,
    otpExpiresAt: { $gt: new Date() }
  });
  return !!activeOTP;
};

// Static method to cleanup expired OTPs
passwordResetSchema.statics.cleanupExpired = async function() {
  return await this.deleteMany({
    otpExpiresAt: { $lt: new Date() }
  });
};

export default mongoose.model('PasswordReset', passwordResetSchema);
