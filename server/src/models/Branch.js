import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    headCommitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Commit",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

branchSchema.index({ projectId: 1, name: 1 }, { unique: true });

export const Branch = mongoose.model("Branch", branchSchema);
