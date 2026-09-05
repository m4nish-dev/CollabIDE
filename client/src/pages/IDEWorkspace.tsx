import { useState } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { useHotkeys } from 'react-hotkeys-hook'
import { useProjectStore } from '@/store/useProjectStore'
import { IDETopBar } from '@/components/ide/IDETopBar'
import { ActivityBar } from '@/components/ide/ActivityBar'
import { FileExplorer } from '@/components/ide/FileExplorer'
import { EditorArea } from '@/components/ide/EditorArea'
import { BottomPanel } from '@/components/ide/BottomPanel'
import { RightPanel } from '@/components/ide/RightPanel'
import { StatusBar } from '@/components/ide/StatusBar'
import { QuickOpenModal } from '@/components/ide/QuickOpenModal'
import { toast } from 'sonner'

export default function IDEWorkspace() {
  const {
    isSidebarOpen,
    isBottomPanelOpen,
    isRightPanelOpen,
    toggleSidebar,
    toggleBottomPanel,
    toggleSplitEditor,
    saveCurrentFile,
    activeFileId,
    closeTab,
  } = useProjectStore()

  // Quick Open / Command Palette state
  const [isQuickOpen, setIsQuickOpen] = useState(false)
  const [quickOpenMode, setQuickOpenMode] = useState<'files' | 'commands'>('files')

  // Bottom panel maximized state
  const [isBottomMaximized, setIsBottomMaximized] = useState(false)

  // ── Keyboard Shortcuts ─────────────────────────────────────────
  // ⌘S: Save file
  useHotkeys(
    'mod+s',
    (e) => {
      e.preventDefault()
      saveCurrentFile()
      toast.success('File saved')
    },
    { enableOnFormTags: true },
  )

  // ⌘P: Quick Open files
  useHotkeys(
    'mod+p',
    (e) => {
      e.preventDefault()
      setQuickOpenMode('files')
      setIsQuickOpen(true)
    },
    { enableOnFormTags: true },
  )

  // ⌘⇧P: Command Palette
  useHotkeys(
    'mod+shift+p',
    (e) => {
      e.preventDefault()
      setQuickOpenMode('commands')
      setIsQuickOpen(true)
    },
    { enableOnFormTags: true },
  )

  // ⌘B: Toggle sidebar
  useHotkeys(
    'mod+b',
    (e) => {
      e.preventDefault()
      toggleSidebar()
    },
    { enableOnFormTags: true },
  )

  // ⌘J: Toggle bottom panel
  useHotkeys(
    'mod+j',
    (e) => {
      e.preventDefault()
      toggleBottomPanel()
    },
    { enableOnFormTags: true },
  )

  // ⌘\: Split editor
  useHotkeys(
    'mod+\\',
    (e) => {
      e.preventDefault()
      toggleSplitEditor()
    },
    { enableOnFormTags: true },
  )

  // ⌘W: Close active tab
  useHotkeys(
    'mod+w',
    (e) => {
      e.preventDefault()
      if (activeFileId) {
        closeTab(activeFileId)
      }
    },
    { enableOnFormTags: true },
  )

  return (
    <div className="h-screen w-screen bg-[#0A0A0B] text-foreground flex flex-col overflow-hidden select-none font-sans">
      {/* Top Bar (44px) */}
      <IDETopBar />

      {/* Main Workspace Center Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Activity Bar (48px leftmost strip) */}
        <ActivityBar />

        {/* Resizable Horizontal Panels */}
        <div className="flex-1 h-full overflow-hidden">
          <Group orientation="horizontal" className="h-full w-full">
            {/* Left Sidebar: File Explorer (240px, resizable 180-400px) */}
            {isSidebarOpen && (
              <>
                <Panel
                  id="explorer-panel"
                  defaultSize="240px"
                  minSize="180px"
                  maxSize="420px"
                  className="h-full overflow-hidden"
                >
                  <FileExplorer />
                </Panel>
                <Separator className="w-1 bg-border/60 hover:bg-accent/70 active:bg-accent transition-colors cursor-col-resize z-10" />
              </>
            )}

            {/* Center Area: Editor + Bottom Panel */}
            <Panel id="center-panel" minSize="300px" className="h-full overflow-hidden">
              <Group orientation="vertical" className="h-full w-full">
                {/* Editor Area */}
                {!isBottomMaximized && (
                  <Panel id="editor-panel" minSize="140px" className="h-full overflow-hidden">
                    <EditorArea />
                  </Panel>
                )}

                {/* Bottom Panel (240px, resizable 100-500px) */}
                {isBottomPanelOpen && (
                  <>
                    {!isBottomMaximized && (
                      <Separator className="h-1 bg-border/60 hover:bg-accent/70 active:bg-accent transition-colors cursor-row-resize z-10" />
                    )}
                    <Panel
                      id="bottom-panel"
                      defaultSize={isBottomMaximized ? '100%' : '240px'}
                      minSize="100px"
                      maxSize="500px"
                      className="h-full overflow-hidden"
                    >
                      <BottomPanel
                        isMaximized={isBottomMaximized}
                        onToggleMaximize={() => setIsBottomMaximized(!isBottomMaximized)}
                      />
                    </Panel>
                  </>
                )}
              </Group>
            </Panel>

            {/* Optional Right Panel (Preview / Collaborators / Activity / Comments) */}
            {isRightPanelOpen && (
              <>
                <Separator className="w-1 bg-border/60 hover:bg-accent/70 active:bg-accent transition-colors cursor-col-resize z-10" />
                <Panel
                  id="right-panel"
                  defaultSize="320px"
                  minSize="260px"
                  maxSize="480px"
                  className="h-full overflow-hidden"
                >
                  <RightPanel />
                </Panel>
              </>
            )}
          </Group>
        </div>
      </div>

      {/* Status Bar (22px) */}
      <StatusBar />

      {/* Quick Open & Command Palette Modal */}
      <QuickOpenModal
        isOpen={isQuickOpen}
        onClose={() => setIsQuickOpen(false)}
        mode={quickOpenMode}
      />
    </div>
  )
}
