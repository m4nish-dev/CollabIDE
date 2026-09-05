import React, { useState } from "react";
import {
  ExternalLink,
  Laptop,
  MessageSquare,
  MessageSquarePlus,
  RefreshCw,
  Send,
  Smartphone,
  Tablet,
  UserCheck,
  Users,
  Activity as ActivityIcon,
  X,
  Sparkles,
  Zap,
} from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export const RightPanel = () => {
  const {
    activeRightTab,
    setActiveRightTab,
    toggleRightPanel,
    collaborators,
    activities,
    commentThreads,
    setActiveFile,
  } = useProjectStore();

  // Preview state
  const [deviceMode, setDeviceMode] = useState("desktop");
  const [urlPath, setUrlPath] = useState("http://localhost:3000/");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Comments state
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const handleRefreshPreview = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Preview reloaded");
    }, 400);
  };

  const handleOpenExternal = () => {
    window.open(urlPath, "_blank");
  };

  const handleAddReply = (_threadId) => {
    if (!replyText.trim()) return;
    toast.success("Reply posted");
    setReplyText("");
    setActiveReplyId(null);
  };

  const tabs = [
    { id: "preview", label: "Preview", icon: Laptop },
    {
      id: "collaborators",
      label: `Peers (${collaborators.length})`,
      icon: Users,
    },
    { id: "activity", label: "Activity", icon: ActivityIcon },
    { id: "comments", label: "Comments", icon: MessageSquare },
  ];

  return (
    <TooltipProvider delayDuration={150}>
      <aside className="h-full w-full bg-background-elevated border-l border-border flex flex-col select-none overflow-hidden text-xs">
        {/* Panel Header */}
        <div className="h-9 border-b border-border px-2 flex items-center justify-between shrink-0 bg-background-elevated">
          {/* Tabs */}
          <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeRightTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveRightTab(tab.id)}
                  className={`h-7 px-2 rounded flex items-center gap-1.5 transition-colors text-xs ${
                    isActive
                      ? "bg-background-hover text-accent font-medium"
                      : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Close Right Panel */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleRightPanel}
                className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                aria-label="Close Panel"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs">
              Close Panel
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* TAB 1: PREVIEW */}
          {activeRightTab === "preview" && (
            <div className="flex-1 flex flex-col bg-[#0A0A0D] overflow-hidden">
              {/* Browser Address Bar & Device Controls */}
              <div className="p-2 border-b border-border bg-background-elevated/70 flex items-center gap-1.5 shrink-0">
                <div className="flex items-center gap-1 bg-background border border-border rounded px-1.5 py-0.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setDeviceMode("desktop")}
                        className={`p-1 rounded ${
                          deviceMode === "desktop"
                            ? "text-accent bg-accent/15"
                            : "text-foreground-subtle hover:text-foreground"
                        }`}
                      >
                        <Laptop className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Desktop view</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setDeviceMode("tablet")}
                        className={`p-1 rounded ${
                          deviceMode === "tablet"
                            ? "text-accent bg-accent/15"
                            : "text-foreground-subtle hover:text-foreground"
                        }`}
                      >
                        <Tablet className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Tablet view (768px)
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setDeviceMode("mobile")}
                        className={`p-1 rounded ${
                          deviceMode === "mobile"
                            ? "text-accent bg-accent/15"
                            : "text-foreground-subtle hover:text-foreground"
                        }`}
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Mobile view (375px)
                    </TooltipContent>
                  </Tooltip>
                </div>

                <input
                  type="text"
                  value={urlPath}
                  onChange={(e) => setUrlPath(e.target.value)}
                  className="flex-1 bg-background border border-border text-[11px] font-mono rounded px-2 py-1 text-foreground focus:outline-none focus:border-accent"
                />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleRefreshPreview}
                      className="p-1.5 rounded text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                      aria-label="Refresh Preview"
                    >
                      <RefreshCw
                        className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-accent" : ""}`}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Refresh Preview</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleOpenExternal}
                      className="p-1.5 rounded text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                      aria-label="Open in new window"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    Open in new window
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Preview Window Canvas */}
              <div className="flex-1 overflow-auto p-3 flex items-start justify-center bg-[#070709]">
                <div
                  className={`bg-background-elevated border border-border rounded-xl shadow-2xl transition-all duration-300 overflow-hidden flex flex-col ${
                    deviceMode === "desktop"
                      ? "w-full h-full"
                      : deviceMode === "tablet"
                        ? "w-[768px] h-full max-w-full"
                        : "w-[375px] h-[667px] max-w-full"
                  }`}
                >
                  {/* Simulated App Header */}
                  <div className="h-10 px-3 bg-background-elevated border-b border-border flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded bg-accent/20 border border-accent/40 flex items-center justify-center text-[10px] text-accent font-bold">
                        CI
                      </div>
                      <span className="text-xs font-semibold text-foreground">
                        CollabIDE Demo
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">
                      ● Live
                    </span>
                  </div>

                  {/* Simulated App Content */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-[10px] font-semibold">
                        <Sparkles className="h-3 w-3" />
                        Live WebContainer
                      </div>
                      <h2 className="text-base font-bold text-foreground">
                        Real-time collaborative code editor
                      </h2>
                      <p className="text-xs text-foreground-muted">
                        Write code together in real-time with sub-50ms latency,
                        multi-cursor presence, and instant cloud previews.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <div className="p-3 rounded-lg bg-background border border-border flex items-start gap-2.5">
                        <Zap className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-semibold text-foreground">
                            Instant Sync
                          </h4>
                          <p className="text-[11px] text-foreground-muted">
                            CRDT-powered operational transforms.
                          </p>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-background border border-border flex items-start gap-2.5">
                        <Users className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-semibold text-foreground">
                            Peer Awareness
                          </h4>
                          <p className="text-[11px] text-foreground-muted">
                            Live remote cursors and terminal sessions.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() =>
                          toast.success("Action executed inside sandboxed app!")
                        }
                        className="w-full py-2 rounded-lg bg-accent text-white font-medium text-xs shadow-md shadow-accent/25 hover:bg-accent-hover transition-colors"
                      >
                        Interactive CTA Button
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COLLABORATORS */}
          {activeRightTab === "collaborators" && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle">
                Connected Peers ({collaborators.length})
              </div>

              <div className="space-y-2">
                {collaborators.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-lg bg-background border border-border/80 hover:border-border transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="h-8 w-8 rounded-full object-cover border"
                            style={{ borderColor: c.color }}
                          />

                          <span
                            className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background"
                            style={{
                              backgroundColor:
                                c.status === "online" ? "#10B981" : "#F59E0B",
                            }}
                          />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            {c.name}
                            {c.role === "Owner" && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-accent/20 text-accent font-medium">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-foreground-subtle">
                            {c.role}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setActiveFile(c.activeFile);
                          toast.info(
                            `Switched to ${c.name}'s active file: ${c.activeFile.split("/").pop()}`,
                          );
                        }}
                        className="text-[11px] text-accent hover:underline flex items-center gap-1"
                      >
                        <UserCheck className="h-3 w-3" />
                        Jump to
                      </button>
                    </div>

                    <div className="text-[11px] bg-background-elevated px-2 py-1 rounded border border-border/50 flex items-center justify-between text-foreground-muted font-mono">
                      <span>Editing: {c.activeFile.split("/").pop()}</span>
                      {c.cursor && (
                        <span className="text-foreground-subtle">
                          Ln {c.cursor.lineNumber}, Col {c.cursor.column}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ACTIVITY */}
          {activeRightTab === "activity" && (
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle">
                Real-Time Project Feed
              </div>

              <div className="space-y-2">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-2.5 rounded-lg bg-background border border-border/70 text-xs flex items-start gap-2.5"
                  >
                    <img
                      src={act.avatar}
                      alt={act.user}
                      className="h-6 w-6 rounded-full object-cover border shrink-0 mt-0.5"
                      style={{ borderColor: act.color }}
                    />

                    <div className="flex-1">
                      <div className="text-foreground">
                        <span className="font-semibold text-foreground">
                          {act.user}
                        </span>{" "}
                        <span className="text-foreground-muted">
                          {act.action}
                        </span>{" "}
                        <span className="font-mono text-accent">
                          {act.target}
                        </span>
                      </div>
                      <div className="text-[10px] text-foreground-subtle mt-0.5">
                        {act.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COMMENTS */}
          {activeRightTab === "comments" && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle">
                  Code Threads ({commentThreads.length})
                </span>
                <button
                  onClick={() =>
                    toast.info(
                      "Click a line number in the editor to start a discussion thread",
                    )
                  }
                  className="text-accent hover:underline text-[11px] flex items-center gap-1"
                >
                  <MessageSquarePlus className="h-3.5 w-3.5" />
                  New Thread
                </button>
              </div>

              <div className="space-y-3">
                {commentThreads.map((thread) => (
                  <div
                    key={thread.id}
                    className="p-3 rounded-lg bg-background border border-border space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-[11px] text-foreground-subtle font-mono border-b border-border/50 pb-1.5">
                      <button
                        onClick={() => setActiveFile(thread.file)}
                        className="text-accent hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>{thread.file.split("/").pop()}</span>
                        <span>:L{thread.lineNumber}</span>
                      </button>
                      <span>{thread.timestamp}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <img
                        src={thread.avatar}
                        alt={thread.author}
                        className="h-6 w-6 rounded-full object-cover border shrink-0 mt-0.5"
                        style={{ borderColor: thread.color }}
                      />

                      <div>
                        <div className="font-semibold text-foreground text-xs">
                          {thread.author}
                        </div>
                        <p className="text-foreground-muted text-xs mt-0.5">
                          {thread.content}
                        </p>
                      </div>
                    </div>

                    {/* Replies */}
                    {thread.replies.length > 0 && (
                      <div className="pl-4 border-l border-border/60 space-y-2 mt-2">
                        {thread.replies.map((rep) => (
                          <div key={rep.id} className="flex items-start gap-2">
                            <img
                              src={rep.avatar}
                              alt={rep.author}
                              className="h-5 w-5 rounded-full object-cover border shrink-0 mt-0.5"
                              style={{ borderColor: rep.color }}
                            />

                            <div>
                              <div className="font-semibold text-foreground text-[11px] flex items-center gap-2">
                                <span>{rep.author}</span>
                                <span className="text-[10px] text-foreground-subtle font-normal">
                                  {rep.timestamp}
                                </span>
                              </div>
                              <p className="text-foreground-muted text-xs mt-0.5">
                                {rep.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input Box */}
                    {activeReplyId === thread.id ? (
                      <div className="pt-2 space-y-1.5">
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="w-full bg-background-elevated border border-border rounded-md p-1.5 text-xs text-foreground focus:outline-none focus:border-accent"
                        />

                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setActiveReplyId(null)}
                            className="px-2 py-1 rounded text-foreground-muted hover:text-foreground text-[11px]"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleAddReply(thread.id)}
                            className="px-2.5 py-1 rounded bg-accent text-white font-medium text-[11px] flex items-center gap-1 hover:bg-accent-hover"
                          >
                            <Send className="h-3 w-3" />
                            Reply
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveReplyId(thread.id)}
                        className="text-[11px] text-accent hover:underline pt-1 flex items-center gap-1"
                      >
                        Reply to thread...
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
};
