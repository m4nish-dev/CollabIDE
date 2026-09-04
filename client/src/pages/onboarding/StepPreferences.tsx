import React from 'react'
import { Code2, Layers, Rocket } from 'lucide-react'
import { useOnboardingStore, ExperienceLevel } from '@/store/useOnboardingStore'
import { cn } from '@/lib/utils'

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C++', 'Ruby', 'PHP', 'Swift']
const FRAMEWORKS = ['React', 'Next.js', 'Node.js', 'Vue', 'Svelte', 'Django', 'Flask', 'Rails', 'Spring']

interface ExperienceCard {
  value: ExperienceLevel
  label: string
  description: string
  icon: React.ReactNode
}

const EXPERIENCE_LEVELS: ExperienceCard[] = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: 'Learning the ropes, less than 2 years',
    icon: <Code2 size={20} className="text-secondary" />,
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'Comfortable with most concepts, 2–5 years',
    icon: <Layers size={20} className="text-accent" />,
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: 'Deep expertise, 5+ years building production systems',
    icon: <Rocket size={20} className="text-warning" />,
  },
]

export const StepPreferences: React.FC = () => {
  const {
    selectedLanguages, selectedFrameworks, experienceLevel,
    toggleLanguage, toggleFramework, setPreferences,
  } = useOnboardingStore()

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-xl font-semibold text-foreground">What do you work with?</h2>
        <p className="mt-1 text-sm text-foreground-muted">We&apos;ll personalise your experience based on your stack</p>
      </div>

      {/* Languages */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">Languages</label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => {
            const active = selectedLanguages.includes(lang)
            return (
              <button
                key={lang}
                onClick={() => toggleLanguage(lang)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150 active:scale-95',
                  active
                    ? 'border-accent bg-accent text-white shadow-[0_0_12px_rgba(124,92,255,0.3)]'
                    : 'border-border bg-background-elevated text-foreground-muted hover:border-border-strong hover:text-foreground'
                )}
              >
                {lang}
              </button>
            )
          })}
        </div>
      </div>

      {/* Frameworks */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">Frameworks & Runtimes</label>
        <div className="flex flex-wrap gap-2">
          {FRAMEWORKS.map(fw => {
            const active = selectedFrameworks.includes(fw)
            return (
              <button
                key={fw}
                onClick={() => toggleFramework(fw)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150 active:scale-95',
                  active
                    ? 'border-accent bg-accent text-white shadow-[0_0_12px_rgba(124,92,255,0.3)]'
                    : 'border-border bg-background-elevated text-foreground-muted hover:border-border-strong hover:text-foreground'
                )}
              >
                {fw}
              </button>
            )
          })}
        </div>
      </div>

      {/* Experience level */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">Experience Level</label>
        <div className="grid grid-cols-3 gap-3">
          {EXPERIENCE_LEVELS.map(level => {
            const active = experienceLevel === level.value
            return (
              <button
                key={level.value}
                onClick={() => setPreferences({ experienceLevel: level.value })}
                className={cn(
                  'flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all duration-150 active:scale-[0.98]',
                  active
                    ? 'border-accent bg-accent/10 ring-1 ring-accent'
                    : 'border-border bg-background-elevated hover:border-border-strong hover:bg-background-hover'
                )}
              >
                {level.icon}
                <div>
                  <div className={cn('text-sm font-semibold', active ? 'text-accent' : 'text-foreground')}>
                    {level.label}
                  </div>
                  <div className="mt-0.5 text-[11px] leading-snug text-foreground-subtle">
                    {level.description}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
