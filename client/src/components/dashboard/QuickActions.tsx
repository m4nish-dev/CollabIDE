import React from 'react'
import { motion } from 'framer-motion'
import { Plus, LayoutTemplate, UserPlus, ArrowUpRight } from 'lucide-react'
import { GitHubIcon } from '@/components/auth/AuthAtoms'
import { cn } from '@/lib/utils'

interface QuickActionsProps {
  onNewProject: () => void
  onImportGithub?: () => void
  onBrowseTemplates?: () => void
  onInviteTeammates?: () => void
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onNewProject,
  onImportGithub,
  onBrowseTemplates,
  onInviteTeammates,
}) => {
  const actions = [
    {
      id: 'new-project',
      title: 'New Project',
      desc: 'Create from scratch with an instant dev environment',
      icon: Plus,
      color: '#7C5CFF',
      bg: 'rgba(124, 92, 255, 0.12)',
      borderHover: 'hover:border-[#7C5CFF]/60 hover:shadow-[0_0_24px_rgba(124,92,255,0.18)]',
      onClick: onNewProject,
    },
    {
      id: 'import-github',
      title: 'Import from GitHub',
      desc: 'Clone a public or private repository with one click',
      icon: GitHubIcon,
      color: '#22D3EE',
      bg: 'rgba(34, 211, 238, 0.12)',
      borderHover: 'hover:border-[#22D3EE]/60 hover:shadow-[0_0_24px_rgba(34,211,238,0.18)]',
      onClick: onImportGithub,
    },
    {
      id: 'browse-templates',
      title: 'Browse Templates',
      desc: 'Jumpstart with Next.js, Vite, Python, or Go boilerplates',
      icon: LayoutTemplate,
      color: '#EC4899',
      bg: 'rgba(236, 72, 153, 0.12)',
      borderHover: 'hover:border-[#EC4899]/60 hover:shadow-[0_0_24px_rgba(236,72,153,0.18)]',
      onClick: onBrowseTemplates,
    },
    {
      id: 'invite-teammates',
      title: 'Invite Teammates',
      desc: 'Add collaborators with fine-grained workspace permissions',
      icon: UserPlus,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.12)',
      borderHover: 'hover:border-[#10B981]/60 hover:shadow-[0_0_24px_rgba(16,185,129,0.18)]',
      onClick: onInviteTeammates,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
      {actions.map((act, idx) => {
        const Icon = act.icon
        return (
          <motion.button
            key={act.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            onClick={act.onClick}
            type="button"
            className={cn(
              'group relative flex flex-col justify-between text-left h-[120px] rounded-xl border border-border bg-background-elevated/70 backdrop-blur-sm p-4 cursor-pointer transition-all duration-200',
              'hover:-translate-y-1',
              act.borderHover
            )}
          >
            <div className="flex items-start justify-between">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105"
                style={{ background: act.bg, color: act.color }}
              >
                <Icon size={18} />
              </div>
              <ArrowUpRight
                size={15}
                className="text-foreground-subtle opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: act.color }}
              />
            </div>

            <div>
              <div className="text-[13.5px] font-semibold text-foreground tracking-tight group-hover:text-foreground">
                {act.title}
              </div>
              <p className="text-[11px] text-foreground-muted leading-tight mt-0.5 line-clamp-1">
                {act.desc}
              </p>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
