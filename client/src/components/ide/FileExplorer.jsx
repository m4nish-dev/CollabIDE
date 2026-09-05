import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Code,
  Copy,
  Download,
  FileCode,
  FileEdit,
  FilePlus,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  Layers,
  MoreVertical,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { useProjectStore } from "@/store/useProjectStore";
import { PresenceIndicator } from "@/components/features/collaboration/PresenceIndicator";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

// Helper for color-coded file icons
function getFileIcon(filename) {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  switch (ext) {
    case "tsx":
      return <FileCode className="h-3.5 w-3.5 text-sky-400 shrink-0" />;
    case "ts":
      return <Code className="h-3.5 w-3.5 text-blue-400 shrink-0" />;
    case "jsx":
    case "js":
      return <FileCode className="h-3.5 w-3.5 text-yellow-400 shrink-0" />;
    case "css":
      return <FileSpreadsheet className="h-3.5 w-3.5 text-pink-400 shrink-0" />;
    case "json":
      return <FileText className="h-3.5 w-3.5 text-amber-400 shrink-0" />;
    case "md":
      return <FileText className="h-3.5 w-3.5 text-neutral-400 shrink-0" />;
    case "svg":
      return <Layers className="h-3.5 w-3.5 text-purple-400 shrink-0" />;
    default:
      return (
        <FileText className="h-3.5 w-3.5 text-foreground-subtle shrink-0" />
      );
  }
}

