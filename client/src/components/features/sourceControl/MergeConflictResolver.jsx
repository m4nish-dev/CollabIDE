import React from "react";
import { AlertTriangle, Check, LayoutPanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";

export const MergeConflictResolver = ({ file, onResolve }) => {
  if (!file) return null;

  return (
    <div className="flex flex-col h-full w-full bg-[#0E0E12] font-mono text-sm relative">
      {/* Banner */}
      <div className="h-10 bg-amber-500/10 border-b border-amber-500/30 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2 text-amber-500">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            This file has merge conflicts
          </span>
        </div>
        <Button 
          variant="outline" 
          className="h-6 text-[10px] bg-background border-border hover:bg-background-hover hover:text-accent flex items-center gap-1.5"
        >
          <LayoutPanelLeft className="h-3 w-3" />
          Open in 3-way merge view
        </Button>
      </div>

      {/* Simulated Editor with Inline Conflict */}
      <div className="flex-1 overflow-auto p-4 text-foreground leading-relaxed whitespace-pre font-mono text-[13px]">
        <div className="text-foreground-subtle opacity-70">
          {'import React from "react";\nimport { Header } from "./components/Header";\n\nexport default function App() {\n  return (\n    <div className="app-container">\n'}
        </div>

        {/* Conflict Block */}
        <div className="my-2 border border-border rounded-md overflow-hidden shadow-xl">
          {/* Action Bar */}
          <div className="bg-background-elevated px-2 py-1.5 border-b border-border flex items-center gap-2 text-[11px] font-sans">
            <button className="px-2 py-0.5 text-blue-400 hover:bg-blue-400/10 rounded transition-colors flex items-center gap-1">
              <Check className="h-3 w-3" /> Accept Current Change
            </button>
            <span className="text-border">|</span>
            <button className="px-2 py-0.5 text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors flex items-center gap-1">
              <Check className="h-3 w-3" /> Accept Incoming Change
            </button>
            <span className="text-border">|</span>
            <button 
              className="px-2 py-0.5 text-foreground-muted hover:text-foreground hover:bg-background-hover rounded transition-colors"
              onClick={onResolve}
            >
              Accept Both
            </button>
          </div>

          {/* Current Change (HEAD) */}
          <div className="bg-blue-900/20 border-l-2 border-blue-500 p-2 relative group">
            <div className="absolute top-0 right-2 text-[10px] text-blue-400 opacity-50 uppercase font-sans">
              Current Change (HEAD)
            </div>
            <div className="text-blue-200">
              {'<<<<<<< HEAD\n      <Header variant="modern" />\n      <main>'}
            </div>
          </div>

          <div className="h-px bg-border w-full" />

          {/* Incoming Change */}
          <div className="bg-emerald-900/20 border-l-2 border-emerald-500 p-2 relative group">
            <div className="absolute top-0 right-2 text-[10px] text-emerald-400 opacity-50 uppercase font-sans">
              Incoming Change (feature/new-header)
            </div>
            <div className="text-emerald-200">
              {'=======\n      <Header showNotifications={true} />\n      <main className="content">'}
            </div>
          </div>
          
          <div className="bg-background-elevated text-foreground-subtle p-1 px-2 border-t border-border text-[11px]">
            {">>>>>>> feature/new-header"}
          </div>
        </div>

        <div className="text-foreground-subtle opacity-70">
          {'        <Home />\n      </main>\n    </div>\n  );\n}'}
        </div>
      </div>
    </div>
  );
};

MergeConflictResolver.propTypes = {
  file: PropTypes.shape({
    path: PropTypes.string,
  }),
  onResolve: PropTypes.func,
};
