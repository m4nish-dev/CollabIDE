import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Sparkles,
  LayoutTemplate,
  Users,
  Star,
  SearchX,
  ArrowRight,
} from 'lucide-react'

import { TEMPLATES_DATA, type Template, type TemplateCategory } from '@/lib/templatesData'
import { FrameworkIcon } from '@/components/shared/FrameworkIcon'
import { CreateProjectModal } from '@/components/features/projects/CreateProjectModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const CATEGORIES: TemplateCategory[] = ['All', 'Frontend', 'Backend', 'Fullstack', 'Static', 'Learning']

export default function Templates() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: TEMPLATES_DATA.length }
    TEMPLATES_DATA.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1
    })
    return counts
  }, [])

  // Filtered list
  const filteredTemplates = useMemo(() => {
    return TEMPLATES_DATA.filter(template => {
      // Category filter
      if (activeCategory !== 'All' && template.category !== activeCategory) {
        return false
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = template.name.toLowerCase().includes(q)
        const matchDesc = template.description.toLowerCase().includes(q)
        const matchTags = template.tags.some(tag => tag.toLowerCase().includes(q))
        if (!matchName && !matchDesc && !matchTags) return false
      }

      return true
    })
  }, [activeCategory, searchQuery])

  const handleUseTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setModalOpen(true)
  }

  return (
    <div className="max-w-[1440px] mx-auto min-h-full pb-14 space-y-8">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-2.5">
            <Sparkles size={13} />
            <span>Curated Starter Kits</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Templates
          </h1>
          <p className="text-sm text-foreground-muted mt-1 leading-relaxed max-w-2xl">
            Start your next project from a proven starting point. Each template comes pre-configured
            with language runtimes, build tools, and instant sandbox environments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-foreground-subtle bg-background-elevated/70 border border-border px-3 py-1.5 rounded-lg">
            <LayoutTemplate size={14} className="text-accent" />
            <span className="font-semibold text-foreground">{TEMPLATES_DATA.length}</span> templates available
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle"
          />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search templates by framework, runtime, or tag..."
            className="pl-9 pr-3 h-10 text-xs bg-background-elevated/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-foreground-subtle hover:text-foreground bg-background-hover px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(category => {
            const isSelected = activeCategory === category
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border',
                  isSelected
                    ? 'bg-accent/15 text-accent border-accent/40 font-semibold shadow-[0_0_12px_rgba(124,92,255,0.15)]'
                    : 'bg-background-elevated/50 text-foreground-muted border-border hover:border-border-strong hover:text-foreground'
                )}
              >
                <span>{category}</span>
                <span
                  className={cn(
                    'text-[10px] font-mono px-1.5 py-0.2 rounded-full',
                    isSelected ? 'bg-accent/25 text-accent' : 'bg-background text-foreground-subtle'
                  )}
                >
                  {categoryCounts[category] || 0}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Grid of Template Cards (3 columns) ──────────────────── */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((template, idx) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.3 }}
              className={cn(
                'group relative flex flex-col rounded-xl border border-border bg-background-elevated/70 overflow-hidden transition-all duration-300',
                'hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_8px_30px_rgba(124,92,255,0.14)]'
              )}
            >
              {/* Top: Stylized Gradient Banner with Framework Logo */}
              <div
                className={cn(
                  'relative h-32 w-full bg-gradient-to-br flex items-center justify-center border-b border-border/70 overflow-hidden',
                  template.gradient
                )}
              >
                {/* Background decorative glow */}
                <div
                  className="absolute inset-0 opacity-40 blur-xl group-hover:opacity-70 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at center, ${template.accentColor} 0%, transparent 70%)` }}
                />

                {/* Framework Logo Badge */}
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-background/80 border border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-300 backdrop-blur-md">
                  <FrameworkIcon
                    name={template.iconName}
                    size={28}
                    className="transition-colors duration-300"
                    style={{ color: template.accentColor }}
                  />
                </div>

                {/* Top-Right Star Pill */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-2 py-0.5 text-[10px] font-medium text-foreground-muted border border-white/10">
                  <Star size={10} className="text-warning fill-warning" />
                  <span>{template.stars}</span>
                </div>

                {/* Top-Left Category Tag */}
                <div className="absolute top-2.5 left-2.5 rounded-full bg-black/40 backdrop-blur-md px-2 py-0.5 text-[10px] font-medium text-foreground-muted border border-white/10">
                  {template.category}
                </div>
              </div>

              {/* Body: Template details */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs text-foreground-muted mt-1.5 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>

                  {/* Tech stack chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
                    {template.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-background-hover border border-border/80 text-[10px] font-medium text-foreground-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom: Usage count + Use template button */}
                <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-border/80">
                  <div className="flex items-center gap-1.5 text-[11px] text-foreground-subtle">
                    <Users size={12} className="text-foreground-subtle" />
                    <span>Used by {template.usedBy}</span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUseTemplate(template)}
                    className="gap-1.5 text-xs font-medium group-hover:shadow-[0_0_15px_rgba(124,92,255,0.35)]"
                  >
                    <span>Use template</span>
                    <ArrowRight size={12} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Empty search state */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-16 text-center rounded-2xl border border-dashed border-border bg-background-elevated/20"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent mb-4 border border-accent/20">
            <SearchX size={22} />
          </div>
          <h3 className="text-base font-semibold text-foreground">No templates found</h3>
          <p className="text-xs text-foreground-muted max-w-sm mt-1 mb-5">
            We couldn't find any templates matching "{searchQuery}". Try searching for another framework or clear your filters.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchQuery('')
              setActiveCategory('All')
            }}
          >
            Clear filters
          </Button>
        </motion.div>
      )}

      {/* Create Project Modal Pre-filled */}
      <CreateProjectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialTemplate={selectedTemplate}
        initialSource="template"
        initialStep={2}
      />
    </div>
  )
}
