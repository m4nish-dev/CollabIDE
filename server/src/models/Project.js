import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
    },
    slug: {
      type: String,
      required: [true, "Project slug is required"],
    },
    description: {
      type: String,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visibility: {
      type: String,
      enum: ["private", "workspace", "public"],
      default: "private",
    },
    language: {
      type: String,
    },
    framework: {
      type: String,
    },
    templateId: {
      type: String,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    starredBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

projectSchema.index({ workspaceId: 1, slug: 1 }, { unique: true });

export const Project = mongoose.model("Project", projectSchema);
