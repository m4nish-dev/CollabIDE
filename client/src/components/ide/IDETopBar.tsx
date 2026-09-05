import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
} from 'lucide-react'
import { useProjectStore } from '@/store/useProjectStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ShareModal } from './ShareModal'

export const IDETopBar: React.FC = () => {
  const {
    projectName,
    setProjectName,
    currentBranch,
    branches,
    setCurrentBranch,
    activeFileId,
    collaborators,
    isRunning,
    toggleRun,
    isShareModalOpen,
    setIsShareModalOpen,
    toggleRightPanel,
    setActiveRightTab,
  } = useProjectStore()

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(projectName)
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [isEditingTitle])

  const handleTitleSubmit = () => {
    const trimmed = editedTitle.trim()
    if (trimmed) {
      setProjectName(trimmed)
    } else {
      setEditedTitle(projectName)
    }
    setIsEditingTitle(false)
  }

  // Breadcrumb breakdown
  const breadcrumbSegments = activeFileId ? activeFileId.split('/') : ['src', 'App.tsx']
  const visibleCollaborators = collaborators.slice(0, 5)
  const extraCount = Math.max(0, collaborators.length - 5)

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
                  if (e.key === 'Enter') handleTitleSubmit()
                  if (e.key === 'Escape') {
                    setEditedTitle(projectName)
                    setIsEditingTitle(false)
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
                <span className="text-[10px] text-foreground-subtle opacity-0 group-hover:opacity-100 transition-opacity">✎</span>
              </button>
            )}
          </div>

          <div className="h-3.5 w-px bg-border mx-0.5" />

          {/* Git Branch Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-6 px-2 text-[11px] font-mono text-foreground-muted hover:text-foreground bg-background/50 hover:bg-background border border-border/80 rounded flex items-center gap-1.5 transition-colors">
                <GitBranch className="h-3 w-3 text-accent" />
                <span className="truncate max-w-[90px]">{currentBranch}</span>
                <ChevronDown className="h-2.5 w-2.5 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-background-elevated border-border text-foreground">
              <DropdownMenuLabel className="text-[10px] uppercase font-semibold text-foreground-subtle tracking-wider">
                Switch Branch
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              {branches.map((b) => (
                <DropdownMenuItem
                  key={b}
                  onClick={() => setCurrentBranch(b)}
                  className="text-xs font-mono flex items-center justify-between cursor-pointer focus:bg-background-hover focus:text-accent"
                >
                  <span className="truncate">{b}</span>
                  {b === currentBranch && <Check className="h-3.5 w-3.5 text-accent" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
              <span className={idx === breadcrumbSegments.length - 1 ? 'text-foreground font-semibold' : 'text-foreground-muted'}>
                {seg}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Right Cluster */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Live Collaborator Avatars */}
          <div className="flex items-center -space-x-1.5 hover:space-x-0.5 transition-all py-0.5">
            {visibleCollaborators.map((c) => (
              <Tooltip key={c.id}>
                <TooltipTrigger asChild>
                  <div
                    className="relative cursor-pointer transition-transform hover:scale-110 hover:z-10"
                    onClick={() => {
                      setActiveRightTab('collaborators')
                    }}
                  >
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="h-6 w-6 rounded-full object-cover ring-2 ring-background-elevated"
                      style={{ outline: `2px solid ${c.color}` }}
                    />
                    <span
                      className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full border border-background"
                      style={{ backgroundColor: c.status === 'online' ? '#10B981' : '#F59E0B' }}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs bg-background-overlay border-border p-2">
                  <div className="font-semibold text-foreground">{c.name}</div>
                  <div className="text-[10px] text-foreground-muted">
                    editing <span className="text-accent">{c.activeFile.split('/').pop()}</span>
                  </div>
                  <div className="text-[10px] text-foreground-subtle">{c.role}</div>
                </TooltipContent>
              </Tooltip>
            ))}

            {extraCount > 0 && (
              <div className="h-6 px-1.5 rounded-full bg-background-hover border border-border text-[10px] font-medium text-foreground flex items-center justify-center">
                +{extraCount}
              </div>
            )}
          </div>

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
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-emerald-500 text-black hover:bg-emerald-400 border border-emerald-400/50 shadow-emerald-500/20'
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

          {/* Settings gear */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  setActiveRightTab('preview')
                  toggleRightPanel()
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

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </TooltipProvider>
  )
}
