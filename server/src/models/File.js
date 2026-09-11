import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    path: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["file", "folder"],
      required: true,
    },
    content: {
      type: String,
      maxlength: 1024 * 1024, // 1MB limit
    },
    language: {
      type: String,
    },
    parentPath: {
      type: String,
      default: "", // empty string for root
    },
  },
  { timestamps: true }
);

fileSchema.index({ projectId: 1, path: 1 }, { unique: true });

// Static method to build nested tree
fileSchema.statics.buildTree = async function (projectId) {
  const files = await this.find({ projectId }).lean();

  const fileMap = new Map();
  const root = [];

  // Initialize map
  files.forEach((file) => {
    // Map _id to id for frontend compatibility if needed, or just keep it as is
    file.id = file._id.toString();
    if (file.type === "folder") {
      file.children = [];
    }
    fileMap.set(file.path, file);
  });

  // Build tree
  files.forEach((file) => {
    if (file.parentPath === "") {
      root.push(file);
    } else {
      const parent = fileMap.get(file.parentPath);
      if (parent && parent.type === "folder") {
        parent.children.push(file);
      } else {
        // If parent doesn't exist for some reason, just push to root to avoid losing it
        root.push(file);
      }
    }
  });

  // Optional: sort folders first, then alphabetically
  const sortTree = (nodes) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((node) => {
      if (node.children) sortTree(node.children);
    });
  };

  sortTree(root);
  return root;
};

export const File = mongoose.model("File", fileSchema);
