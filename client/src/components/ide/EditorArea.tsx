import React, { useEffect, useRef } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import {
  ChevronRight,
  Code,
  FileCode,
  FileSpreadsheet,
  FileText,
  Layers,
  MoreHorizontal,
  SplitSquareVertical,
  X,
} from 'lucide-react'
import { useProjectStore, type FileNode } from '@/store/useProjectStore'
import { COLLAB_IDE_THEME } from '@/lib/monacoTheme'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// Helper for color-coded file icons
function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  switch (ext) {
    case 'tsx':
      return <FileCode className="h-3.5 w-3.5 text-sky-400 shrink-0" />
    case 'ts':
      return <Code className="h-3.5 w-3.5 text-blue-400 shrink-0" />
    case 'jsx':
    case 'js':
      return <FileCode className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
    case 'css':
      return <FileSpreadsheet className="h-3.5 w-3.5 text-pink-400 shrink-0" />
    case 'json':
      return <FileText className="h-3.5 w-3.5 text-amber-400 shrink-0" />
    case 'md':
      return <FileText className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
    case 'svg':
      return <Layers className="h-3.5 w-3.5 text-purple-400 shrink-0" />
    default:
      return <FileText className="h-3.5 w-3.5 text-foreground-subtle shrink-0" />
  }
}

function findNodeByPath(nodes: FileNode[], path: string): FileNode | null {
  for (const node of nodes) {
    if (node.path === path) return node
    if (node.children) {
      const found = findNodeByPath(node.children, path)
      if (found) return found
    }
  }
  return null
}

