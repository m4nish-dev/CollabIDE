import { useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { useHotkeys } from "react-hotkeys-hook";
import { useProjectStore } from "@/store/useProjectStore";
import { IDETopBar } from "@/components/ide/IDETopBar";
import { ActivityBar } from "@/components/ide/ActivityBar";
import { FileExplorer } from "@/components/ide/FileExplorer";
import { EditorArea } from "@/components/ide/EditorArea";
import { BottomPanel } from "@/components/ide/BottomPanel";
import { RightPanel } from "@/components/ide/RightPanel";
import { StatusBar } from "@/components/ide/StatusBar";
import { CommandPalette } from "@/components/ide/CommandPalette";
import { QuickOpen } from "@/components/ide/QuickOpen";
import { GlobalSearch } from "@/components/ide/GlobalSearch";
import { FindInFiles } from "@/components/ide/FindInFiles";
import { toast } from "sonner";

export default function IDEWorkspace() {
  const {
    isSidebarOpen,
    isBottomPanelOpen,
    isRightPanelOpen,
    activeActivity,
    setActiveActivity,
    toggleSidebar,
    toggleBottomPanel,
    toggleSplitEditor,
    saveCurrentFile,
    activeFileId,
    closeTab,
    setIsQuickOpenOpen,
    setIsCommandPaletteOpen,
    setIsGlobalSearchOpen,
  } = useProjectStore();

  // Bottom panel maximized state
  const [isBottomMaximized, setIsBottomMaximized] = useState(false);

  // ── Keyboard Shortcuts ─────────────────────────────────────────
  // ⌘S: Save file
  useHotkeys(
    "mod+s",
    (e) => {
      e.preventDefault();
      saveCurrentFile();
      toast.success("File saved");
    },
    { enableOnFormTags: true },
  );

  // ⌘P: Quick Open files
  useHotkeys(
    "mod+p",
    (e) => {
      e.preventDefault();
      setIsQuickOpenOpen(true);
    },
    { enableOnFormTags: true },
  );

  // ⌘⇧P: Command Palette
  useHotkeys(
    "mod+shift+p",
    (e) => {
      e.preventDefault();
      setIsCommandPaletteOpen(true);
    },
    { enableOnFormTags: true },
  );

  // ⌘K: Global Search
  useHotkeys(
    "mod+k",
    (e) => {
      e.preventDefault();
      setIsGlobalSearchOpen(true);
    },
    { enableOnFormTags: true },
  );

  // ⌘⇧F: Search (Find in files)
  useHotkeys(
    "mod+shift+f",
    (e) => {
      e.preventDefault();
      setActiveActivity("search");
    },
    { enableOnFormTags: true },
  );

  // ⌘B: Toggle sidebar
  useHotkeys(
    "mod+b",
    (e) => {
      e.preventDefault();
      toggleSidebar();
    },
    { enableOnFormTags: true },
  );

  // ⌘J: Toggle bottom panel
  useHotkeys(
    "mod+j",
    (e) => {
      e.preventDefault();
      toggleBottomPanel();
    },
    { enableOnFormTags: true },
  );

  // ⌘\: Split editor
  useHotkeys(
    "mod+\\",
    (e) => {
      e.preventDefault();
      toggleSplitEditor();
    },
    { enableOnFormTags: true },
  );

  // ⌘W: Close active tab
  useHotkeys(
    "mod+w",
    (e) => {
      e.preventDefault();
      if (activeFileId) {
        closeTab(activeFileId);
      }
    },
    { enableOnFormTags: true },
  );

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
            {/* Left Sidebar (240px, resizable 180-400px) */}
            {isSidebarOpen && (
              <>
                <Panel
                  id="explorer-panel"
                  defaultSize={240}
                  minSize={15}
                  maxSize={40}
                  className="h-full overflow-hidden flex flex-col"
                >
                  {activeActivity === "explorer" && <FileExplorer />}
                  {activeActivity === "search" && <FindInFiles />}
                </Panel>
                <Separator className="w-1 bg-border/60 hover:bg-accent/70 active:bg-accent transition-colors cursor-col-resize z-10" />
              </>
            )}

            {/* Center Area: Editor + Bottom Panel */}
            <Panel
              id="center-panel"
              minSize={30}
              className="h-full overflow-hidden"
            >
              <Group orientation="vertical" className="h-full w-full">
                {/* Editor Area */}
                {!isBottomMaximized && (
                  <Panel
                    id="editor-panel"
                    minSize={20}
                    className="h-full overflow-hidden"
                  >
                    <EditorArea />
                  </Panel>
                )}

                {/* Bottom Panel */}
                {isBottomPanelOpen && (
                  <>
                    {!isBottomMaximized && (
                      <Separator className="h-1 bg-border/60 hover:bg-accent/70 active:bg-accent transition-colors cursor-row-resize z-10" />
                    )}
                    <Panel
                      id="bottom-panel"
                      defaultSize={isBottomMaximized ? 100 : 30}
                      minSize={10}
                      maxSize={80}
                      className="h-full overflow-hidden"
                    >
                      <BottomPanel
                        isMaximized={isBottomMaximized}
                        onToggleMaximize={() =>
                          setIsBottomMaximized(!isBottomMaximized)
                        }
                      />
                    </Panel>
                  </>
                )}
              </Group>
            </Panel>

            {/* Optional Right Panel */}
            {isRightPanelOpen && (
              <>
                <Separator className="w-1 bg-border/60 hover:bg-accent/70 active:bg-accent transition-colors cursor-col-resize z-10" />
                <Panel
                  id="right-panel"
                  defaultSize={25}
                  minSize={15}
                  maxSize={40}
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

      {/* Modals */}
      <CommandPalette />
      <QuickOpen />
      <GlobalSearch />
    </div>
  );
}
