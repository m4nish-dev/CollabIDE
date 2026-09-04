import React from 'react'
import { cn } from '@/lib/utils'

interface KeyboardShortcutProps {
  keys: string[]
  className?: string
}

export const KeyboardShortcut: React.FC<KeyboardShortcutProps> = ({ keys, className }) => {
  return (
    <span className={cn('flex items-center gap-0.5', className)}>
      {keys.map((key, i) => (
        <kbd
          key={i}
          className="inline-flex items-center justify-center rounded border border-border bg-background-elevated px-1.5 py-0.5 font-mono text-[10px] text-foreground-muted leading-none"
        >
          {key}
        </kbd>
      ))}
    </span>
  )
}
