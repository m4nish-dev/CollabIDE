import React, { useState } from "react";
import { 
  X, 
  Search, 
  GitCommit, 
  Filter, 
  ChevronRight, 
  ChevronDown 
} from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { Input } from "@/components/ui/input";

export const CommitHistoryPanel = () => {
  const { gitCommits, isCommitHistoryOpen, setIsCommitHistoryOpen } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCommit, setExpandedCommit] = useState(null);

  if (!isCommitHistoryOpen) return null;

  const filteredCommits = gitCommits.filter(c => 
    c.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCommit = (id) => {
    if (expandedCommit === id) {
      setExpandedCommit(null);
    } else {
      setExpandedCommit(id);
    }
  };

  const getTimeAgo = (dateString) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
  };

  return (
    <div className="absolute inset-0 z-40 bg-background/95 backdrop-blur-sm flex justify-center items-center p-8">
      <div className="w-full max-w-4xl h-full max-h-[800px] bg-background-elevated border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
              <GitCommit className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Commit History</h2>
              <p className="text-xs text-foreground-muted">View and search project timeline</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCommitHistoryOpen(false)}
            className="p-1.5 rounded-md text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-3 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-foreground-subtle" />
            <Input 
              placeholder="Search by message or author..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-8 bg-background text-xs"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background hover:bg-background-hover text-xs font-medium text-foreground transition-colors">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </button>
        </div>

        {/* Commit List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredCommits.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-foreground-muted">
              <GitCommit className="h-8 w-8 opacity-20 mb-3" />
              <p className="text-sm">No commits found matching your search</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCommits.map(commit => {
                const isExpanded = expandedCommit === commit.id;
                
                return (
                  <div 
                    key={commit.id}
                    className={`rounded-lg border ${isExpanded ? 'border-border bg-background/50' : 'border-transparent hover:bg-background-hover'}`}
                  >
                    <div 
                      onClick={() => toggleCommit(commit.id)}
                      className="flex items-start gap-3 p-3 cursor-pointer"
                    >
                      <button className="mt-0.5 shrink-0 text-foreground-subtle hover:text-foreground">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                      
                      <img 
                        src={commit.author.avatar} 
                        alt={commit.author.name}
                        className="w-8 h-8 rounded-full border border-border shrink-0 mt-0.5" 
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-foreground truncate">
                            {commit.message}
                          </span>
                          {commit.branches?.map(b => (
                            <span key={b} className="px-1.5 py-0.5 rounded text-[10px] font-medium border border-accent/30 bg-accent/10 text-accent whitespace-nowrap">
                              {b}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-foreground-subtle">
                          <span className="font-medium text-foreground-muted">{commit.author.name}</span>
                          <span>{getTimeAgo(commit.timestamp)}</span>
                          <span className="font-mono bg-background-elevated px-1.5 py-0.5 rounded text-[10px]">
                            {commit.hash}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-xs shrink-0 flex items-center gap-3 bg-background-elevated px-2 py-1 rounded-md border border-border">
                        <span className="text-foreground-muted">{commit.stats.files} files</span>
                        <span className="text-emerald-400 font-mono">+{commit.stats.insertions}</span>
                        <span className="text-red-400 font-mono">-{commit.stats.deletions}</span>
                      </div>
                    </div>
                    
                    {/* Expanded diff view (simulated) */}
                    {isExpanded && (
                      <div className="pl-14 pr-4 pb-4">
                        <div className="bg-background-elevated border border-border rounded-md overflow-hidden">
                          <div className="px-3 py-2 border-b border-border bg-background/50 flex items-center justify-between">
                            <span className="text-xs font-medium text-foreground-muted">Modified Files</span>
                          </div>
                          <div className="p-2 space-y-1">
                            {Array.from({ length: Math.min(commit.stats.files, 3) }).map((_, i) => (
                              <div key={i} className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-background-hover cursor-pointer group">
                                <div className="flex items-center gap-2 text-xs text-foreground">
                                  <span className="text-blue-400 font-bold w-4">M</span>
                                  <span>src/components/ExampleFile{i + 1}.jsx</span>
                                </div>
                                <span className="text-[10px] text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                                  Click to view diff
                                </span>
                              </div>
                            ))}
                            {commit.stats.files > 3 && (
                              <div className="px-2 py-1.5 text-xs text-foreground-subtle italic">
                                ...and {commit.stats.files - 3} more files
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
