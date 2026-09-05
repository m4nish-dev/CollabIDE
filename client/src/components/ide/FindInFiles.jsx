import React, { useState } from "react";
import {
  Search,
  Replace,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  CaseSensitive,
  WholeWord,
  Regex,
  MoreVertical,
  ListTree,
  FileCode,
  X
} from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const FindInFiles = () => {
  const { setActiveFile } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const [isReplaceOpen, setIsReplaceOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const [matchCase, setMatchCase] = useState(false);
  const [matchWord, setMatchWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  const [includes, setIncludes] = useState("");
  const [excludes, setExcludes] = useState("");

  const [expandedFiles, setExpandedFiles] = useState(new Set(["src/components/Header.jsx"]));

  // Mock results for demonstration since we don't have a backend indexer yet
  const mockResults = [
    {
      file: "src/components/Header.jsx",
      matches: [
        { line: 24, content: "  unreadAlertsCount = 3," },
        { line: 63, content: "  {unreadAlertsCount > 0 && (" }
      ]
    },
    {
      file: "src/App.jsx",
      matches: [
        { line: 12, content: "  <Header workspaceName=\"CollabIDE Demo\" unreadAlertsCount={2} />" }
      ]
    }
  ];

  const toggleExpand = (file) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(file)) next.delete(file);
      else next.add(file);
      return next;
    });
  };

  const handleMatchClick = (file, line) => {
    setActiveFile(file);
    // In a real implementation, we would scroll to the line in Monaco editor
  };

  const renderResults = () => {
    if (!searchQuery) {
      return (
        <div className="flex flex-col items-center justify-center h-48 text-foreground-subtle space-y-3 px-4 text-center">
          <Search className="h-8 w-8 text-border-strong" />
          <p className="text-xs">Search for text across your entire workspace.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col text-xs text-foreground mt-2">
        <div className="px-3 py-2 text-foreground-subtle font-medium border-b border-border">
          3 results in 2 files
        </div>
        
        {mockResults.map((result) => {
          const isExpanded = expandedFiles.has(result.file);
          const filename = result.file.split("/").pop();
          return (
            <div key={result.file} className="flex flex-col">
              <div 
                className="flex items-center gap-1 px-2 py-1.5 hover:bg-background-hover cursor-pointer"
                onClick={() => toggleExpand(result.file)}
              >
                {isExpanded ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-foreground-subtle" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-foreground-subtle" />}
                <FileCode className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                <span className="truncate flex-1">{filename}</span>
                <span className="text-[10px] bg-accent/20 text-accent px-1.5 rounded-full">{result.matches.length}</span>
              </div>
              
              {isExpanded && (
                <div className="flex flex-col">
                  {result.matches.map((match, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-2 pl-7 pr-2 py-1 hover:bg-background-hover cursor-pointer group"
                      onClick={() => handleMatchClick(result.file, match.line)}
                    >
                      <span className="text-foreground-subtle text-[10px] w-6 shrink-0 text-right font-mono mt-0.5">{match.line}</span>
                      <span className="font-mono text-[11px] truncate flex-1 opacity-80 group-hover:opacity-100">
                        {match.content.replace("unreadAlertsCount", "unreadAlertsCount")}
                        {/* We would highlight the actual match in real implementation */}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="h-full w-full bg-background-elevated flex flex-col select-none overflow-hidden text-foreground">
        
        {/* Header */}
        <div className="h-9 px-3 border-b border-border/80 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle">
            Search
          </span>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                  aria-label="Refresh Search"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">Refresh</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                  aria-label="Clear Search Results"
                  onClick={() => setSearchQuery("")}
                >
                  <ListTree className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">Clear Results</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                  aria-label="More Actions"
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">More Actions...</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Inputs */}
        <div className="p-3 border-b border-border flex flex-col gap-2 shrink-0">
          <div className="flex flex-col gap-1.5 relative">
            <div className="flex items-center absolute left-1 top-[5px] text-foreground-subtle z-10 cursor-pointer" onClick={() => setIsReplaceOpen(!isReplaceOpen)}>
              {isReplaceOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
            
            <div className="relative flex-1 ml-5">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search" 
                className="w-full bg-background border border-border text-xs rounded-sm pl-2 pr-[72px] py-1 text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
              <div className="absolute right-1 top-[3px] flex items-center gap-0.5">
                <div onClick={() => setMatchCase(!matchCase)} className={`p-0.5 rounded cursor-pointer ${matchCase ? 'bg-accent/20 text-accent' : 'text-foreground-subtle hover:text-foreground hover:bg-background-hover'}`} title="Match Case"><CaseSensitive className="h-3.5 w-3.5" /></div>
                <div onClick={() => setMatchWord(!matchWord)} className={`p-0.5 rounded cursor-pointer ${matchWord ? 'bg-accent/20 text-accent' : 'text-foreground-subtle hover:text-foreground hover:bg-background-hover'}`} title="Match Whole Word"><WholeWord className="h-3.5 w-3.5" /></div>
                <div onClick={() => setUseRegex(!useRegex)} className={`p-0.5 rounded cursor-pointer ${useRegex ? 'bg-accent/20 text-accent' : 'text-foreground-subtle hover:text-foreground hover:bg-background-hover'}`} title="Use Regular Expression"><Regex className="h-3.5 w-3.5" /></div>
              </div>
            </div>

            {isReplaceOpen && (
              <div className="relative flex-1 ml-5 flex gap-1">
                <input 
                  type="text" 
                  value={replaceQuery}
                  onChange={(e) => setReplaceQuery(e.target.value)}
                  placeholder="Replace" 
                  className="w-full bg-background border border-border text-xs rounded-sm px-2 py-1 text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
                <button className="px-2 bg-background border border-border rounded-sm hover:bg-background-hover transition-colors" title="Replace">
                  <Replace className="h-3.5 w-3.5 text-foreground-subtle" />
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setIsDetailsOpen(!isDetailsOpen)} className="text-[10px] text-foreground-subtle flex items-center gap-1 hover:text-foreground w-fit ml-5 mt-1">
            <MoreVertical className="h-3 w-3" />
            {isDetailsOpen ? 'Hide' : 'Show'} search details
          </button>

          {isDetailsOpen && (
            <div className="flex flex-col gap-1.5 ml-5 mt-1">
              <input 
                type="text" 
                value={includes}
                onChange={(e) => setIncludes(e.target.value)}
                placeholder="files to include (e.g. *.js)" 
                className="w-full bg-background border border-border text-xs rounded-sm px-2 py-1 text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-accent"
              />
              <input 
                type="text" 
                value={excludes}
                onChange={(e) => setExcludes(e.target.value)}
                placeholder="files to exclude (e.g. node_modules)" 
                className="w-full bg-background border border-border text-xs rounded-sm px-2 py-1 text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-accent"
              />
            </div>
          )}
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto">
          {renderResults()}
        </div>

      </div>
    </TooltipProvider>
  );
};
