import React, { useState } from "react";
import {
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  FileText,
  FileCode,
  FileJson,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  GitCommit,
  Check,
} from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { EmptyState } from "@/components/shared/EmptyState";

const getFileIcon = (filename) => {
  if (filename.endsWith(".jsx") || filename.endsWith(".js")) {
    return <FileCode className="h-4 w-4 text-yellow-400" />;
  }
  if (filename.endsWith(".json")) {
    return <FileJson className="h-4 w-4 text-emerald-400" />;
  }
  if (filename.match(/\.(png|jpe?g|svg|gif)$/i)) {
    return <ImageIcon className="h-4 w-4 text-purple-400" />;
  }
  return <FileText className="h-4 w-4 text-foreground-subtle" />;
};

const getStatusColor = (status) => {
  switch (status) {
    case "A":
      return "text-emerald-400";
    case "M":
      return "text-blue-400";
    case "D":
      return "text-red-400";
    case "C":
      return "text-amber-400";
    default:
      return "text-foreground-muted";
  }
};

const FileRow = ({ file, onAction, actionIcon: ActionIcon, isStaged }) => {
  const filename = file.path.split("/").pop();
  const dir = file.path.substring(0, file.path.lastIndexOf("/"));

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex items-center justify-between px-2 py-1 hover:bg-background-hover cursor-pointer group text-[13px] group/row">
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            {getFileIcon(filename)}
            <span className="truncate text-foreground">{filename}</span>
            <span className="truncate text-[11px] text-foreground-subtle ml-1">
              {dir}
            </span>
          </div>
          <div className="flex items-center gap-2 pl-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction(file.id);
              }}
              className="p-1 rounded opacity-0 group-hover/row:opacity-100 hover:bg-background-elevated text-foreground-muted hover:text-foreground transition-all"
            >
              <ActionIcon className="h-3.5 w-3.5" />
            </button>
            <span
              className={`text-[11px] font-bold w-3 text-center ${getStatusColor(
                file.status
              )}`}
            >
              {file.status}
            </span>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48 bg-background-elevated border-border text-foreground">
        <ContextMenuItem onClick={() => onAction(file.id)}>
          {isStaged ? "Unstage Changes" : "Stage Changes"}
        </ContextMenuItem>
        <ContextMenuItem>Open File</ContextMenuItem>
        <ContextMenuItem>Open Changes</ContextMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <ContextMenuItem className="text-red-400 focus:text-red-500">
          Discard Changes
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export const SourceControlPanel = () => {
  const { gitWorkingTree, stageFile, unstageFile, commitChanges, setIsCommitHistoryOpen } =
    useProjectStore();

  const [message, setMessage] = useState("");
  const [stagedExpanded, setStagedExpanded] = useState(true);
  const [changesExpanded, setChangesExpanded] = useState(true);
  const [mergeExpanded, setMergeExpanded] = useState(true);

  const stagedFiles = gitWorkingTree.filter((f) => f.staged && f.status !== "C");
  const unstagedFiles = gitWorkingTree.filter(
    (f) => !f.staged && f.status !== "C"
  );
  const conflictedFiles = gitWorkingTree.filter((f) => f.status === "C");

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleCommit();
    }
  };

  const handleCommit = () => {
    if (!message.trim() || stagedFiles.length === 0) return;
    commitChanges(message);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-full bg-background-elevated border-r border-border select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <h2 className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">
          Source Control
        </h2>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setIsCommitHistoryOpen(true)}>
                View History
              </DropdownMenuItem>
              <DropdownMenuItem>Fetch</DropdownMenuItem>
              <DropdownMenuItem>Pull</DropdownMenuItem>
              <DropdownMenuItem>Push</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Commit Input Section */}
        <div className="p-4 space-y-3 border-b border-border">
          <textarea
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            placeholder="Message (Ctrl+Enter to commit)"
            className="w-full bg-background border border-border rounded-md p-2 text-xs text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none min-h-[40px] max-h-[100px] overflow-hidden"
            rows={Math.min(5, Math.max(2, message.split("\n").length))}
          />

          <div className="flex gap-0.5">
            <button
              onClick={handleCommit}
              disabled={stagedFiles.length === 0 || !message.trim()}
              className="flex-1 h-7 bg-accent hover:bg-accent-hover text-white text-xs font-medium rounded-l flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Commit
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  disabled={stagedFiles.length === 0 || !message.trim()}
                  className="h-7 px-1 bg-accent hover:bg-accent-hover text-white rounded-r flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-l border-white/20"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCommit}>
                  Commit & Push
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCommit}>
                  Commit & Sync
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <button className="w-full h-7 bg-background hover:bg-background-hover border border-border text-foreground text-xs font-medium rounded flex items-center justify-center gap-2 transition-colors">
            <RefreshCw className="h-3 w-3" />
            Sync Changes
            <span className="flex items-center gap-1 text-[10px] text-foreground-muted ml-1">
              2<ArrowUp className="h-3 w-3" /> 1<ArrowDown className="h-3 w-3" />
            </span>
          </button>
        </div>

        {/* File Trees */}
        {gitWorkingTree.length === 0 ? (
          <div className="py-8">
            <EmptyState
              size="sm"
              icon={<Check className="h-6 w-6 text-emerald-500" />}
              title="No changes"
              description="Your working tree is clean."
            />
          </div>
        ) : (
          <div className="py-2">
            {/* Merge Changes */}
            {conflictedFiles.length > 0 && (
              <div className="mb-2">
                <button
                  onClick={() => setMergeExpanded(!mergeExpanded)}
                  className="flex items-center gap-1 px-1 w-full hover:bg-background-hover transition-colors"
                >
                  {mergeExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 text-foreground-muted" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-foreground-muted" />
                  )}
                  <span className="text-xs font-bold text-foreground">
                    Merge Changes
                  </span>
                  <span className="text-[10px] bg-background-hover text-foreground-muted px-1.5 rounded-full ml-1">
                    {conflictedFiles.length}
                  </span>
                </button>
                {mergeExpanded && (
                  <div className="mt-1">
                    {conflictedFiles.map((file) => (
                      <FileRow
                        key={file.id}
                        file={file}
                        onAction={() => {}} // Custom action for conflicts if needed
                        actionIcon={GitCommit}
                        isStaged={false}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Staged Changes */}
            <div className="mb-2">
              <button
                onClick={() => setStagedExpanded(!stagedExpanded)}
                className="flex items-center gap-1 px-1 w-full hover:bg-background-hover transition-colors"
              >
                {stagedExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 text-foreground-muted" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-foreground-muted" />
                )}
                <span className="text-xs font-bold text-foreground">
                  Staged Changes
                </span>
                <span className="text-[10px] bg-background-hover text-foreground-muted px-1.5 rounded-full ml-1">
                  {stagedFiles.length}
                </span>
              </button>
              {stagedExpanded && (
                <div className="mt-1">
                  {stagedFiles.length === 0 ? (
                    <div className="px-6 py-2 text-xs text-foreground-subtle italic">
                      No changes staged
                    </div>
                  ) : (
                    stagedFiles.map((file) => (
                      <FileRow
                        key={file.id}
                        file={file}
                        onAction={unstageFile}
                        actionIcon={Minus}
                        isStaged={true}
                      />
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Changes */}
            <div>
              <button
                onClick={() => setChangesExpanded(!changesExpanded)}
                className="flex items-center gap-1 px-1 w-full hover:bg-background-hover transition-colors"
              >
                {changesExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 text-foreground-muted" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-foreground-muted" />
                )}
                <span className="text-xs font-bold text-foreground">Changes</span>
                <span className="text-[10px] bg-background-hover text-foreground-muted px-1.5 rounded-full ml-1">
                  {unstagedFiles.length}
                </span>
              </button>
              {changesExpanded && (
                <div className="mt-1">
                  {unstagedFiles.length === 0 ? (
                    <div className="px-6 py-2 text-xs text-foreground-subtle italic">
                      No unstaged changes
                    </div>
                  ) : (
                    unstagedFiles.map((file) => (
                      <FileRow
                        key={file.id}
                        file={file}
                        onAction={stageFile}
                        actionIcon={Plus}
                        isStaged={false}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
