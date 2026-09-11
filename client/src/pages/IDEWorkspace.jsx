import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { EditorSkeleton } from "@/components/shared/EditorSkeleton";
import { FileExplorerSkeleton } from "@/components/shared/FileExplorerSkeleton";
import { Group, Panel, Separator } from "react-resizable-panels";
import { useHotkeys } from "react-hotkeys-hook";
import { useProjectStore } from "@/store/useProjectStore";
import { JoinNotification } from "@/components/features/collaboration/JoinNotification";
import { IDETopBar } from "@/components/ide/IDETopBar";
import { ActivityBar } from "@/components/ide/ActivityBar";
import { FileExplorer } from "@/components/ide/FileExplorer";
import { SourceControlPanel } from "@/components/features/sourceControl/SourceControlPanel";
import { CommitHistoryPanel } from "@/components/features/sourceControl/CommitHistoryPanel";
import { EditorArea } from "@/components/ide/EditorArea";
import { BottomPanel } from "@/components/ide/BottomPanel";
import { RightPanel } from "@/components/ide/RightPanel";
import { StatusBar } from "@/components/ide/StatusBar";
import { CommandPalette } from "@/components/ide/CommandPalette";
import { QuickOpen } from "@/components/ide/QuickOpen";
import { GlobalSearch } from "@/components/ide/GlobalSearch";
import { FindInFiles } from "@/components/ide/FindInFiles";
import { toast } from "@/lib/toast";
import { MobileNotice } from "@/components/shared/MobileNotice";
import { getSocket, joinProject, leaveProject, openFile, onPresence, onFileOpen, onCursor, onEdit } from "@/lib/socket";
import { useCollaborationStore } from "@/store/useCollaborationStore";

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

  const {
    collaborators,
    addCollaborator,
    removeCollaborator,
    updateCollaboratorStatus,
    updateCollaboratorFile,
    updateCollaboratorCursor,
    updateCollaboratorSelection,
    addJoinNotification,
  } = useCollaborationStore();

  // Bottom panel maximized state
  const [isBottomMaximized, setIsBottomMaximized] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  // Socket connection
  useEffect(() => {
    if (!id) return;
    const socket = getSocket();

    const handleConnect = () => {
      joinProject(id);
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.on("connect", handleConnect);
    }

    const unsubPresence = onPresence((data) => {
      const { action, id: userId, name, avatar, role } = data;
      if (action === "join") {
        const exists = useCollaborationStore.getState().collaborators.find((c) => c.id === userId);
        if (!exists) {
          addCollaborator({
            id: userId,
            name,
            avatar,
            role,
            status: "online",
            currentFile: null,
            cursorPosition: null,
            selection: null,
          });
          addJoinNotification(`${name} joined the project`, avatar);
        } else {
          updateCollaboratorStatus(userId, "online");
        }
      } else if (action === "leave") {
        removeCollaborator(userId);
      }
    });

    const unsubFileOpen = onFileOpen((data) => {
      updateCollaboratorFile(data.id, data.filePath);
    });

    const unsubCursor = onCursor((data) => {
      updateCollaboratorCursor(data.userId, data.position);
    });

    const unsubEdit = onEdit((data) => {
      // It's a remote edit, update the file content
      useProjectStore.getState().updateFileContent(data.filePath, data.patch, true);
    });

    return () => {
      socket.off("connect", handleConnect);
      leaveProject(id);
      unsubPresence();
      unsubFileOpen();
      unsubCursor();
      unsubEdit();
    };
  }, [id, addCollaborator, removeCollaborator, updateCollaboratorStatus, updateCollaboratorFile, updateCollaboratorCursor, addJoinNotification]);

  // Open active file in socket room
  useEffect(() => {
    if (id && activeFileId) {
      openFile(id, activeFileId);
    }
  }, [id, activeFileId]);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    Promise.all([
      api.projects.get(id),
      api.files.tree(id)
    ])
      .then(() => {
        if (mounted) {
          setIsLoading(false);
          const fileParam = searchParams.get("file");
          if (fileParam) {
            useProjectStore.getState().openTab(fileParam);
          }
        }
      })
      .catch((err) => {
        if (mounted) {
          if (err.status === 404 || err.message === "Not found") {
            navigate("/project-not-found");
          } else {
            console.error(err);
            setIsLoading(false); // Maybe show an error boundary inside the IDE, but for now just stop loading
          }
        }
      });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  useEffect(() => {
    if (activeFileId) {
      setSearchParams({ file: activeFileId }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [activeFileId, setSearchParams]);

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
    <>
      <div className="md:hidden flex h-screen w-screen items-center justify-center bg-background">
        <MobileNotice />
      </div>
      <div className="hidden md:flex h-screen w-screen bg-background text-foreground flex-col overflow-hidden select-none font-sans">
        {/* Top Bar (44px) */}
        <IDETopBar />

        {/* Main Workspace Area */}
        <main id="main-content" className="flex-1 flex overflow-hidden">
        {/* Left Sidebars: Activity + Primary Panel */}
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
                  {isLoading ? (
                    <FileExplorerSkeleton />
                  ) : activeActivity === "explorer" ? (
                    <FileExplorer />
                  ) : activeActivity === "search" ? (
                    <FindInFiles />
                  ) : activeActivity === "git" ? (
                    <SourceControlPanel />
                  ) : null}
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
                    {isLoading ? <EditorSkeleton /> : <EditorArea />}
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
      </main>

      {/* Status Bar (22px) */}
      <StatusBar />

      {/* Modals & Notifications */}
      {/* Floating Modals and Dialogs */}
      <CommandPalette />
      <QuickOpen />
      <GlobalSearch />
      <JoinNotification />
      <CommitHistoryPanel />
    </div>
    </>
  );
}
