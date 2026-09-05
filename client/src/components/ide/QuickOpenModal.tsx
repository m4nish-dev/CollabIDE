import React, { useState } from 'react'
import {
  Code,
  Command,
  FileCode,
  FileSpreadsheet,
  FileText,
  Layers,
  Play,
  Search,
  Settings,
  SplitSquareVertical,
  Terminal,
} from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useProjectStore, type FileNode } from '@/store/useProjectStore'

interface QuickOpenModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'files' | 'commands'
}

function getAllFiles(nodes: FileNode[]): FileNode[] {
  const result: FileNode[] = []
  for (const node of nodes) {
    if (node.type === 'file') {
      result.push(node)
    }
    if (node.children) {
      result.push(...getAllFiles(node.children))
    }
  }
  return result
}

function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  switch (ext) {
    case 'tsx':
      return <FileCode className="h-4 w-4 text-sky-400" />
    case 'ts':
      return <Code className="h-4 w-4 text-blue-400" />
    case 'css':
      return <FileSpreadsheet className="h-4 w-4 text-pink-400" />
    case 'json':
      return <FileText className="h-4 w-4 text-amber-400" />
    case 'md':
      return <FileText className="h-4 w-4 text-neutral-400" />
    case 'svg':
      return <Layers className="h-4 w-4 text-purple-400" />
    default:
      return <FileText className="h-4 w-4 text-foreground-subtle" />
  }
}

export const QuickOpenModal: React.FC<QuickOpenModalProps> = ({
  isOpen,
  onClose,
  mode,
}) => {
  const {
    files,
    setActiveFile,
    toggleSidebar,
    toggleBottomPanel,
    toggleSplitEditor,
    toggleRun,
    saveCurrentFile,
    setIsShareModalOpen,
  } = useProjectStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const allFiles = getAllFiles(files)

  const commandItems = [
    {
      id: 'cmd-save',
      title: 'File: Save File',
      shortcut: '⌘S',
      icon: FileText,
      action: () => saveCurrentFile(),
    },
    {
      id: 'cmd-sidebar',
      title: 'View: Toggle Sidebar',
      shortcut: '⌘B',
      icon: Settings,
      action: () => toggleSidebar(),
    },
    {
      id: 'cmd-terminal',
      title: 'View: Toggle Bottom Panel',
      shortcut: '⌘J',
      icon: Terminal,
      action: () => toggleBottomPanel(),
    },
    {
      id: 'cmd-split',
      title: 'View: Split Editor Right',
      shortcut: '⌘\\',
      icon: SplitSquareVertical,
      action: () => toggleSplitEditor(),
    },
    {
      id: 'cmd-run',
      title: 'Project: Run / Stop Sandbox Server',
      shortcut: 'F5',
      icon: Play,
      action: () => toggleRun(),
    },
    {
      id: 'cmd-share',
      title: 'Collaboration: Share Workspace Invite',
      shortcut: '',
      icon: Command,
      action: () => setIsShareModalOpen(true),
    },
  ]

  const filteredFiles = allFiles.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.path.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCommands = commandItems.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentListLength = mode === 'files' ? filteredFiles.length : filteredCommands.length

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, currentListLength))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + currentListLength) % Math.max(1, currentListLength))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (mode === 'files' && filteredFiles[selectedIndex]) {
        setActiveFile(filteredFiles[selectedIndex].path)
        onClose()
      } else if (mode === 'commands' && filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action()
        onClose()
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 bg-background-elevated/95 border-border shadow-2xl backdrop-blur-2xl text-foreground overflow-hidden">
        {/* Search input header */}
        <div className="flex items-center gap-3 px-3.5 py-3 border-b border-border">
          {mode === 'files' ? (
            <Search className="h-4 w-4 text-foreground-subtle shrink-0" />
          ) : (
            <Command className="h-4 w-4 text-accent shrink-0" />
          )}
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === 'files'
                ? 'Search files by name (e.g. Header.tsx)...'
                : 'Type a command or action...'
            }
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none"
          />
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background border border-border text-foreground-subtle">
            ESC to close
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5">
          {mode === 'files' ? (
            filteredFiles.length === 0 ? (
              <div className="p-6 text-center text-xs text-foreground-subtle">
                No matching files found
              </div>
            ) : (
              filteredFiles.map((file, idx) => {
                const isSelected = idx === selectedIndex
                return (
                  <div
                    key={file.path}
                    onClick={() => {
                      setActiveFile(file.path)
                      onClose()
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-xs transition-colors ${
                      isSelected
                        ? 'bg-accent/20 text-foreground font-medium border border-accent/30'
                        : 'text-foreground-muted hover:bg-background-hover hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {getFileIcon(file.name)}
                      <span className="text-foreground">{file.name}</span>
                      <span className="text-[11px] text-foreground-subtle truncate">
                        {file.path}
                      </span>
                    </div>
                  </div>
                )
              })
            )
          ) : filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-xs text-foreground-subtle">
              No matching commands found
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex
              const Icon = cmd.icon
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action()
                    onClose()
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-xs transition-colors ${
                    isSelected
                      ? 'bg-accent/20 text-foreground font-medium border border-accent/30'
                      : 'text-foreground-muted hover:bg-background-hover hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="h-4 w-4 text-accent shrink-0" />
                    <span>{cmd.title}</span>
                  </div>
                  {cmd.shortcut && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background border border-border text-foreground-subtle">
                      {cmd.shortcut}
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
