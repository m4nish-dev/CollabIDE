import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  LayoutGrid,
  Lock,
  Users,
  Globe,
  Check,
  ArrowLeft,
  ArrowRight,
  Loader2,
  ChevronDown,
  GitBranch,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitHubIcon } from "@/components/auth/AuthAtoms";
import { FrameworkIcon } from "@/components/shared/FrameworkIcon";
import "@/lib/templatesData";
import { cn } from "@/lib/utils";

// 6 Inline templates requested for Step 2 "From Template"
const INLINE_TEMPLATES = [
  { id: "react-vite", name: "React", icon: "react", tag: "Vite 5" },
  { id: "nextjs-14", name: "Next.js", icon: "nextjs", tag: "App Router" },
  { id: "nodejs-api", name: "Node.js", icon: "node", tag: "TypeScript" },
  { id: "python-flask", name: "Python", icon: "python", tag: "Flask 3" },
  {
    id: "vanilla-html",
    name: "Vanilla HTML/CSS/JS",
    icon: "html",
    tag: "No-Build",
  },
  { id: "vite-ts", name: "Vite + TS", icon: "react", tag: "TypeScript" },
];

const WORKSPACES = [
  { id: "ws-main", name: "Rohit's Workspace (Current)", tier: "Pro" },
  { id: "ws-team", name: "Acme Engineering", tier: "Team" },
  { id: "ws-personal", name: "Personal Sandboxes", tier: "Free" },
];

