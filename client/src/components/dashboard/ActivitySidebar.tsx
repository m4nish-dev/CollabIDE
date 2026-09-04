import React from 'react'
import { motion } from 'framer-motion'
import {
  Radio,
  Pin,
  Calendar,
  ChevronRight,
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  UserPlus,
  PlayCircle,
  FileCode,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { COLLABORATORS, ACTIVITIES } from '@/lib/mockData'
import { cn } from '@/lib/utils'

interface ActivitySidebarProps {
  className?: string
}

// Icon helper for action types
const getActionIcon = (action: string) => {
  if (action.includes('pushed') || action.includes('commit')) return GitCommit
  if (action.includes('merged') || action.includes('PR') || action.includes('reviewed')) return GitPullRequest
  if (action.includes('deployed') || action.includes('passed')) return CheckCircle2
  if (action.includes('invited')) return UserPlus
  if (action.includes('ran')) return PlayCircle
  return FileCode
}

export const ActivitySidebar: React.FC<ActivitySidebarProps> = ({ className }) => {
  const onlineUsers = COLLABORATORS.filter(c => c.online)

  const pinnedNotes = [
    {
      id: 'n1',
      title: 'Sprint 14 Demo',
      due: 'Friday, 3:00 PM',
      tag: 'Critical',
      tagColor: 'text-danger bg-danger/10 border-danger/20',
    },
    {
      id: 'n2',
      title: 'v2.4 Compiler Upgrade',
      due: 'In review with Arjun',
      tag: 'Architecture',
      tagColor: 'text-accent bg-accent/10 border-accent/20',
    },
    {
      id: 'n3',
      title: 'Monaco multi-cursor sync',
      due: 'Merged to staging',
      tag: 'Completed',
      tagColor: 'text-success bg-success/10 border-success/20',
    },
  ]

  return (
    <aside className={cn('w-full xl:w-[320px] 2xl:w-[340px] shrink-0 flex flex-col gap-5', className)}>
      {/* 1. Online Teammates */}
      <div className="rounded-xl border border-border bg-background-elevated/70 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Online Workspace
            </span>
          </div>
          <span className="text-[11px] font-mono text-foreground-subtle">
            {onlineUsers.length} active
          </span>
        </div>

        <div className="space-y-2.5">
          {onlineUsers.map(collab => (
            <div key={collab.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative">
                  <img
                    src={collab.avatar}
                    alt={collab.name}
                    className="h-7 w-7 rounded-full object-cover border border-border"
                  />
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-success ring-1 ring-background" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-foreground truncate group-hover:text-accent transition-colors">
                    {collab.name}
                  </div>
                  <div className="text-[10px] text-foreground-subtle capitalize">
                    {collab.role}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-foreground-subtle font-mono group-hover:text-foreground-muted transition-colors">
                idle 4m
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Live Activity Feed */}
      <div className="rounded-xl border border-border bg-background-elevated/70 p-4 backdrop-blur-sm flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-accent animate-pulse" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Activity Stream
            </span>
          </div>
          <span className="text-[10px] text-accent hover:underline cursor-pointer">Live</span>
        </div>

        <div className="space-y-3.5 overflow-y-auto max-h-[380px] pr-1">
          {ACTIVITIES.slice(0, 8).map((act, idx) => {
            const Icon = getActionIcon(act.action)
            return (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.25 }}
                className="flex items-start gap-2.5 text-xs"
              >
                <img
                  src={act.collaborator.avatar}
                  alt={act.collaborator.name}
                  className="h-6 w-6 rounded-full object-cover shrink-0 mt-0.5 border border-border/80"
                />

                <div className="flex-1 min-w-0 leading-snug">
                  <span className="font-medium text-foreground mr-1">
                    {act.collaborator.name.split(' ')[0]}
                  </span>
                  <span className="text-foreground-muted">{act.action}</span>{' '}
                  <span className="font-mono text-[11px] text-accent bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20 break-all">
                    {act.target}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-foreground-subtle mt-0.5">
                    <Icon size={11} className="text-foreground-muted" />
                    <span>{formatDistanceToNow(new Date(act.timestamp), { addSuffix: true })}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* 3. Pinned Notes / Upcoming Deadlines */}
      <div className="rounded-xl border border-border bg-background-elevated/70 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Pin size={14} className="text-warning" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Pinned Notes
            </span>
          </div>
          <Calendar size={13} className="text-foreground-subtle" />
        </div>

        <div className="space-y-2.5">
          {pinnedNotes.map(note => (
            <div
              key={note.id}
              className="rounded-lg border border-border/80 bg-background/50 p-2.5 transition-colors hover:border-border-strong hover:bg-background-elevated/50"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium text-foreground">{note.title}</span>
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full border font-medium whitespace-nowrap', note.tagColor)}>
                  {note.tag}
                </span>
              </div>
              <div className="text-[11px] text-foreground-muted mt-1 flex items-center justify-between">
                <span>{note.due}</span>
                <ChevronRight size={12} className="text-foreground-subtle" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