export const EditorArea: React.FC = () => {
  const {
    files,
    activeFileId,
    openTabIds,
    unsavedFileIds,
    setActiveFile,
    closeTab,
    updateFileContent,
    setCursorPosition,
    splitEditor,
    toggleSplitEditor,
    collaborators,
    updateRemoteCursors,
  } = useProjectStore()

  // Run remote cursor simulation every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      updateRemoteCursors()
    }, 3000)
    return () => clearInterval(timer)
  }, [updateRemoteCursors])

  const activeNode = findNodeByPath(files, activeFileId)
  const secondaryFileId = openTabIds.find((id) => id !== activeFileId) || 'src/components/Header.tsx'
  const secondaryNode = findNodeByPath(files, secondaryFileId)

  const handleEditorMount: OnMount = (editor, monaco) => {
    monaco.editor.defineTheme('collab-dark', COLLAB_IDE_THEME)
    monaco.editor.setTheme('collab-dark')

    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({
        lineNumber: e.position.lineNumber,
        column: e.position.column,
      })
    })
  }

  // Breadcrumbs breakdown
  const breadcrumbSegments = activeFileId ? activeFileId.split('/') : []

  // Remote collaborators working on currently active file
  const activeFileCollaborators = collaborators.filter(
    (c) => c.activeFile === activeFileId && c.role !== 'Owner',
  )

  const tabScrollRef = useRef<HTMLDivElement>(null)

  return (
    <TooltipProvider delayDuration={150}>
      <div className="h-full w-full bg-[#0E0E12] flex flex-col overflow-hidden select-none">
        {/* Top Tab Bar */}
        <div className="h-9 bg-background-elevated border-b border-border flex items-center justify-between shrink-0">
          {/* Scrollable tabs */}
          <div
            ref={tabScrollRef}
            className="flex-1 flex items-center overflow-x-auto no-scrollbar h-full min-w-0"
          >
            {openTabIds.map((tabPath) => {
              const fileName = tabPath.split('/').pop() || tabPath
              const isActive = activeFileId === tabPath
              const isDirty = unsavedFileIds.has(tabPath)
              const remoteCollab = collaborators.find(
                (c) => c.activeFile === tabPath && c.role !== 'Owner',
              )

              return (
                <div
                  key={tabPath}
                  onClick={() => setActiveFile(tabPath)}
                  className={`group relative h-full flex items-center gap-2 px-3 border-r border-border cursor-pointer text-xs transition-colors shrink-0 ${
                    isActive
                      ? 'bg-[#0E0E12] text-foreground font-medium'
                      : 'bg-background-elevated text-foreground-muted hover:bg-background-hover hover:text-foreground'
                  }`}
                >
                  {/* Active tab bottom indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                  )}

                  {getFileIcon(fileName)}

                  <span className="truncate max-w-[150px]">{fileName}</span>

                  {/* Remote editor presence dot */}
                  {remoteCollab && (
                    <span
                      className="h-1.5 w-1.5 rounded-full ring-1 ring-background"
                      style={{ backgroundColor: remoteCollab.color }}
                      title={`${remoteCollab.name} is editing`}
                    />
                  )}

                  {/* Dirty indicator or Close button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      closeTab(tabPath)
                    }}
                    className="ml-1 p-0.5 rounded text-foreground-subtle hover:text-foreground hover:bg-background-hover transition-colors flex items-center justify-center"
                    aria-label={`Close ${fileName}`}
                  >
                    {isDirty ? (
                      <span className="h-2 w-2 rounded-full bg-foreground-muted group-hover:hidden" />
                    ) : null}
                    <X
                      className={`h-3 w-3 ${
                        isDirty ? 'hidden group-hover:block' : 'opacity-60 group-hover:opacity-100'
                      }`}
                    />
                  </button>
                </div>
              )
            })}
          </div>

          {/* Tab bar right controls: Split Editor & Actions */}
          <div className="flex items-center gap-1 px-2 shrink-0 bg-background-elevated">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleSplitEditor}
                  className={`p-1.5 rounded transition-colors ${
                    splitEditor
                      ? 'text-accent bg-accent/15'
                      : 'text-foreground-muted hover:text-foreground hover:bg-background-hover'
                  }`}
                  aria-label="Split Editor Right (⌘\)"
                >
                  <SplitSquareVertical className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Split Editor Right (⌘\)
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-1.5 rounded text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                  aria-label="More Editor Actions"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                More Actions
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Breadcrumb Bar (30px) */}
        <div className="h-[30px] px-4 bg-[#0E0E12] border-b border-border/50 flex items-center justify-between shrink-0 text-xs font-mono select-none">
          <div className="flex items-center gap-1.5 text-foreground-muted truncate">
            {breadcrumbSegments.map((segment, index) => (
              <React.Fragment key={index}>
                <span
                  onClick={() => {
                    const partial = breadcrumbSegments.slice(0, index + 1).join('/')
                    setActiveFile(partial)
                  }}
                  className={`cursor-pointer hover:text-accent transition-colors ${
                    index === breadcrumbSegments.length - 1
                      ? 'text-foreground font-medium'
                      : 'text-foreground-subtle'
                  }`}
                >
                  {segment}
                </span>
                {index < breadcrumbSegments.length - 1 && (
                  <ChevronRight className="h-3 w-3 text-foreground-subtle/50 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Active collaborator status badge */}
          {activeFileCollaborators.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-foreground-subtle hidden sm:inline">
                Collaborating with:
              </span>
              <div className="flex items-center gap-1">
                {activeFileCollaborators.map((c) => (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border shadow-xs"
                    style={{
                      backgroundColor: `${c.color}15`,
                      color: c.color,
                      borderColor: `${c.color}35`,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full animate-ping"
                      style={{ backgroundColor: c.color }}
                    />
                    {c.name.split(' ')[0]}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Monaco Editor Container */}
        <div className="flex-1 relative overflow-hidden flex">
          {/* Main Editor Pane */}
          <div className="flex-1 relative h-full">
            {activeNode ? (
              <Editor
                height="100%"
                path={activeNode.path}
                defaultLanguage={activeNode.language || 'typescript'}
                language={activeNode.language || 'typescript'}
                value={activeNode.content || ''}
                theme="collab-dark"
                onMount={handleEditorMount}
                onChange={(val) => updateFileContent(activeNode.path, val || '')}
                options={{
                  fontSize: 13.5,
                  fontFamily: '"JetBrains Mono", Menlo, Monaco, Consolas, monospace',
                  fontLigatures: true,
                  lineHeight: 21,
                  lineNumbers: 'on',
                  roundedSelection: true,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  renderWhitespace: 'selection',
                  minimap: {
                    enabled: true,
                    scale: 1,
                    renderCharacters: false,
                  },
                  bracketPairColorization: {
                    enabled: true,
                  },
                  guides: {
                    indentation: true,
                    bracketPairs: true,
                  },
                  folding: true,
                  tabSize: 2,
                  wordWrap: 'off',
                  padding: { top: 12, bottom: 12 },
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-foreground-subtle text-xs">
                No file open
              </div>
            )}

            {/* Remote Collaborator Cursors & Selections Overlay */}
            {activeFileCollaborators.map((c) => {
              if (!c.cursor) return null
              // Approximate visual coordinates for line height 21px and mono character width ~8.2px + 62px gutter
              const topOffset = (c.cursor.lineNumber - 1) * 21 + 12
              const leftOffset = 62 + c.cursor.column * 8.2

              return (
                <div
                  key={c.id}
                  className="pointer-events-none absolute transition-all duration-300 ease-out z-10"
                  style={{
                    top: `${topOffset}px`,
                    left: `${leftOffset}px`,
                  }}
                >
                  {/* Selection highlight if active */}
                  {c.selection && (
                    <div
                      className="absolute rounded-xs pointer-events-none"
                      style={{
                        top: 0,
                        left: `${(c.selection.startColumn - c.cursor.column) * 8.2}px`,
                        width: `${Math.abs(c.selection.endColumn - c.selection.startColumn) * 8.2}px`,
                        height: '21px',
                        backgroundColor: `${c.color}25`,
                        border: `1px dashed ${c.color}80`,
                      }}
                    />
                  )}

                  {/* Vertical Caret */}
                  <div
                    className="w-0.5 h-[21px] shadow-sm animate-pulse"
                    style={{ backgroundColor: c.color }}
                  />

                  {/* Name Tag Pill */}
                  <div
                    className="absolute -top-4 left-0 px-1.5 py-0.2 rounded-xs text-[9px] font-semibold tracking-wide text-white shadow-md flex items-center gap-1 whitespace-nowrap"
                    style={{ backgroundColor: c.color }}
                  >
                    <span>{c.name.split(' ')[0]}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Split Editor Secondary Pane */}
          {splitEditor && (
            <div className="flex-1 relative h-full border-l border-border/80 flex flex-col">
              <div className="h-[30px] px-3 bg-[#0E0E12] border-b border-border/50 flex items-center justify-between text-xs font-mono">
                <span className="text-foreground-muted">{secondaryNode?.name || 'Split View'}</span>
                <span className="text-[10px] text-foreground-subtle font-sans">Read-Only Preview</span>
              </div>
              <div className="flex-1 relative">
                {secondaryNode && (
                  <Editor
                    height="100%"
                    path={`split-${secondaryNode.path}`}
                    defaultLanguage={secondaryNode.language || 'typescript'}
                    value={secondaryNode.content || ''}
                    theme="collab-dark"
                    options={{
                      readOnly: true,
                      fontSize: 13,
                      fontFamily: '"JetBrains Mono", monospace',
                      lineNumbers: 'on',
                      minimap: { enabled: false },
                      automaticLayout: true,
                      folding: true,
                      padding: { top: 12, bottom: 12 },
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
