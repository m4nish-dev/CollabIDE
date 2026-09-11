import mongoose from "mongoose";
import crypto from "crypto";

const commitSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    branchName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    changes: [
      {
        path: String,
        type: {
          type: String,
          enum: ["added", "modified", "deleted"],
        },
      },
    ],
    sha: {
      type: String,
      unique: true,
    },
    parentSha: {
      type: String,
    },
  },
  { timestamps: true }
);

commitSchema.pre("save", function () {
  if (!this.sha) {
    this.sha = crypto.randomBytes(20).toString("hex").slice(0, 7);
  }
});

export const Commit = mongoose.model("Commit", commitSchema);
