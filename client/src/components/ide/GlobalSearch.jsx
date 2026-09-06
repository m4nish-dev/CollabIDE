import React, { useEffect, useState, useMemo } from "react";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Code, FileCode, FileSpreadsheet, FileText, Layers, Terminal, Settings, User, Box } from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { toast } from "@/lib/toast";
import { useNavigate } from "react-router-dom";

function getAllFiles(nodes) {
  const result = [];
  for (const node of nodes) {
    if (node.type === "file") {
      result.push(node);
    }
    if (node.children) {
      result.push(...getAllFiles(node.children));
    }
  }
  return result;
}

function getFileIcon(filename) {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  switch (ext) {
    case "tsx":
    case "jsx":
      return <FileCode className="h-4 w-4 text-sky-400 shrink-0" />;
    case "ts":
    case "js":
      return <Code className="h-4 w-4 text-yellow-400 shrink-0" />;
    case "css":
      return <FileSpreadsheet className="h-4 w-4 text-pink-400 shrink-0" />;
    case "json":
      return <FileText className="h-4 w-4 text-amber-400 shrink-0" />;
    case "md":
      return <FileText className="h-4 w-4 text-neutral-400 shrink-0" />;
    case "svg":
      return <Layers className="h-4 w-4 text-purple-400 shrink-0" />;
    default:
      return <FileText className="h-4 w-4 text-foreground-subtle shrink-0" />;
  }
}

export const GlobalSearch = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    files,
    setActiveFile,
    toggleSidebar,
    toggleBottomPanel,
    toggleRightPanel,
  } = useProjectStore();

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if (e.key === "Escape" && isGlobalSearchOpen) {
        setIsGlobalSearchOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

  const allFiles = useMemo(() => getAllFiles(files), [files]);

  const commands = [
    { id: 'cmd-sidebar', label: 'Toggle Sidebar', icon: Settings, action: () => toggleSidebar() },
    { id: 'cmd-terminal', label: 'Toggle Terminal', icon: Terminal, action: () => toggleBottomPanel() },
    { id: 'cmd-preview', label: 'Toggle Preview', icon: Box, action: () => toggleRightPanel() },
  ];

  const projects = [
    { id: 'proj-1', label: 'collab-dashboard', icon: Box, action: () => { setIsGlobalSearchOpen(false); navigate('/dashboard'); } },
    { id: 'proj-2', label: 'api-service', icon: Box, action: () => { setIsGlobalSearchOpen(false); navigate('/dashboard'); } },
  ];

  const members = [
    { id: 'mem-1', label: 'Rohit Sharma', icon: User, action: () => toast.info('Opened member profile') },
    { id: 'mem-2', label: 'Priya Patel', icon: User, action: () => toast.info('Opened member profile') },
  ];

  return (
    <AnimatePresence>
      {isGlobalSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-background/40 backdrop-blur-sm"
            onClick={() => setIsGlobalSearchOpen(false)}
          />

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
                  setIsGlobalSearchOpen(false);
                }
              }}
            >
              <div className="flex items-center border-b border-border px-3">
                <Search className="h-5 w-5 text-foreground-subtle shrink-0 mr-2" />
                <Command.Input
                  autoFocus
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search files, projects, commands, or members..."
                  className="flex h-14 w-full bg-transparent outline-none placeholder:text-foreground-subtle text-foreground text-sm"
                />
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background border border-border text-foreground-subtle shrink-0">
                  ESC
                </span>
              </div>

              <Command.List className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                <Command.Empty className="py-6 text-center text-sm text-foreground-subtle">
                  No results found for "{search}".
                </Command.Empty>

                {search.length === 0 && (
                  <div className="py-6 text-center text-sm text-foreground-subtle">
                    Try searching for a file, project, or command.
                  </div>
                )}

                {(search.length > 0) && (
                  <>
                    <Command.Group heading="FILES" className="text-xs font-semibold text-foreground-muted px-2 py-2">
                      {allFiles.map((file) => (
                        <Command.Item
                          key={file.path}
                          value={`file ${file.name} ${file.path}`}
                          onSelect={() => { setActiveFile(file.path); setIsGlobalSearchOpen(false); setSearch(""); }}
                          className="group flex items-center gap-3 px-3 py-2.5 mt-1 cursor-pointer rounded-md text-sm text-foreground-muted aria-selected:bg-accent/15 aria-selected:text-foreground aria-selected:border-l-2 aria-selected:border-l-accent border-l-2 border-l-transparent transition-all"
                        >
                          {getFileIcon(file.name)}
                          <span className="text-foreground">{file.name}</span>
                          <span className="text-[11px] text-foreground-subtle truncate ml-auto">{file.path}</span>
                        </Command.Item>
                      ))}
                    </Command.Group>

                    <Command.Group heading="COMMANDS" className="text-xs font-semibold text-foreground-muted px-2 py-2">
                      {commands.map((cmd) => (
                        <Command.Item
                          key={cmd.id}
                          value={`cmd ${cmd.label}`}
                          onSelect={() => { cmd.action(); setIsGlobalSearchOpen(false); setSearch(""); }}
                          className="group flex items-center gap-3 px-3 py-2.5 mt-1 cursor-pointer rounded-md text-sm text-foreground-muted aria-selected:bg-accent/15 aria-selected:text-foreground aria-selected:border-l-2 aria-selected:border-l-accent border-l-2 border-l-transparent transition-all"
                        >
                          <cmd.icon className="h-4 w-4 group-aria-selected:text-accent" />
                          <span className="text-foreground">{cmd.label}</span>
                        </Command.Item>
                      ))}
                    </Command.Group>

                    <Command.Group heading="PROJECTS" className="text-xs font-semibold text-foreground-muted px-2 py-2">
                      {projects.map((proj) => (
                        <Command.Item
                          key={proj.id}
                          value={`proj ${proj.label}`}
                          onSelect={() => { proj.action(); setIsGlobalSearchOpen(false); setSearch(""); }}
                          className="group flex items-center gap-3 px-3 py-2.5 mt-1 cursor-pointer rounded-md text-sm text-foreground-muted aria-selected:bg-accent/15 aria-selected:text-foreground aria-selected:border-l-2 aria-selected:border-l-accent border-l-2 border-l-transparent transition-all"
                        >
                          <proj.icon className="h-4 w-4 group-aria-selected:text-accent" />
                          <span className="text-foreground">{proj.label}</span>
                        </Command.Item>
                      ))}
                    </Command.Group>

                    <Command.Group heading="MEMBERS" className="text-xs font-semibold text-foreground-muted px-2 py-2">
                      {members.map((mem) => (
                        <Command.Item
                          key={mem.id}
                          value={`mem ${mem.label}`}
                          onSelect={() => { mem.action(); setIsGlobalSearchOpen(false); setSearch(""); }}
                          className="group flex items-center gap-3 px-3 py-2.5 mt-1 cursor-pointer rounded-md text-sm text-foreground-muted aria-selected:bg-accent/15 aria-selected:text-foreground aria-selected:border-l-2 aria-selected:border-l-accent border-l-2 border-l-transparent transition-all"
                        >
                          <mem.icon className="h-4 w-4 group-aria-selected:text-accent" />
                          <span className="text-foreground">{mem.label}</span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  </>
                )}
              </Command.List>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