const TreeItem = ({
  node,
  depth,
  isExpanded,
  onToggleExpand,
  activeFileId,
  unsavedFileIds,
  collaborators,
  onSelectFile,
  onNewFileAt,
  onNewFolderAt,
  onRename,
  onDelete,
  onDuplicate,
}) => {
  const isSelected = activeFileId === node.path;
  const isDirty = unsavedFileIds.has(node.path);
  const isFolder = node.type === "folder";

  // Drag and drop wiring
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: node.path,
    data: { node },
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: node.path,
    data: { node },
    disabled: !isFolder,
  });

  // Check if any collaborator is editing this file
  const editors = collaborators.filter((c) => c.activeFile === node.path);

  const handleRowClick = (e) => {
    e.stopPropagation();
    if (isFolder) {
      onToggleExpand(node.path);
    } else {
      onSelectFile(node.path);
    }
  };

  const handleCopyPath = () => {
    navigator.clipboard.writeText(node.path);
    toast.success(`Copied path: ${node.path}`);
  };

  const handleDownload = () => {
    if (!node.content) return;
    const blob = new Blob([node.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = node.name;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${node.name}`);
  };

  return (
    <div ref={setDropRef} className={isOver ? "bg-accent/15 rounded" : ""}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            ref={setDragRef}
            {...attributes}
            {...listeners}
            onClick={handleRowClick}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            className={`relative group flex items-center justify-between pr-2 py-1 cursor-pointer text-xs transition-colors select-none ${
              isDragging ? "opacity-40" : ""
            } ${
              isSelected
                ? "bg-background-hover text-foreground font-medium"
                : "text-foreground-muted hover:bg-background-hover/70 hover:text-foreground"
            }`}
          >
            {/* Left border indicator for selected file */}
            {isSelected && (
              <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent rounded-r" />
            )}

            {/* Depth line guides */}
            {depth > 0 && (
              <span
                className="absolute top-0 bottom-0 w-px bg-border/40 pointer-events-none"
                style={{ left: `${depth * 12}px` }}
              />
            )}

            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              {isFolder ? (
                <span className="text-foreground-subtle hover:text-foreground">
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3 shrink-0" />
                  ) : (
                    <ChevronRight className="h-3 w-3 shrink-0" />
                  )}
                </span>
              ) : (
                <span className="w-3 shrink-0" />
              )}

              {isFolder ? (
                isExpanded ? (
                  <FolderOpen className="h-3.5 w-3.5 text-accent shrink-0" />
                ) : (
                  <Folder className="h-3.5 w-3.5 text-accent/80 shrink-0" />
                )
              ) : (
                getFileIcon(node.name)
              )}

              <span className="truncate">{node.name}</span>
            </div>

            {/* Right indicators: Unsaved dot / Remote user dots */}
            <div className="flex items-center gap-1 shrink-0 ml-1">
              {/* Remote editors avatars/dots */}
              {editors.map((ed) => (
                <Tooltip key={ed.id}>
                  <TooltipTrigger asChild>
                    <span
                      className="h-2 w-2 rounded-full border border-background animate-pulse"
                      style={{ backgroundColor: ed.color }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-[10px] p-1">
                    {ed.name} is editing
                  </TooltipContent>
                </Tooltip>
              ))}

              {/* Dirty / unsaved dot */}
              {isDirty && (
                <span
                  className="h-1.5 w-1.5 rounded-full bg-accent"
                  title="Unsaved changes"
                />
              )}
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-48 bg-background-elevated border-border text-foreground">
          {isFolder ? (
            <>
              <ContextMenuItem
                onClick={() => onNewFileAt(node.path)}
                className="text-xs cursor-pointer focus:bg-background-hover focus:text-accent"
              >
                <FilePlus className="h-3.5 w-3.5 mr-2 text-foreground-subtle" />
                New File...
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => onNewFolderAt(node.path)}
                className="text-xs cursor-pointer focus:bg-background-hover focus:text-accent"
              >
                <FolderPlus className="h-3.5 w-3.5 mr-2 text-foreground-subtle" />
                New Folder...
              </ContextMenuItem>
              <ContextMenuSeparator className="bg-border" />
            </>
          ) : null}

          <ContextMenuItem
            onClick={() => onRename(node.path, node.name)}
            className="text-xs cursor-pointer focus:bg-background-hover focus:text-accent"
          >
            <FileEdit className="h-3.5 w-3.5 mr-2 text-foreground-subtle" />
            Rename
          </ContextMenuItem>

          {!isFolder && (
            <ContextMenuItem
              onClick={() => onDuplicate(node)}
              className="text-xs cursor-pointer focus:bg-background-hover focus:text-accent"
            >
              <Copy className="h-3.5 w-3.5 mr-2 text-foreground-subtle" />
              Duplicate
            </ContextMenuItem>
          )}

          <ContextMenuItem
            onClick={handleCopyPath}
            className="text-xs cursor-pointer focus:bg-background-hover focus:text-accent"
          >
            <Copy className="h-3.5 w-3.5 mr-2 text-foreground-subtle" />
            Copy Path
          </ContextMenuItem>

          {!isFolder && (
            <ContextMenuItem
              onClick={handleDownload}
              className="text-xs cursor-pointer focus:bg-background-hover focus:text-accent"
            >
              <Download className="h-3.5 w-3.5 mr-2 text-foreground-subtle" />
              Download
            </ContextMenuItem>
          )}

          <ContextMenuSeparator className="bg-border" />
          <ContextMenuItem
            onClick={() => onDelete(node.path)}
            className="text-xs text-danger focus:bg-danger/10 focus:text-danger cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5 mr-2 text-danger" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export const FileExplorer = () => {
  const {
    projectName,
    files,
    activeFileId,
    openTab,
    unsavedFileIds,
    collaborators,
    createFile,
    createFolder,
    deleteNode,
    renameNode,
    moveNode,
  } = useProjectStore();

  // Track expanded directories (initially src and components expanded)
  const [expandedPaths, setExpandedPaths] = useState(
    new Set(["root-project", "src", "src/components", "src/pages"]),
  );
  const [isOutlineOpen, setIsOutlineOpen] = useState(true);

  // State for creating new file/folder inline
  const [isCreatingFile, setIsCreatingFile] = useState(null); // parentPath or null
  const [isCreatingFolder, setIsCreatingFolder] = useState(null);
  const [inlineInputName, setInlineInputName] = useState("");

  // State for inline renaming
  const [renamingPath, setRenamingPath] = useState(null);
  const [renamingValue, setRenamingValue] = useState("");

  const toggleExpand = (path) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleCollapseAll = () => {
    setExpandedPaths(new Set(["root-project"]));
    toast.info("Collapsed all folders");
  };

  const handleRefresh = () => {
    toast.success("File tree synchronized");
  };

  const handleNewFileSubmit = (parentPath) => {
    const trimmed = inlineInputName.trim();
    if (trimmed) {
      createFile(parentPath === "root-project" ? "" : parentPath, trimmed);
      toast.success(`Created file ${trimmed}`);
    }
    setIsCreatingFile(null);
    setInlineInputName("");
  };

  const handleNewFolderSubmit = (parentPath) => {
    const trimmed = inlineInputName.trim();
    if (trimmed) {
      createFolder(parentPath === "root-project" ? "" : parentPath, trimmed);
      setExpandedPaths(
        (prev) =>
          new Set([...prev, parentPath ? `${parentPath}/${trimmed}` : trimmed]),
      );
      toast.success(`Created folder ${trimmed}`);
    }
    setIsCreatingFolder(null);
    setInlineInputName("");
  };

  const handleRenameSubmit = (path) => {
    const trimmed = renamingValue.trim();
    if (trimmed) {
      renameNode(path, trimmed);
      toast.success(`Renamed to ${trimmed}`);
    }
    setRenamingPath(null);
  };

  const handleDuplicate = (node) => {
    const ext = node.name.includes(".") ? node.name.split(".").pop() : "";
    const base = node.name.includes(".")
      ? node.name.substring(0, node.name.lastIndexOf("."))
      : node.name;
    const duplicateName = ext ? `${base}.copy.${ext}` : `${base}-copy`;
    const parent = node.path.includes("/")
      ? node.path.substring(0, node.path.lastIndexOf("/"))
      : "";
    createFile(parent, duplicateName);
    toast.success(`Duplicated ${node.name}`);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const sourcePath = String(active.id);
    const targetPath = String(over.id);

    moveNode(sourcePath, targetPath);
    toast.success(
      `Moved ${sourcePath.split("/").pop()} to ${targetPath.split("/").pop()}`,
    );
  };

  // Recursive tree renderer
  const renderTree = (nodes, depth = 0) => {
    return nodes.map((node) => {
      const isExpanded = expandedPaths.has(node.path);

      return (
        <React.Fragment key={node.path}>
          {renamingPath === node.path ? (
            <div
              style={{ paddingLeft: `${depth * 12 + 20}px` }}
              className="py-0.5 pr-2 flex items-center gap-1.5"
            >
              <input
                autoFocus
                value={renamingValue}
                onChange={(e) => setRenamingValue(e.target.value)}
                onBlur={() => handleRenameSubmit(node.path)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameSubmit(node.path);
                  if (e.key === "Escape") setRenamingPath(null);
                }}
                className="w-full text-xs bg-background border border-accent rounded px-1.5 py-0.5 text-foreground focus:outline-none"
              />
            </div>
          ) : (
            <TreeItem
              node={node}
              depth={depth}
              isExpanded={isExpanded}
              onToggleExpand={toggleExpand}
              activeFileId={activeFileId}
              unsavedFileIds={unsavedFileIds}
              collaborators={collaborators}
              onSelectFile={openTab}
              onNewFileAt={(f) => {
                setExpandedPaths((prev) => new Set([...prev, f]));
                setIsCreatingFile(f);
              }}
              onNewFolderAt={(f) => {
                setExpandedPaths((prev) => new Set([...prev, f]));
                setIsCreatingFolder(f);
              }}
              onRename={(path, name) => {
                setRenamingPath(path);
                setRenamingValue(name);
              }}
              onDelete={deleteNode}
              onDuplicate={handleDuplicate}
            />
          )}

          {/* If this node is folder and expanded, show inline input if creating file/folder inside it */}
          {node.type === "folder" && isExpanded && (
            <>
              {isCreatingFile === node.path && (
                <div
                  style={{ paddingLeft: `${(depth + 1) * 12 + 20}px` }}
                  className="py-1 pr-2 flex items-center gap-1.5"
                >
                  <FileCode className="h-3.5 w-3.5 text-accent shrink-0" />
                  <input
                    autoFocus
                    placeholder="filename.jsx"
                    value={inlineInputName}
                    onChange={(e) => setInlineInputName(e.target.value)}
                    onBlur={() => handleNewFileSubmit(node.path)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleNewFileSubmit(node.path);
                      if (e.key === "Escape") setIsCreatingFile(null);
                    }}
                    className="w-full text-xs bg-background border border-accent rounded px-1.5 py-0.5 text-foreground placeholder:text-foreground-subtle focus:outline-none"
                  />
                </div>
              )}

              {isCreatingFolder === node.path && (
                <div
                  style={{ paddingLeft: `${(depth + 1) * 12 + 20}px` }}
                  className="py-1 pr-2 flex items-center gap-1.5"
                >
                  <Folder className="h-3.5 w-3.5 text-accent shrink-0" />
                  <input
                    autoFocus
                    placeholder="folder-name"
                    value={inlineInputName}
                    onChange={(e) => setInlineInputName(e.target.value)}
                    onBlur={() => handleNewFolderSubmit(node.path)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleNewFolderSubmit(node.path);
                      if (e.key === "Escape") setIsCreatingFolder(null);
                    }}
                    className="w-full text-xs bg-background border border-accent rounded px-1.5 py-0.5 text-foreground placeholder:text-foreground-subtle focus:outline-none"
                  />
                </div>
              )}

              {node.children && renderTree(node.children, depth + 1)}
            </>
          )}
        </React.Fragment>
      );
    });
  };

  // Mock symbols for current active file outline
  const activeFileName = activeFileId.split("/").pop() || "File";
  const mockSymbols = [
    { name: "HeaderProps", kind: "interface", line: 4 },
    { name: "Header", kind: "component", line: 9 },
    { name: "unreadAlertsCount", kind: "property", line: 11 },
    { name: "handleTitleSubmit", kind: "function", line: 28 },
    { name: "useProjectStore", kind: "hook", line: 15 },
  ];

  return (
    <TooltipProvider delayDuration={150}>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="h-full w-full bg-background-elevated flex flex-col justify-between select-none overflow-hidden">
          {/* Top Explorer Header */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="h-9 px-3 border-b border-border/80 flex items-center justify-between shrink-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle">
                Explorer
              </span>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setIsCreatingFile("root-project")}
                      className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                      aria-label="New File"
                    >
                      <FilePlus className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    New File
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setIsCreatingFolder("root-project")}
                      className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                      aria-label="New Folder"
                    >
                      <FolderPlus className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    New Folder
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleRefresh}
                      className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                      aria-label="Refresh Explorer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Refresh Explorer
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleCollapseAll}
                      className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                      aria-label="Collapse Folders"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Collapse All
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Tree View Container */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-1">
              {/* Root Project Folder Header */}
              <div
                onClick={() => toggleExpand("root-project")}
                className="px-2 py-1 flex items-center justify-between text-xs font-semibold text-foreground hover:bg-background-hover cursor-pointer"
              >
                <div className="flex items-center gap-1.5 truncate">
                  {expandedPaths.has("root-project") ? (
                    <ChevronDown className="h-3.5 w-3.5 text-foreground-subtle shrink-0" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-foreground-subtle shrink-0" />
                  )}
                  <FolderOpen className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span className="truncate uppercase tracking-wider text-[11px] font-bold">
                    {projectName}
                  </span>
                </div>
              </div>

              {expandedPaths.has("root-project") && (
                <div>
                  {isCreatingFile === "root-project" && (
                    <div className="pl-6 pr-2 py-1 flex items-center gap-1.5">
                      <FileCode className="h-3.5 w-3.5 text-accent shrink-0" />
                      <input
                        autoFocus
                        placeholder="filename.jsx"
                        value={inlineInputName}
                        onChange={(e) => setInlineInputName(e.target.value)}
                        onBlur={() => handleNewFileSubmit("root-project")}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleNewFileSubmit("root-project");
                          if (e.key === "Escape") setIsCreatingFile(null);
                        }}
                        className="w-full text-xs bg-background border border-accent rounded px-1.5 py-0.5 text-foreground placeholder:text-foreground-subtle focus:outline-none"
                      />
                    </div>
                  )}

                  {isCreatingFolder === "root-project" && (
                    <div className="pl-6 pr-2 py-1 flex items-center gap-1.5">
                      <Folder className="h-3.5 w-3.5 text-accent shrink-0" />
                      <input
                        autoFocus
                        placeholder="folder-name"
                        value={inlineInputName}
                        onChange={(e) => setInlineInputName(e.target.value)}
                        onBlur={() => handleNewFolderSubmit("root-project")}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleNewFolderSubmit("root-project");
                          if (e.key === "Escape") setIsCreatingFolder(null);
                        }}
                        className="w-full text-xs bg-background border border-accent rounded px-1.5 py-0.5 text-foreground placeholder:text-foreground-subtle focus:outline-none"
                      />
                    </div>
                  )}

                  {renderTree(files, 1)}
                </div>
              )}
            </div>
          </div>

          {/* Bottom OUTLINE Collapsible Panel */}
          <div className="border-t border-border shrink-0 bg-background/50">
            <button
              onClick={() => setIsOutlineOpen(!isOutlineOpen)}
              className="w-full h-7 px-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle hover:text-foreground hover:bg-background-hover transition-colors"
            >
              <div className="flex items-center gap-1.5">
                {isOutlineOpen ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                <span>Outline: {activeFileName}</span>
              </div>
              <span className="text-[10px] text-foreground-subtle/80 font-mono">
                {mockSymbols.length} symbols
              </span>
            </button>

            {isOutlineOpen && (
              <div className="max-h-36 overflow-y-auto px-2 py-1 space-y-0.5 text-xs font-mono">
                {mockSymbols.map((sym, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-2 py-1 rounded hover:bg-background-hover text-foreground-muted hover:text-foreground cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`text-[10px] px-1 py-0.2 rounded font-bold ${
                          sym.kind === "interface"
                            ? "bg-sky-500/20 text-sky-400"
                            : sym.kind === "component"
                              ? "bg-purple-500/20 text-purple-400"
                              : sym.kind === "hook"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {sym.kind[0].toUpperCase()}
                      </span>
                      <span className="truncate">{sym.name}</span>
                    </div>
                    <span className="text-[10px] text-foreground-subtle">
                      :{sym.line}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DndContext>
    </TooltipProvider>
  );
};
