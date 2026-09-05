import React, { useEffect } from "react";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import {
  FilePlus,
  FolderPlus,
  Save,
  Search,
  Replace,
  Settings,
  Terminal,
  PanelRightClose,
  Play,
  Square,
  RefreshCcw,
  GitBranch,
  GitCommit,
  ArrowUpCircle,
  ArrowDownCircle,
  UserPlus,
  Link,
  Share2,
  Palette,
  Keyboard,
  LayoutDashboard,
  LogOut,
  Files,
} from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const CommandPalette = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    toggleSidebar,
    toggleBottomPanel,
    toggleRightPanel,
    toggleRun,
    saveCurrentFile,
    setIsShareModalOpen,
  } = useProjectStore();

  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if (e.key === "Escape" && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  const runCommand = (action) => {
    action();
    setIsCommandPaletteOpen(false);
  };

  const groups = [
    {
      heading: "File",
      items: [
        { icon: FilePlus, label: "New File", shortcut: "⌘N", action: () => toast.info("New file") },
        { icon: FolderPlus, label: "New Folder", shortcut: "⇧⌘N", action: () => toast.info("New folder") },
        { icon: Save, label: "Save", shortcut: "⌘S", action: () => { saveCurrentFile(); toast.success("File saved"); } },
        { icon: Save, label: "Save All", shortcut: "⌥⌘S", action: () => toast.success("All files saved") },
      ]
    },
    {
      heading: "Edit",
      items: [
        { icon: Search, label: "Find", shortcut: "⌘F", action: () => toast.info("Find in file") },
        { icon: Replace, label: "Replace", shortcut: "⌥⌘F", action: () => toast.info("Replace in file") },
        { icon: Files, label: "Find in Files", shortcut: "⇧⌘F", action: () => toast.info("Find in files") },
      ]
    },
    {
      heading: "View",
      items: [
        { icon: Settings, label: "Toggle Sidebar", shortcut: "⌘B", action: () => toggleSidebar() },
        { icon: Terminal, label: "Toggle Terminal", shortcut: "⌘J", action: () => toggleBottomPanel() },
        { icon: PanelRightClose, label: "Toggle Preview", shortcut: "⌘⇧P", action: () => toggleRightPanel() },
      ]
    },
    {
      heading: "Run",
      items: [
        { icon: Play, label: "Run Project", shortcut: "F5", action: () => toggleRun() },
        { icon: Square, label: "Stop Project", shortcut: "⇧F5", action: () => toggleRun() },
        { icon: RefreshCcw, label: "Restart", shortcut: "⇧⌘R", action: () => toast.success("Server restarted") },
      ]
    },
    {
      heading: "Git",
      items: [
        { icon: GitBranch, label: "Create Branch", shortcut: "", action: () => toast.info("Branch created") },
        { icon: GitBranch, label: "Switch Branch", shortcut: "", action: () => toast.info("Switching branch") },
        { icon: GitCommit, label: "Commit Changes", shortcut: "⌘K", action: () => toast.info("Commit panel") },
        { icon: ArrowUpCircle, label: "Push", shortcut: "⇧⌘K", action: () => toast.info("Pushing changes") },
        { icon: ArrowDownCircle, label: "Pull", shortcut: "⇧⌘P", action: () => toast.info("Pulling changes") },
      ]
    },
    {
      heading: "Collaboration",
      items: [
        { icon: UserPlus, label: "Invite Teammate", shortcut: "", action: () => setIsShareModalOpen(true) },
        { icon: Link, label: "Copy Invite Link", shortcut: "", action: () => toast.success("Link copied to clipboard") },
        { icon: Share2, label: "Share Project", shortcut: "", action: () => setIsShareModalOpen(true) },
      ]
    },
    {
      heading: "Settings",
      items: [
        { icon: Settings, label: "Open Settings", shortcut: "⌘,", action: () => toast.info("Settings opened") },
        { icon: Palette, label: "Change Theme", shortcut: "⌘K ⌘T", action: () => toast.info("Theme picker") },
        { icon: Keyboard, label: "Keyboard Shortcuts", shortcut: "⌘K ⌘S", action: () => toast.info("Keyboard shortcuts") },
      ]
    },
    {
      heading: "Navigation",
      items: [
        { icon: LayoutDashboard, label: "Go to Dashboard", shortcut: "", action: () => navigate("/dashboard") },
        { icon: LogOut, label: "Sign out", shortcut: "", action: () => { navigate("/login"); toast.success("Signed out"); } },
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-background/40 backdrop-blur-sm"
            onClick={() => setIsCommandPaletteOpen(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-[640px] bg-background-elevated/95 backdrop-blur-xl border border-border shadow-2xl rounded-xl overflow-hidden flex flex-col"
          >
            <Command
              className="flex w-full flex-col overflow-hidden text-foreground"
              loop
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsCommandPaletteOpen(false);
                }
              }}
            >
              <div className="flex items-center border-b border-border px-3">
                <Search className="h-5 w-5 text-foreground-subtle shrink-0 mr-2" />
                <Command.Input
                  autoFocus
                  placeholder="Type a command or search..."
                  className="flex h-14 w-full bg-transparent outline-none placeholder:text-foreground-subtle text-foreground text-sm"
                />
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background border border-border text-foreground-subtle shrink-0">
                  ESC
                </span>
              </div>

              <Command.List className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                <Command.Empty className="py-6 text-center text-sm text-foreground-subtle">
                  No commands found.
                </Command.Empty>

                {groups.map((group) => (
                  <Command.Group 
                    key={group.heading} 
                    heading={group.heading}
                    className="text-xs font-semibold text-foreground-muted px-2 py-2"
                  >
                    {group.items.map((item) => (
                      <Command.Item
                        key={item.label}
                        onSelect={() => runCommand(item.action)}
                        className="group flex items-center justify-between px-3 py-2.5 mt-1 cursor-pointer rounded-md text-sm text-foreground-muted aria-selected:bg-accent/15 aria-selected:text-foreground aria-selected:border-l-2 aria-selected:border-l-accent border-l-2 border-l-transparent transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4 group-aria-selected:text-accent" />
                          <span>{item.label}</span>
                        </div>
                        {item.shortcut && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background/50 border border-border/50 text-foreground-subtle group-aria-selected:text-foreground/70">
                            {item.shortcut}
                          </span>
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