const CreateProjectModalContent = ({
  onOpenChange,
  initialTemplate = null,
  initialSource = "blank",
  initialStep = 1,
}) => {
  const navigate = useNavigate();

  // Stepper state - directly initialized from props
  const [step, setStep] = useState(initialTemplate ? 2 : initialStep);
  const [source, setSource] = useState(
    initialTemplate ? "template" : initialSource,
  );

  // Form fields
  const [projectName, setProjectName] = useState(
    initialTemplate ? initialTemplate.slug : "",
  );
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [selectedWorkspace, setSelectedWorkspace] = useState(
    WORKSPACES[0].name,
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    initialTemplate ? initialTemplate.id : "react-vite",
  );

  // GitHub specific
  const [githubUrl, setGithubUrl] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("main");

  // UI state
  const [loading, setLoading] = useState(false);

  // Slug generator
  const slug = useMemo(() => {
    if (!projectName.trim()) return "my-project";
    return projectName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, [projectName]);

  // Validation
  const isValid = useMemo(() => {
    if (!projectName.trim()) return false;
    if (source === "github" && !githubUrl.trim()) return false;
    return true;
  }, [projectName, source, githubUrl]);

  // Handle submit
  const handleCreate = () => {
    if (!isValid || loading) return;
    setLoading(true);

    // Simulate 1.2s creation
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);

      const mockId = `proj-${Date.now().toString(36)}`;
      toast.success("Project created", {
        description: `"${projectName.trim()}" is ready in your workspace.`,
      });
      navigate(`/project/${mockId}`);
    }, 1200);
  };

  const handleSourceSelect = (newSource) => {
    setSource(newSource);
    if (newSource === "template" && !projectName) {
      setProjectName("my-template-app");
    } else if (newSource === "github" && !projectName) {
      setProjectName("imported-repo");
    } else if (newSource === "blank" && !projectName) {
      setProjectName("blank-sandbox");
    }
    setStep(2);
  };

  return (
    <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden border border-border bg-background-elevated/95 backdrop-blur-xl shadow-2xl">
      {/* Stepper Header Bar */}
      <div className="border-b border-border/80 px-6 pt-5 pb-4 bg-background-elevated/50">
        <div className="flex items-center justify-between">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Sparkles size={15} />
              </span>
              Create New Project
            </DialogTitle>
            <DialogDescription className="text-xs text-foreground-muted">
              {step === 1
                ? "Choose how you want to bootstrap your project."
                : "Configure project metadata, visibility, and workspace."}
            </DialogDescription>
          </DialogHeader>

          {/* Stepper Pill Indicator */}
          <div className="flex items-center gap-2 text-xs">
            <div
              onClick={() => setStep(1)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors",
                step === 1
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "text-foreground-muted hover:text-foreground",
              )}
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-white font-bold">
                1
              </span>
              <span>Source</span>
            </div>
            <span className="text-foreground-subtle">/</span>
            <div
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors",
                step === 2
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "text-foreground-subtle",
              )}
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground-subtle/30 text-[10px] text-foreground font-bold">
                2
              </span>
              <span>Configure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Body */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            /* ── Step 1: Choose Starting Point ── */
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                Select Starting Point
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Tile 1: Blank Project */}
                <button
                  type="button"
                  onClick={() => handleSourceSelect("blank")}
                  className={cn(
                    "group relative flex flex-col justify-between p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer",
                    source === "blank"
                      ? "border-accent bg-accent/10 shadow-[0_0_20px_rgba(124,92,255,0.18)]"
                      : "border-border bg-background/40 hover:bg-background-hover hover:border-border-strong",
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background-elevated border border-border text-foreground group-hover:scale-105 transition-transform">
                        <Folder size={20} className="text-accent" />
                      </div>
                      {source === "blank" && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                          <Check size={12} />
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      Blank Project
                    </div>
                    <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                      Start with an empty directory and scaffold your files from
                      scratch.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-[11px] font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Select</span>{" "}
                    <ArrowRight size={11} className="ml-1" />
                  </div>
                </button>

                {/* Tile 2: From Template */}
                <button
                  type="button"
                  onClick={() => handleSourceSelect("template")}
                  className={cn(
                    "group relative flex flex-col justify-between p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer",
                    source === "template"
                      ? "border-accent bg-accent/10 shadow-[0_0_20px_rgba(124,92,255,0.18)]"
                      : "border-border bg-background/40 hover:bg-background-hover hover:border-border-strong",
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background-elevated border border-border text-foreground group-hover:scale-105 transition-transform">
                        <LayoutGrid size={20} className="text-[#22D3EE]" />
                      </div>
                      {source === "template" && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                          <Check size={12} />
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      From Template
                    </div>
                    <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                      Choose from proven boilerplates like Next.js, React,
                      Node.js, and Python.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-[11px] font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Select</span>{" "}
                    <ArrowRight size={11} className="ml-1" />
                  </div>
                </button>

                {/* Tile 3: Import from GitHub */}
                <button
                  type="button"
                  onClick={() => handleSourceSelect("github")}
                  className={cn(
                    "group relative flex flex-col justify-between p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer",
                    source === "github"
                      ? "border-accent bg-accent/10 shadow-[0_0_20px_rgba(124,92,255,0.18)]"
                      : "border-border bg-background/40 hover:bg-background-hover hover:border-border-strong",
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background-elevated border border-border text-foreground group-hover:scale-105 transition-transform">
                        <GitHubIcon className="h-5 w-5 fill-current text-foreground" />
                      </div>
                      {source === "github" && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                          <Check size={12} />
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      Import from GitHub
                    </div>
                    <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                      Clone a public or private GitHub repository and keep it
                      synced.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-[11px] font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Select</span>{" "}
                    <ArrowRight size={11} className="ml-1" />
                  </div>
                </button>
              </div>
            </motion.div>
          ) : (
            /* ── Step 2: Configure ── */
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 max-h-[500px] overflow-y-auto pr-1"
            >
              {/* Specific option: If "From Template" */}
              {source === "template" && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">
                    Choose Template
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {INLINE_TEMPLATES.map((t) => {
                      const isSelected = selectedTemplateId === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setSelectedTemplateId(t.id);
                            if (!projectName || projectName === "my-project") {
                              setProjectName(
                                t.name.toLowerCase().replace(/\s+/g, "-"),
                              );
                            }
                          }}
                          className={cn(
                            "flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all",
                            isSelected
                              ? "border-accent bg-accent/15 shadow-[0_0_12px_rgba(124,92,255,0.2)]"
                              : "border-border bg-background/50 hover:bg-background-hover",
                          )}
                        >
                          <FrameworkIcon
                            name={t.icon}
                            size={18}
                            className="text-accent shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold text-foreground truncate">
                              {t.name}
                            </div>
                            <div className="text-[10px] text-foreground-muted truncate">
                              {t.tag}
                            </div>
                          </div>
                          {isSelected && (
                            <Check size={12} className="text-accent shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Specific option: If "Import from GitHub" */}
              {source === "github" && (
                <div className="space-y-3 p-3.5 rounded-xl border border-border bg-background/50">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                      <span>
                        GitHub Repository URL{" "}
                        <span className="text-danger">*</span>
                      </span>
                      <span className="text-[11px] text-foreground-subtle font-normal">
                        Public or Private
                      </span>
                    </label>
                    <Input
                      value={githubUrl}
                      onChange={(e) => {
                        setGithubUrl(e.target.value);
                        // Auto extract repo name
                        const match = e.target.value.match(
                          /github\.com\/[^/]+\/([^/]+)/,
                        );
                        if (match && match[1]) {
                          setProjectName(match[1].replace(/\.git$/, ""));
                        }
                      }}
                      placeholder="https://github.com/username/repository"
                      className="text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <GitBranch size={13} className="text-accent" />
                      <span>Branch</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="w-full h-9 rounded-lg border border-border bg-background-elevated px-3 text-xs text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        <option value="main">main (default)</option>
                        <option value="master">master</option>
                        <option value="develop">develop</option>
                        <option value="staging">staging</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle pointer-events-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Common Field 1: Project Name + URL Preview */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Project Name <span className="text-danger">*</span>
                </label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. realtime-chat, api-gateway"
                  autoFocus
                  className="text-sm font-mono"
                />

                <div className="flex items-center gap-1.5 text-[11px] text-foreground-subtle font-mono mt-1">
                  <span>Preview:</span>
                  <span className="text-foreground-muted bg-background/80 px-1.5 py-0.5 rounded border border-border/60 truncate">
                    collabide.dev/rohit/{slug}
                  </span>
                </div>
              </div>

              {/* Common Field 2: Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Description{" "}
                  <span className="text-foreground-subtle font-normal">
                    (Optional)
                  </span>
                </label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of your project..."
                  className="text-xs"
                />
              </div>

              {/* Common Field 3: Workspace Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Target Workspace
                </label>
                <div className="relative">
                  <select
                    value={selectedWorkspace}
                    onChange={(e) => setSelectedWorkspace(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    {WORKSPACES.map((ws) => (
                      <option key={ws.id} value={ws.name}>
                        {ws.name} ({ws.tier})
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle pointer-events-none"
                  />
                </div>
              </div>

              {/* Common Field 4: Visibility (3 Radio Cards) */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-foreground">
                  Visibility
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: "private",
                      title: "Private",
                      desc: "Only invited collaborators can access",
                      icon: Lock,
                    },
                    {
                      id: "workspace",
                      title: "Workspace",
                      desc: "Anyone in this workspace can view & edit",
                      icon: Users,
                    },
                    {
                      id: "public",
                      title: "Public",
                      desc: "Anyone with the link can view and fork",
                      icon: Globe,
                    },
                  ].map((v) => {
                    const Icon = v.icon;
                    const isSelected = visibility === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVisibility(v.id)}
                        className={cn(
                          "flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer",
                          isSelected
                            ? "border-accent bg-accent/10 shadow-[0_0_12px_rgba(124,92,255,0.15)]"
                            : "border-border bg-background/50 hover:bg-background-hover",
                        )}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <Icon
                            size={14}
                            className={
                              isSelected
                                ? "text-accent"
                                : "text-foreground-subtle"
                            }
                          />
                          {isSelected && (
                            <Check size={12} className="text-accent" />
                          )}
                        </div>
                        <div className="text-xs font-semibold text-foreground">
                          {v.title}
                        </div>
                        <p className="text-[10px] text-foreground-muted mt-0.5 leading-tight">
                          {v.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal Footer */}
      <div className="flex items-center justify-between border-t border-border/80 px-6 py-4 bg-background-elevated/50">
        <div>
          {step === 2 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setStep(1)}
              className="gap-1.5 text-xs text-foreground-muted hover:text-foreground"
              disabled={loading}
            >
              <ArrowLeft size={13} /> Back
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs text-foreground-muted hover:text-foreground"
            >
              Cancel
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {step === 1 ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setStep(2)}
              className="gap-1.5 text-xs"
            >
              Continue <ArrowRight size={13} />
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="text-xs text-foreground-muted hover:text-foreground"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleCreate}
                disabled={!isValid || loading}
                className="gap-1.5 text-xs shadow-[0_0_20px_rgba(124,92,255,0.3)]"
              >
                {loading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Creating Sandbox...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </DialogContent>
  );
};

export const CreateProjectModal = ({
  open,
  onOpenChange,
  initialTemplate,
  initialSource,
  initialStep,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <CreateProjectModalContent
          onOpenChange={onOpenChange}
          initialTemplate={initialTemplate}
          initialSource={initialSource}
          initialStep={initialStep}
        />
      )}
    </Dialog>
  );
};
