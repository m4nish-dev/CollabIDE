import React, { useState, useRef } from 'react'
import { X, Link2, Check, ChevronDown } from 'lucide-react'
import { useOnboardingStore, type InviteEntry } from '@/store/useOnboardingStore'
import { cn } from '@/lib/utils'

const INVITE_LINK = 'https://collabide.dev/invite/abc123xyz'

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

const RoleDropdown: React.FC<{ invite: InviteEntry; onChange: (role: 'editor' | 'viewer') => void }> = ({ invite, onChange }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 rounded-md border border-border bg-background-elevated px-2 py-0.5 text-xs text-foreground-muted hover:border-border-strong hover:text-foreground transition-colors"
      >
        {invite.role === 'editor' ? 'Editor' : 'Viewer'}
        <ChevronDown size={10} />
      </button>
      {open && (
        <div className="absolute right-0 top-7 z-10 w-28 rounded-md border border-border bg-background-elevated shadow-lg overflow-hidden">
          {(['editor', 'viewer'] as const).map(r => (
            <button
              key={r}
              className="flex w-full items-center justify-between px-3 py-1.5 text-xs text-foreground-muted hover:bg-background-hover hover:text-foreground transition-colors"
              onClick={() => { onChange(r); setOpen(false) }}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
              {invite.role === r && <Check size={10} className="text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export const StepInvite: React.FC = () => {
  const { invites, addInvite, removeInvite, updateInviteRole } = useOnboardingStore()
  const [inputVal, setInputVal] = useState('')
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const tryAddEmail = (raw: string) => {
    const email = raw.trim().replace(/,+$/, '')
    if (isValidEmail(email) && !invites.find(i => i.email === email)) {
      addInvite({ email, role: 'editor' })
    }
    setInputVal('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      tryAddEmail(inputVal)
    } else if (e.key === 'Backspace' && !inputVal && invites.length > 0) {
      removeInvite(invites[invites.length - 1].email)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(INVITE_LINK)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Invite your team</h2>
        <p className="mt-1 text-sm text-foreground-muted">You can always do this later from Settings</p>
      </div>

      {/* Multi-email chip input */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground-muted">Email addresses</label>
        <div
          className="flex min-h-[44px] w-full flex-wrap items-center gap-1.5 rounded-lg border border-border bg-background-elevated px-3 py-2 focus-within:ring-2 focus-within:ring-accent cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {invites.map(inv => (
            <span
              key={inv.email}
              className="flex items-center gap-1.5 rounded-full bg-accent/15 border border-accent/30 px-2.5 py-0.5 text-xs text-accent"
            >
              {inv.email}
              <RoleDropdown invite={inv} onChange={role => updateInviteRole(inv.email, role)} />
              <button
                onClick={e => { e.stopPropagation(); removeInvite(inv.email) }}
                className="ml-0.5 text-accent/60 hover:text-accent transition-colors"
              >
                <X size={11} />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => inputVal && tryAddEmail(inputVal)}
            placeholder={invites.length === 0 ? 'teammate@company.com, press Enter or comma…' : ''}
            className="flex-1 min-w-[160px] bg-transparent text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none"
          />
        </div>
        <p className="text-[11px] text-foreground-subtle">Press Enter or comma to add. Each person gets an Editor or Viewer role.</p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[11px] text-foreground-subtle">or share link</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Copy invite link */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground-muted">Invite link</label>
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-background-elevated px-3 py-2.5">
            <Link2 size={13} className="text-foreground-subtle shrink-0" />
            <span className="flex-1 text-xs text-foreground-muted font-mono truncate">{INVITE_LINK}</span>
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition-all duration-150',
              copied
                ? 'border-success bg-success/10 text-success'
                : 'border-border bg-background-elevated text-foreground-muted hover:border-border-strong hover:text-foreground'
            )}
          >
            {copied ? <><Check size={12} /> Copied!</> : 'Copy'}
          </button>
        </div>
      </div>

      {invites.length > 0 && (
        <div className="rounded-lg border border-border bg-background-elevated/50 p-3">
          <p className="text-xs text-foreground-muted">
            <span className="font-semibold text-foreground">{invites.length}</span> invite{invites.length > 1 ? 's' : ''} ready to send
          </p>
        </div>
      )}
    </div>
  )
}
