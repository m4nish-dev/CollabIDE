import React from "react";
import {
  Bug,
  Command,
  Files,
  GitBranch,
  Puzzle,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export const ActivityBar = () => {
  const {
    activeActivity,
    setActiveActivity,
    isSidebarOpen,
    unsavedFileIds,
    collaborators,
    setActiveRightTab,
    toggleRightPanel,
    setIsCommandPaletteOpen,
  } = useProjectStore();

  const unstagedCount = unsavedFileIds.size;

  const topItems = [
    { id: "explorer", label: "Explorer (⌘⇧E)", icon: Files },
    { id: "search", label: "Search (⌘⇧F)", icon: Search },
    {
      id: "git",
      label: "Source Control (⌃⇧G)",
      icon: GitBranch,
      badge: unstagedCount > 0 ? unstagedCount : undefined,
    },
    { id: "debug", label: "Run & Debug (⌘⇧D)", icon: Bug },
    {
      id: "collaborators",
      label: `Collaborators (${collaborators.length})`,
      icon: Users,
    },
    {
      id: "extensions",
      label: "Extensions (Coming soon)",
      icon: Puzzle,
      disabled: true,
    },
  ];

  const handleItemClick = (item) => {
    if (item.disabled) {
      toast.info(
        "Plugin marketplace and extensions are coming soon in next milestone!",
      );
      return;
    }
    if (item.id === "collaborators") {
      setActiveRightTab("collaborators");
      toggleRightPanel();
      return;
    }
    setActiveActivity(item.id);
  };

  const handleCommandPalette = () => {
    setIsCommandPaletteOpen(true);
  };

  const handleSettingsClick = () => {
    toast.info(
      "IDE Settings: JetBrains Mono, Dark Electric Violet theme active",
    );
  };

  return (
    <TooltipProvider delayDuration={150}>
      <aside className="w-12 h-full bg-background-elevated border-r border-border flex flex-col justify-between select-none z-20 shrink-0">
        {/* Top items */}
        <div className="flex flex-col items-center">
          {topItems.map((item) => {
            const Icon = item.icon;
            const isActive = isSidebarOpen && activeActivity === item.id;
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`relative w-12 h-12 flex items-center justify-center transition-colors group ${
                      item.disabled
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:text-foreground"
                    } ${isActive ? "text-accent" : "text-foreground-muted"}`}
                    aria-label={item.label}
                  >
                    {/* Active left indicator (2px violet border) */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-accent rounded-r shadow-sm shadow-accent/50" />
                    )}

                    <Icon className="h-5 w-5 transition-transform group-hover:scale-105" />

                    {/* Badge */}
                    {item.badge !== undefined && (
                      <span className="absolute top-2 right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-accent text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="text-xs bg-background-overlay border-border"
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Bottom items */}
        <div className="flex flex-col items-center pb-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleCommandPalette}
                className="w-12 h-12 flex items-center justify-center text-foreground-muted hover:text-foreground transition-colors"
                aria-label="Command Palette (⌘K)"
              >
                <Command className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="text-xs bg-background-overlay border-border"
            >
              Command Palette (⌘K)
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleSettingsClick}
                className="w-12 h-12 flex items-center justify-center text-foreground-muted hover:text-foreground transition-colors"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="text-xs bg-background-overlay border-border"
            >
              Preferences & Settings
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
};
