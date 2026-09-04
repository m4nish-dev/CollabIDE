import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Code2, Globe, Lock, Check } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type Language } from '@/lib/mockData'
import { cn } from '@/lib/utils'

interface CreateProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate?: (project: { name: string; description: string; language: Language }) => void
}

const TEMPLATES: { name: string; lang: Language; desc: string }[] = [
  { name: 'TypeScript / React', lang: 'TypeScript', desc: 'Vite + React 19 + Tailwind' },
  { name: 'Python Data / API', lang: 'Python', desc: 'FastAPI + NumPy runtime' },
  { name: 'Go Microservice', lang: 'Go', desc: 'Go 1.22 high-concurrency server' },
  { name: 'Rust System Tool', lang: 'Rust', desc: 'Cargo workspace with CLI boilerplate' },
]

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  open,
  onOpenChange,
  onCreate,
}) => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('TypeScript')
  const [visibility, setVisibility] = useState<'private' | 'public'>('private')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const newProj = {
        name: name.trim().toLowerCase().replace(/\s+/g, '-'),
        description: description.trim() || 'A modern collaborative project built with CollabIDE.',
        language: selectedLanguage,
      }
      if (onCreate) onCreate(newProj)
      onOpenChange(false)
      setName('')
      setDescription('')
      navigate(`/project/p-new-${Date.now()}`)
    }, 600)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Sparkles size={16} />
            </span>
            Create New Project
          </DialogTitle>
          <DialogDescription className="text-foreground-muted text-xs">
            Start coding instantly in a collaborative cloud sandbox.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Project Name <span className="text-danger">*</span>
            </label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. quantum-gateway, realtime-chat"
              required
              autoFocus
              className="font-mono text-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Description (Optional)</label>
            <Input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What are you and your team building?"
              className="text-sm"
            />
          </div>

          {/* Templates */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Select Starter Template</label>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map(t => {
                const isSelected = selectedLanguage === t.lang
                return (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => setSelectedLanguage(t.lang)}
                    className={cn(
                      'flex flex-col text-left p-2.5 rounded-lg border text-xs transition-all',
                      isSelected
                        ? 'border-accent bg-accent/10 shadow-[0_0_12px_rgba(124,92,255,0.15)]'
                        : 'border-border bg-background/50 hover:bg-background-hover hover:border-border-strong'
                    )}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-semibold text-foreground">{t.name}</span>
                      {isSelected && <Check size={12} className="text-accent" />}
                    </div>
                    <span className="text-[11px] text-foreground-muted line-clamp-1">{t.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Visibility */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Visibility</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setVisibility('private')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-medium transition-all',
                  visibility === 'private'
                    ? 'border-accent bg-accent/10 text-foreground'
                    : 'border-border text-foreground-muted hover:bg-background-hover'
                )}
              >
                <Lock size={13} className={visibility === 'private' ? 'text-accent' : ''} />
                Private
              </button>

              <button
                type="button"
                onClick={() => setVisibility('public')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-medium transition-all',
                  visibility === 'public'
                    ? 'border-accent bg-accent/10 text-foreground'
                    : 'border-border text-foreground-muted hover:bg-background-hover'
                )}
              >
                <Globe size={13} className={visibility === 'public' ? 'text-accent' : ''} />
                Public
              </button>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!name.trim() || loading}
              className="gap-2"
            >
              {loading ? 'Creating Sandbox...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
