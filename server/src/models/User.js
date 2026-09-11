import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [1, "Name must be at least 1 character"],
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    username: {
      type: String,
      unique: true,
      sparse: true, // allows null/undefined without duplicate key conflicts
      lowercase: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [32, "Username cannot exceed 32 characters"],
      match: [
        /^[a-z0-9_-]+$/,
        "Username may only contain lowercase letters, numbers, underscores and hyphens",
      ],
    },
    avatar: { type: String },
    bio: { type: String, maxlength: [300, "Bio cannot exceed 300 characters"] },
    location: {
      type: String,
      maxlength: [120, "Location cannot exceed 120 characters"],
    },
    website: {
      type: String,
      maxlength: [200, "Website cannot exceed 200 characters"],
    },
    timezone: { type: String, default: "UTC" },

    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },

    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },

    lastActiveAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.emailVerificationToken;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret;
      },
    },
  }
);

/**
 * Compare a plain-text password against the stored hash.
 * @param {string} plain
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

export const User = mongoose.model("User", userSchema);
