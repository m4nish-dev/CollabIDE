import { formatDistanceToNow } from 'date-fns'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, MoreHorizontal, ExternalLink, Copy, Share2, Archive, Trash2, Pencil } from 'lucide-react'

import { cn } from '@/lib/utils'
import { type Project, type Language } from '@/lib/mockData'
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent,
  ContextMenuItem, ContextMenuSeparator,
} from '@/components/ui/context-menu'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

// ── Language config ──────────────────────────────────────────────
export const LANG_CONFIG: Record<Language, { color: string; bg: string; label: string }> = {
  TypeScript: { color: '#3B82F6', bg: '#3B82F614', label: 'TS' },
  JavaScript: { color: '#F59E0B', bg: '#F59E0B14', label: 'JS' },
  Python:     { color: '#10B981', bg: '#10B98114', label: 'Py' },
  Go:         { color: '#22D3EE', bg: '#22D3EE14', label: 'Go' },
  Rust:       { color: '#F97316', bg: '#F9731614', label: 'Rs' },
  Java:       { color: '#EF4444', bg: '#EF444414', label: 'Jv' },
  CSS:        { color: '#8B5CF6', bg: '#8B5CF614', label: 'CSS' },
  MDX:        { color: '#EC4899', bg: '#EC489914', label: 'MDX' },
}

// ── Collaborator avatars strip ───────────────────────────────────
const CollabAvatars: React.FC<{ project: Project }> = ({ project }) => {
  const MAX_SHOWN = 4
  const shown = project.collaborators.slice(0, MAX_SHOWN)
  const extra = project.collaborators.length - MAX_SHOWN

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-1.5">
        {shown.map(c => (
          <img
            key={c.id}
            src={c.avatar}
            alt={c.name}
            title={c.name}
            className="h-6 w-6 rounded-full ring-2 ring-background-elevated object-cover"
          />
        ))}
      </div>
      {extra > 0 && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background-hover border border-border text-[10px] font-medium text-foreground-muted">
          +{extra}
        </span>
      )}
    </div>
  )
}

// ── 3-dot menu ───────────────────────────────────────────────────
const CardMenu: React.FC<{ project: Project; onStar: () => void }> = ({ project, onStar }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        onClick={e => e.stopPropagation()}
        className="flex h-7 w-7 items-center justify-center rounded-md text-foreground-subtle opacity-0 group-hover:opacity-100 transition-all hover:bg-background-hover hover:text-foreground"
      >
        <MoreHorizontal size={15} />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-44" onClick={e => e.stopPropagation()}>
      <DropdownMenuItem className="gap-2 cursor-pointer text-xs">
        <ExternalLink size={13} /> Open
      </DropdownMenuItem>
      <DropdownMenuItem className="gap-2 cursor-pointer text-xs" onClick={onStar}>
        <Star size={13} /> {project.starred ? 'Unstar' : 'Star'}
      </DropdownMenuItem>
      <DropdownMenuItem className="gap-2 cursor-pointer text-xs">
        <Pencil size={13} /> Rename
      </DropdownMenuItem>
      <DropdownMenuItem className="gap-2 cursor-pointer text-xs">
        <Copy size={13} /> Duplicate
      </DropdownMenuItem>
      <DropdownMenuItem className="gap-2 cursor-pointer text-xs">
        <Share2 size={13} /> Share
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="gap-2 cursor-pointer text-xs">
        <Archive size={13} /> Archive
      </DropdownMenuItem>
      <DropdownMenuItem className="gap-2 cursor-pointer text-xs text-danger focus:text-danger focus:bg-danger/10">
        <Trash2 size={13} /> Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

// ── Project Card ─────────────────────────────────────────────────
interface ProjectCardProps {
  project: Project
  index?: number
  view?: 'grid' | 'list'
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index = 0, view = 'grid' }) => {
  const navigate = useNavigate()
  const [starred, setStarred] = useState(project.starred)
  const lang = LANG_CONFIG[project.language]

  const handleNavigate = () => navigate(`/project/${project.id}`)

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
        onClick={handleNavigate}
        className="group flex items-center gap-4 px-4 py-3 border-b border-border hover:bg-background-hover cursor-pointer transition-colors"
      >
        {/* Lang badge */}
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[10px] font-bold"
          style={{ color: lang.color, background: lang.bg }}
        >
          {lang.label}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground truncate">{project.name}</span>
            {project.starred && <Star size={11} className="text-warning fill-warning shrink-0" />}
          </div>
          <p className="text-xs text-foreground-muted truncate mt-0.5">{project.description}</p>
        </div>

        <CollabAvatars project={project} />

        <span className="text-xs text-foreground-subtle whitespace-nowrap hidden sm:block">
          {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
        </span>

        <CardMenu project={{ ...project, starred }} onStar={() => setStarred(s => !s)} />
      </motion.div>
    )
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleNavigate}
          className={cn(
            'group relative flex flex-col rounded-xl border border-border bg-background-elevated p-4 cursor-pointer transition-all duration-200',
            'hover:border-border-strong hover:shadow-[0_0_0_1px_rgba(124,92,255,0.15),0_4px_24px_rgba(124,92,255,0.08)] hover:-translate-y-0.5'
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-md text-[11px] font-bold shrink-0"
                style={{ color: lang.color, background: lang.bg }}
              >
                {lang.label}
              </span>
              <span className="text-[15px] font-semibold text-foreground leading-tight truncate max-w-[160px]">
                {project.name}
              </span>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                onClick={e => { e.stopPropagation(); setStarred(s => !s) }}
                className="p-1 rounded text-foreground-subtle hover:text-warning transition-colors"
              >
                <Star size={14} className={starred ? 'text-warning fill-warning' : ''} />
              </button>
              <CardMenu project={{ ...project, starred }} onStar={() => setStarred(s => !s)} />
            </div>
          </div>

          {/* Description */}
          <p className="mb-4 text-xs leading-relaxed text-foreground-muted line-clamp-2 flex-1">
            {project.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-border">
            <CollabAvatars project={project} />
            <span className="text-[11px] text-foreground-subtle whitespace-nowrap">
              {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
            </span>
          </div>
        </motion.div>
      </ContextMenuTrigger>

      {/* Right-click context menu */}
      <ContextMenuContent className="w-44" onClick={e => e.stopPropagation()}>
        <ContextMenuItem className="gap-2 cursor-pointer text-xs" onClick={handleNavigate}>
          <ExternalLink size={13} /> Open
        </ContextMenuItem>
        <ContextMenuItem className="gap-2 cursor-pointer text-xs" onClick={() => setStarred(s => !s)}>
          <Star size={13} /> {starred ? 'Unstar' : 'Star'}
        </ContextMenuItem>
        <ContextMenuItem className="gap-2 cursor-pointer text-xs">
          <Pencil size={13} /> Rename
        </ContextMenuItem>
        <ContextMenuItem className="gap-2 cursor-pointer text-xs">
          <Copy size={13} /> Duplicate
        </ContextMenuItem>
        <ContextMenuItem className="gap-2 cursor-pointer text-xs">
          <Share2 size={13} /> Share
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="gap-2 cursor-pointer text-xs">
          <Archive size={13} /> Archive
        </ContextMenuItem>
        <ContextMenuItem className="gap-2 cursor-pointer text-xs text-danger focus:text-danger focus:bg-danger/10">
          <Trash2 size={13} /> Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
