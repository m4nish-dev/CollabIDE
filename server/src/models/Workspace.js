import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Workspace name is required"],
      trim: true,
      maxlength: [80, "Workspace name cannot exceed 80 characters"],
    },
    slug: {
      type: String,
      required: [true, "Workspace slug is required"],
      unique: true,
      lowercase: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icon: {
      type: String,
    },
    description: {
      type: String,
      maxlength: [400, "Description cannot exceed 400 characters"],
    },
    defaultVisibility: {
      type: String,
      enum: ["private", "workspace", "public"],
      default: "private",
    },
  },
  { timestamps: true }
);

export const Workspace = mongoose.model("Workspace", workspaceSchema);
