import React, { useEffect } from "react";
import { User, Users } from "lucide-react";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const ICONS = [
  "🚀",
  "⚡",
  "🔥",
  "💡",
  "🎯",
  "🛠️",
  "🌊",
  "🌙",
  "🎨",
  "🤖",
  "🦄",
  "✨",
];

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const WORKSPACE_TYPES = [
  {
    value: "personal",
    label: "Personal",
    description: "For solo projects and experiments",
    icon: <User size={18} className="text-accent" />,
  },
  {
    value: "team",
    label: "Team",
    description: "Collaborate with your teammates",
    icon: <Users size={18} className="text-secondary" />,
  },
];

export const StepWorkspace = () => {
  const {
    workspaceName,
    workspaceSlug,
    workspaceType,
    workspaceIcon,
    setWorkspace,
  } = useOnboardingStore();

  // Auto-generate slug from name
  useEffect(() => {
    if (workspaceName) {
      setWorkspace({ workspaceSlug: slugify(workspaceName) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceName]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Create your first workspace
        </h2>
        <p className="mt-1 text-sm text-foreground-muted">
          Workspaces are where you and your team collaborate
        </p>
      </div>

      {/* Workspace name */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground-muted">
          Workspace name
        </label>
        <Input
          value={workspaceName}
          onChange={(e) => setWorkspace({ workspaceName: e.target.value })}
          placeholder="Acme Inc."
        />
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground-muted">
          Workspace URL
        </label>
        <div className="flex items-center gap-0 rounded-lg border border-border bg-background-elevated overflow-hidden focus-within:ring-2 focus-within:ring-accent">
          <span className="flex items-center border-r border-border bg-background-hover px-3 py-2.5 text-xs text-foreground-subtle whitespace-nowrap">
            collabide.dev/w/
          </span>
          <input
            value={workspaceSlug}
            onChange={(e) =>
              setWorkspace({ workspaceSlug: slugify(e.target.value) })
            }
            className="flex-1 bg-transparent px-3 py-2.5 text-sm text-foreground focus:outline-none"
            placeholder="acme-inc"
          />
        </div>
      </div>

      {/* Type */}
      <div className="space-y-3">
        <label className="text-xs font-medium text-foreground-muted">
          Workspace type
        </label>
        <div className="grid grid-cols-2 gap-3">
          {WORKSPACE_TYPES.map((t) => {
            const active = workspaceType === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setWorkspace({ workspaceType: t.value })}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-150",
                  active
                    ? "border-accent bg-accent/10 ring-1 ring-accent"
                    : "border-border bg-background-elevated hover:border-border-strong hover:bg-background-hover",
                )}
              >
                <div className="mt-0.5">{t.icon}</div>
                <div>
                  <div
                    className={cn(
                      "text-sm font-semibold",
                      active ? "text-accent" : "text-foreground",
                    )}
                  >
                    {t.label}
                  </div>
                  <div className="mt-0.5 text-[11px] text-foreground-subtle">
                    {t.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Icon picker */}
      <div className="space-y-3">
        <label className="text-xs font-medium text-foreground-muted">
          Workspace icon
        </label>
        <div className="flex flex-wrap gap-2">
          {ICONS.map((icon) => (
            <button
              key={icon}
              onClick={() => setWorkspace({ workspaceIcon: icon })}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg border text-lg transition-all duration-150",
                workspaceIcon === icon
                  ? "border-accent bg-accent/10 ring-1 ring-accent scale-110"
                  : "border-border bg-background-elevated hover:border-border-strong hover:bg-background-hover",
              )}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
