import React, { useState, useRef, useEffect } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Maximize2,
  Minimize2,
  Plus,
  Terminal as TerminalIcon,
  Trash2,
  X,
} from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EmptyState } from "@/components/shared/EmptyState";

export const BottomPanel = ({ onToggleMaximize, isMaximized = false }) => {
  const {
    activeBottomTab,
    setActiveBottomTab,
    toggleBottomPanel,
    terminals,
    activeTerminalId,
    setActiveTerminal,
    addTerminal,
    closeTerminal,
    runTerminalCommand,
    clearTerminal,
    problems,
    setActiveFile,
  } = useProjectStore();

  const [commandInput, setCommandInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState([
    "npm run dev",
    "git status",
  ]);

  const terminalEndRef = useRef(null);
  const terminalInputRef = useRef(null);

  const activeTerminal =
    terminals.find((t) => t.id === activeTerminalId) || terminals[0];

  useEffect(() => {
    if (activeBottomTab === "terminal") {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTerminal?.logs, activeBottomTab]);

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    const cmd = commandInput.trim();
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    runTerminalCommand(activeTerminal.id, cmd);
    setCommandInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setCommandInput(commandHistory[nextIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setCommandInput("");
      } else {
        setHistoryIndex(nextIndex);
        setCommandInput(commandHistory[nextIndex]);
      }
    }
  };

  const errorCount = problems.filter((p) => p.severity === "error").length;
  const warningCount = problems.filter((p) => p.severity === "warning").length;

  const tabs = [
    { id: "terminal", label: "Terminal" },
    {
      id: "problems",
      label: "Problems",
      badge:
        errorCount + warningCount > 0
          ? `${errorCount + warningCount}`
          : undefined,
      badgeColor:
        errorCount > 0 ? "bg-danger text-white" : "bg-warning text-black",
    },
    { id: "output", label: "Output" },
    { id: "debug", label: "Debug Console" },
  ];

  return (
    <TooltipProvider delayDuration={150}>
      <div className="h-full w-full bg-background border-t border-border flex flex-col select-none overflow-hidden font-mono text-xs">
        {/* Panel Header */}
        <div className="h-8 bg-background-elevated border-b border-border/80 px-3 flex items-center justify-between shrink-0 font-sans">
          {/* Tabs */}
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = activeBottomTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveBottomTab(tab.id)}
                  className={`relative h-8 px-3 text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${tab.badgeColor}`}
                    >
                      {tab.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1">
            {activeBottomTab === "terminal" && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={addTerminal}
                      className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                      aria-label="New Terminal"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    New Terminal
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => clearTerminal(activeTerminal.id)}
                      className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                      aria-label="Clear Terminal"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Clear Terminal
                  </TooltipContent>
                </Tooltip>

                <div className="h-3.5 w-px bg-border mx-1" />
              </>
            )}

            {onToggleMaximize && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onToggleMaximize}
                    className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                    aria-label={
                      isMaximized ? "Restore Panel" : "Maximize Panel"
                    }
                  >
                    {isMaximized ? (
                      <Minimize2 className="h-3.5 w-3.5" />
                    ) : (
                      <Maximize2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {isMaximized ? "Restore" : "Maximize"}
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleBottomPanel}
                  className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                  aria-label="Close Panel (⌘J)"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Close Panel (⌘J)
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-hidden flex">
          {/* TAB 1: TERMINAL */}
          {activeBottomTab === "terminal" && (
            <div className="flex-1 flex flex-col h-full bg-background">
              {/* Terminal Sessions Sub-bar (if multiple) */}
              <div className="h-6 bg-background border-b border-border/50 px-3 flex items-center gap-2 overflow-x-auto shrink-0 font-sans">
                {terminals.map((term) => (
                  <div
                    key={term.id}
                    onClick={() => setActiveTerminal(term.id)}
                    className={`h-full flex items-center gap-1.5 px-2 text-[11px] cursor-pointer transition-colors border-b ${
                      term.id === activeTerminalId
                        ? "border-accent text-accent font-medium"
                        : "border-transparent text-foreground-subtle hover:text-foreground"
                    }`}
                  >
                    <TerminalIcon className="h-2.5 w-2.5" />
                    <span>{term.title}</span>
                    {terminals.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTerminal(term.id);
                        }}
                        className="hover:text-danger p-0.5 rounded"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Terminal Logs & Interactive Prompt */}
              <div
                onClick={() => terminalInputRef.current?.focus()}
                className="flex-1 overflow-y-auto p-3 space-y-1 cursor-text select-text flex flex-col"
              >
                {activeTerminal.logs.length === 0 && (
                  <div className="flex-1 flex items-center justify-center">
                    <EmptyState
                      size="sm"
                      icon={<TerminalIcon className="h-6 w-6 text-foreground-muted" />}
                      title="No terminal history"
                      description="Type a command to get started."
                    />
                  </div>
                )}
                
                {activeTerminal.logs.map((log) => (
                  <div key={log.id} className="leading-relaxed">
                    {log.type === "system" && (
                      <div className="text-foreground-subtle text-[11px] font-mono mb-1">
                        {log.text}
                      </div>
                    )}
                    {log.type === "input" && (
                      <div className="flex items-center gap-1.5 text-foreground">
                        <span className="text-emerald-400 font-bold">
                          rohit@collabide
                        </span>
                        <span className="text-foreground-subtle">:</span>
                        <span className="text-sky-400 font-bold">
                          ~/project
                        </span>
                        <span className="text-accent font-bold">$</span>
                        <span className="text-foreground">{log.text}</span>
                      </div>
                    )}
                    {log.type === "output" && (
                      <div className="text-foreground-muted whitespace-pre-wrap pl-2 border-l border-border/30">
                        {log.text}
                      </div>
                    )}
                    {log.type === "error" && (
                      <div className="text-danger whitespace-pre-wrap pl-2 border-l border-danger/40">
                        {log.text}
                      </div>
                    )}
                  </div>
                ))}

                {/* Live interactive command input prompt */}
                <form
                  onSubmit={handleCommandSubmit}
                  className="flex items-center gap-1.5 pt-1"
                >
                  <span className="text-emerald-400 font-bold shrink-0">
                    rohit@collabide
                  </span>
                  <span className="text-foreground-subtle shrink-0">:</span>
                  <span className="text-sky-400 font-bold shrink-0">
                    ~/project
                  </span>
                  <span className="text-accent font-bold shrink-0">$</span>
                  <input
                    ref={terminalInputRef}
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="try 'npm run dev', 'git status', 'ls', 'pwd', 'clear'..."
                    className="flex-1 bg-transparent border-none text-foreground text-xs focus:outline-none placeholder:text-foreground-subtle/50 font-mono"
                  />
                </form>

                <div ref={terminalEndRef} />
              </div>
            </div>
          )}

          {/* TAB 2: PROBLEMS */}
          {activeBottomTab === "problems" && (
            <div className="flex-1 overflow-y-auto p-2 space-y-1 font-sans">
              {problems.length === 0 ? (
                <div className="p-8 text-center text-foreground-subtle text-xs">
                  No problems detected in the workspace.
                </div>
              ) : (
                problems.map((prob) => (
                  <div
                    key={prob.id}
                    onClick={() => setActiveFile(prob.file)}
                    className="flex items-start gap-2.5 p-2 rounded-md hover:bg-background-hover cursor-pointer text-xs group transition-colors"
                  >
                    {prob.severity === "error" && (
                      <AlertCircle className="h-4 w-4 text-danger shrink-0 mt-0.5" />
                    )}
                    {prob.severity === "warning" && (
                      <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                    )}
                    {prob.severity === "info" && (
                      <Info className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                          {prob.message}
                        </span>
                        <span className="text-[10px] text-foreground-subtle bg-background px-1.5 py-0.5 rounded border border-border">
                          {prob.source}
                        </span>
                      </div>
                      <div className="text-[11px] text-foreground-muted font-mono mt-0.5 flex items-center gap-1">
                        <span>{prob.file}</span>
                        <span className="text-foreground-subtle">
                          [{prob.line}, {prob.column}]
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: OUTPUT */}
          {activeBottomTab === "output" && (
            <div className="flex-1 overflow-y-auto p-3 text-xs text-foreground-muted font-mono space-y-1 select-text">
              <div className="text-foreground-subtle">
                [14:52:10] [vite] Initializing WebContainer sandbox compiler...
              </div>
              <div className="text-accent">
                [14:52:11] [vite] Connected to hot reload channel (hmr port
                3000)
              </div>
              <div className="text-foreground-muted">
                [14:52:12] [vite] Transforms compiled: 28 modules in 142ms
              </div>
              <div className="text-emerald-400">
                [14:52:12] [vite] Ready for connections at
                http://localhost:3000/
              </div>
              <div className="text-foreground-subtle">
                [14:54:33] [collab-sync] Broadcast peer presence: 5 connected
                nodes
              </div>
            </div>
          )}

          {/* TAB 4: DEBUG CONSOLE */}
          {activeBottomTab === "debug" && (
            <div className="flex-1 overflow-y-auto p-3 text-xs text-foreground-muted font-mono space-y-1 select-text">
              <div className="text-foreground-subtle">
                Welcome to Node.js v20.12.2 Debug Console.
              </div>
              <div className="text-foreground-subtle">
                Type '.help' for more information.
              </div>
              <div className="text-foreground-muted">&gt; process.version</div>
              <div className="text-emerald-400">'v20.12.2'</div>
              <div className="text-foreground-muted">
                &gt; process.env.NODE_ENV
              </div>
              <div className="text-emerald-400">'development'</div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
