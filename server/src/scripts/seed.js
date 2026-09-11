import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { Workspace } from "../models/Workspace.js";
import { Project } from "../models/Project.js";
import { Member } from "../models/Member.js";
import { Activity } from "../models/Activity.js";
import { Branch } from "../models/Branch.js";
import { Commit } from "../models/Commit.js";
import { seedProjectFiles } from "../services/template.service.js";

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

async function seed() {
  try {
    if (env.MONGODB_URI === "SKIP") {
      console.log("Skipping seed: MONGODB_URI is SKIP");
      process.exit(0);
    }

    await mongoose.connect(env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing
    await User.deleteMany({ email: "demo@collabide.dev" });
    const demoWorkspaces = await Workspace.find({ name: "Demo Workspace" });
    const demoWorkspaceIds = demoWorkspaces.map(w => w._id);
    await Project.deleteMany({ workspaceId: { $in: demoWorkspaceIds } });
    await Workspace.deleteMany({ _id: { $in: demoWorkspaceIds } });

    // 1. Create Demo User
    const passwordHash = await bcrypt.hash("demo1234", 12);
    const user = await User.create({
      name: "Demo User",
      email: "demo@collabide.dev",
      passwordHash,
      isEmailVerified: true,
    });
    console.log("Created demo user");

    // 2. Create Workspace
    const workspace = await Workspace.create({
      name: "Demo Workspace",
      slug: slugify("Demo Workspace") + "-" + Math.random().toString(36).substring(2, 8),
      ownerId: user._id,
      description: "A pre-seeded workspace for demonstration purposes.",
    });
    console.log("Created workspace");

    // 3. Create Projects
    const templates = ["react-vite", "node-express", "html-css-js"];
    for (let i = 0; i < templates.length; i++) {
      const templateId = templates[i];
      const name = `${templateId.replace("-", " ").toUpperCase()} App`;
      
      const project = await Project.create({
        name,
        slug: slugify(name) + "-" + Math.random().toString(36).substring(2, 8),
        workspaceId: workspace._id,
        ownerId: user._id,
        templateId,
      });

      await Member.create({
        projectId: project._id,
        userId: user._id,
        role: "owner",
      });

      await seedProjectFiles(project._id, templateId);

      // Create branch & commit
      const branch = await Branch.create({
        projectId: project._id,
        name: "main",
        createdBy: user._id,
        isDefault: true,
      });

      const commit = await Commit.create({
        projectId: project._id,
        branchName: "main",
        message: "Initial commit",
        authorId: user._id,
        changes: [{ path: ".", type: "added" }],
      });

      branch.headCommitId = commit._id;
      await branch.save();

      // Create Activity
      await Activity.create({
        projectId: project._id,
        userId: user._id,
        action: "project.created",
        target: project.name,
      });

      console.log(`Created project ${name} with template ${templateId}`);
    }

    console.log("Seed complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
