import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Folder,
  GitBranch,
  Play,
  Settings,
  Share2,
  Square,
  UserPlus,
} from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShareProjectModal } from "@/components/features/sharing/ShareProjectModal";
import { CollaboratorStack } from "@/components/features/collaboration/CollaboratorStack";
import { BranchSelector } from "@/components/features/sourceControl/BranchSelector";
import { NotificationDropdown } from "@/components/features/notifications/NotificationDropdown";

export const IDETopBar = () => {
  const {
    projectName,
    setProjectName,
    currentBranch,
    branches,
    setCurrentBranch,
    activeFileId,
    isRunning,
    toggleRun,
    isShareModalOpen,
    setIsShareModalOpen,
    toggleRightPanel,
    setActiveRightTab,
  } = useProjectStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(projectName);
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleSubmit = () => {
    const trimmed = editedTitle.trim();
    if (trimmed) {
      setProjectName(trimmed);
    } else {
      setEditedTitle(projectName);
    }
    setIsEditingTitle(false);
  };

  // Breadcrumb breakdown
  const breadcrumbSegments = activeFileId
    ? activeFileId.split("/")
    : ["src", "App.jsx"];

  return (
    <TooltipProvider delayDuration={150}>
      <header className="h-11 w-full bg-background-elevated border-b border-border px-3 flex items-center justify-between select-none z-30 shrink-0">
        {/* Left Section: Nav + Project Title + Branch */}
        <div className="flex items-center gap-2 min-w-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dashboard"
                className="h-7 w-7 rounded-md flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                aria-label="Back to Dashboard"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom">Back to Dashboard</TooltipContent>
          </Tooltip>

          {/* Project Title (Inline editable) */}
          <div className="flex items-center">
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSubmit();
                  if (e.key === "Escape") {
                    setEditedTitle(projectName);
                    setIsEditingTitle(false);
                  }
                }}
                className="text-xs font-semibold text-foreground bg-background px-2 py-0.5 rounded border border-accent focus:outline-none w-36"
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-xs font-semibold text-foreground hover:text-accent px-1.5 py-1 rounded hover:bg-background-hover/60 transition-colors flex items-center gap-1 group"
                title="Click to rename project"
              >
                <span className="truncate max-w-[140px]">{projectName}</span>
                <span className="text-[10px] text-foreground-subtle opacity-0 group-hover:opacity-100 transition-opacity">
                  ✎
                </span>
              </button>
            )}
          </div>

          <div className="h-3.5 w-px bg-border mx-0.5" />

          {/* Git Branch Selector */}
          <div className="flex items-center">
            <BranchSelector />
          </div>
        </div>

        {/* Center: File Breadcrumb */}
        <div className="hidden md:flex items-center gap-1 px-3 py-1 rounded-md bg-background/40 border border-border/40 text-[11px] text-foreground-muted font-mono truncate max-w-[420px]">
          <span className="text-foreground-subtle flex items-center gap-1">
            <Folder className="h-3 w-3 text-secondary" />
            <span>collab-dashboard</span>
          </span>
          {breadcrumbSegments.map((seg, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="h-3 w-3 text-foreground-subtle/60 shrink-0" />
              <span
                className={
                  idx === breadcrumbSegments.length - 1
                    ? "text-foreground font-semibold"
                    : "text-foreground-muted"
                }
              >
                {seg}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Right Cluster */}
        <div className="flex items-center gap-2 shrink-0">
          <CollaboratorStack />

          <div className="h-3.5 w-px bg-border mx-0.5" />

          {/* Invite quick action */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="h-7 w-7 rounded-md flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                aria-label="Invite Collaborators"
              >
                <UserPlus className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Invite Collaborators</TooltipContent>
          </Tooltip>

          {/* Share Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="h-7 px-2.5 text-xs font-medium rounded-md bg-accent/15 hover:bg-accent/25 text-accent border border-accent/30 flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Run / Stop Button */}
          <button
            onClick={toggleRun}
            className={`h-7 px-3 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all duration-150 shadow-sm ${
              isRunning
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30"
                : "bg-emerald-500 text-black hover:bg-emerald-400 border border-emerald-400/50 shadow-emerald-500/20"
            }`}
          >
            {isRunning ? (
              <>
                <Square className="h-3 w-3 fill-current" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 fill-current" />
                <span>Run</span>
              </>
            )}
          </button>

          {/* Notifications */}
          <NotificationDropdown />

          {/* Settings gear */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  setActiveRightTab("preview");
                  toggleRightPanel();
                }}
                className="h-7 w-7 rounded-md flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                aria-label="Settings"
              >
                <Settings className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Settings & Tools</TooltipContent>
          </Tooltip>
        </div>
      </header>

      <ShareProjectModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </TooltipProvider>
  );
};
