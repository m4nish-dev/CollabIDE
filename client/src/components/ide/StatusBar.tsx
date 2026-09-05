import React from 'react'
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  GitBranch,
} from 'lucide-react'
import { useProjectStore } from '@/store/useProjectStore'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export const StatusBar: React.FC = () => {
  const {
    currentBranch,
    problems,
    cursorPosition,
    collaborators,
    activeFileId,
    setActiveBottomTab,
    setActiveRightTab,
    toggleRightPanel,
  } = useProjectStore()

  const errorCount = problems.filter((p) => p.severity === 'error').length
  const warningCount = problems.filter((p) => p.severity === 'warning').length

  const getLanguageLabel = (filePath: string) => {
    const ext = filePath.split('.').pop()?.toLowerCase() || ''
    switch (ext) {
      case 'tsx':
        return 'TypeScript React'
      case 'ts':
        return 'TypeScript'
      case 'jsx':
        return 'JavaScript React'
      case 'js':
        return 'JavaScript'
      case 'json':
        return 'JSON'
      case 'css':
        return 'CSS'
      case 'html':
        return 'HTML'
      case 'md':
        return 'Markdown'
      default:
        return 'Plain Text'
    }
  }

  return (
    <TooltipProvider delayDuration={150}>
      <footer className="h-[22px] w-full bg-accent/95 hover:bg-accent text-white px-2 flex items-center justify-between select-none text-[11px] font-sans z-30 shrink-0 transition-colors shadow-inner">
        {/* Left Status Group */}
        <div className="flex items-center gap-2">
          {/* Branch */}
          <div className="flex items-center gap-1 hover:bg-black/15 px-1.5 py-0.5 rounded cursor-pointer transition-colors">
            <GitBranch className="h-3 w-3" />
            <span className="font-mono text-[10px]">{currentBranch}*</span>
          </div>

          {/* Sync Status */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 hover:bg-black/15 px-1.5 py-0.5 rounded cursor-pointer transition-colors">
                <CheckCircle2 className="h-3 w-3 text-white/90" />
                <span className="text-[10px]">Synced</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs bg-background-overlay text-foreground border-border">
              All changes saved to cloud sandbox
            </TooltipContent>
          </Tooltip>

          {/* Errors & Warnings */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setActiveBottomTab('problems')}
                className="flex items-center gap-1.5 hover:bg-black/15 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-0.5">
                  <AlertCircle className="h-3 w-3 text-white" />
                  <span className="font-bold text-[10px]">{errorCount}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <AlertTriangle className="h-3 w-3 text-white/90" />
                  <span className="font-bold text-[10px]">{warningCount}</span>
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs bg-background-overlay text-foreground border-border">
              {errorCount} Errors, {warningCount} Warnings (Click to view Problems)
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Right Status Group */}
        <div className="flex items-center gap-2">
          {/* Cursor Position */}
          <div className="font-mono text-[10px] hover:bg-black/15 px-1.5 py-0.5 rounded cursor-default">
            Ln {cursorPosition.lineNumber}, Col {cursorPosition.column}
          </div>

          <div className="hidden sm:block text-[10px] hover:bg-black/15 px-1.5 py-0.5 rounded cursor-default">
            Spaces: 2
          </div>

          <div className="hidden sm:block text-[10px] hover:bg-black/15 px-1.5 py-0.5 rounded cursor-default">
            UTF-8
          </div>

          <div className="hidden md:block text-[10px] hover:bg-black/15 px-1.5 py-0.5 rounded cursor-default">
            LF
          </div>

          {/* Language Mode */}
          <div className="hover:bg-black/15 px-1.5 py-0.5 rounded cursor-pointer font-medium text-[10px]">
            {getLanguageLabel(activeFileId)}
          </div>

          {/* Collaboration Presence Indicator */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  setActiveRightTab('collaborators')
                  toggleRightPanel()
                }}
                className="flex items-center gap-1.5 hover:bg-black/20 bg-black/10 px-2 py-0.5 rounded font-medium text-[10px] transition-colors"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span>Connected — {collaborators.length} collaborators</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs bg-background-overlay text-foreground border-border">
              Real-time collaboration active with {collaborators.length} peers
            </TooltipContent>
          </Tooltip>
        </div>
      </footer>
    </TooltipProvider>
  )
}
