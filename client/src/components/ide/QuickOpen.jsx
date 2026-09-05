import React, { useEffect, useState, useMemo } from "react";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Code, FileCode, FileSpreadsheet, FileText, Layers } from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";

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

export const QuickOpen = () => {
  const {
    isQuickOpenOpen,
    setIsQuickOpenOpen,
    files,
    openTabIds,
    setActiveFile,
  } = useProjectStore();

  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e) => {
      if (e.key === "Escape" && isQuickOpenOpen) {
        setIsQuickOpenOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isQuickOpenOpen, setIsQuickOpenOpen]);

  const allFiles = useMemo(() => getAllFiles(files), [files]);
  
  // Recent files based on openTabIds
  const recentFiles = useMemo(() => {
    return allFiles.filter(f => openTabIds.includes(f.path));
  }, [allFiles, openTabIds]);

  const runCommand = (path) => {
    setActiveFile(path);
    setIsQuickOpenOpen(false);
    setSearch("");
  };

  return (
    <AnimatePresence>
      {isQuickOpenOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-background/40 backdrop-blur-sm"
            onClick={() => setIsQuickOpenOpen(false)}
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
                  setIsQuickOpenOpen(false);
                }
              }}
            >
              <div className="flex items-center border-b border-border px-3">
                <Search className="h-5 w-5 text-foreground-subtle shrink-0 mr-2" />
                <Command.Input
                  autoFocus
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search files by name..."
                  className="flex h-14 w-full bg-transparent outline-none placeholder:text-foreground-subtle text-foreground text-sm"
                />
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background border border-border text-foreground-subtle shrink-0">
                  ESC
                </span>
              </div>

              <Command.List className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                <Command.Empty className="py-6 text-center text-sm text-foreground-subtle">
                  No files found matching "{search}".
                </Command.Empty>

                {search.length === 0 && recentFiles.length > 0 && (
                  <Command.Group heading="RECENT" className="text-xs font-semibold text-foreground-muted px-2 py-2">
                    {recentFiles.map((file) => (
                      <Command.Item
                        key={file.path}
                        value={file.path}
                        onSelect={() => runCommand(file.path)}
                        className="group flex items-center gap-3 px-3 py-2.5 mt-1 cursor-pointer rounded-md text-sm text-foreground-muted aria-selected:bg-accent/15 aria-selected:text-foreground aria-selected:border-l-2 aria-selected:border-l-accent border-l-2 border-l-transparent transition-all"
                      >
                        {getFileIcon(file.name)}
                        <span className="text-foreground">{file.name}</span>
                        <span className="text-[11px] text-foreground-subtle truncate ml-auto">{file.path}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {(search.length > 0 || recentFiles.length === 0) && (
                  <Command.Group heading="FILES" className="text-xs font-semibold text-foreground-muted px-2 py-2">
                    {allFiles.map((file) => (
                      <Command.Item
                        key={file.path}
                        value={file.path}
                        onSelect={() => runCommand(file.path)}
                        className="group flex items-center gap-3 px-3 py-2.5 mt-1 cursor-pointer rounded-md text-sm text-foreground-muted aria-selected:bg-accent/15 aria-selected:text-foreground aria-selected:border-l-2 aria-selected:border-l-accent border-l-2 border-l-transparent transition-all"
                      >
                        {getFileIcon(file.name)}
                        <span className="text-foreground">{file.name}</span>
                        <span className="text-[11px] text-foreground-subtle truncate ml-auto">{file.path}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}
              </Command.List>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
