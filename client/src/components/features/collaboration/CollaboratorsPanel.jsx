import React from "react";
import { FileCode, LocateFixed } from "lucide-react";
import { useCollaborationStore } from "@/store/useCollaborationStore";
import { useProjectStore } from "@/store/useProjectStore";

export const CollaboratorsPanel = () => {
  const { collaborators } = useCollaborationStore();
  const { setActiveFile } = useProjectStore();

  const onlineCollabs = collaborators.filter(c => c.status !== "offline");
  const offlineCollabs = collaborators.filter(c => c.status === "offline");

  const handleJumpTo = (file) => {
    if (file) {
      setActiveFile(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-elevated overflow-y-auto">
      <div className="px-3 py-2 border-b border-border/50 sticky top-0 bg-background-elevated/95 backdrop-blur-sm z-10 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-foreground">Online now — {onlineCollabs.length}</h3>
      </div>
      
      <div className="flex flex-col py-1">
        {onlineCollabs.length === 0 && (
          <div className="px-4 py-3 text-xs text-foreground-subtle text-center">
            No one else is currently online.
          </div>
        )}
        {onlineCollabs.map((collab) => (
          <div 
            key={collab.id}
            className="flex items-center gap-3 px-3 py-2 hover:bg-background-hover group cursor-default"
          >
            <div className="relative shrink-0">
              <img 
                src={collab.avatar} 
                alt={collab.name} 
                className={`w-8 h-8 rounded-full border border-border object-cover ${collab.status === 'idle' ? 'opacity-60 grayscale' : ''}`}
              />
              <div 
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background-elevated"
                style={{ backgroundColor: collab.status === 'idle' ? '#9CA3AF' : collab.color }}
              />
            </div>
            
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span className={`text-[13px] font-semibold truncate ${collab.status === 'idle' ? 'text-foreground-muted' : 'text-foreground'}`}>
                    {collab.name}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-background border border-border text-foreground-subtle">
                    {collab.role}
                  </span>
                </div>
                <button 
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-background text-foreground-subtle hover:text-foreground rounded transition-all"
                  title="Jump to cursor"
                  onClick={() => handleJumpTo(collab.currentFile)}
                >
                  <LocateFixed className="h-3.5 w-3.5" />
                </button>
              </div>
              
              <div className="flex items-center gap-1 text-[11px] text-foreground-subtle truncate mt-0.5">
                <FileCode className="h-3 w-3 shrink-0" />
                <span className="truncate">Editing {collab.currentFile.split('/').pop()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {offlineCollabs.length > 0 && (
        <>
          <div className="px-3 py-2 border-y border-border/50 sticky top-0 bg-background-elevated/95 backdrop-blur-sm z-10 flex items-center justify-between mt-2">
            <h3 className="text-xs font-semibold text-foreground-muted">Offline — {offlineCollabs.length}</h3>
          </div>
          <div className="flex flex-col py-1">
            {offlineCollabs.map((collab) => (
              <div 
                key={collab.id}
                className="flex items-center gap-3 px-3 py-2 opacity-50"
              >
                <div className="relative shrink-0">
                  <img 
                    src={collab.avatar} 
                    alt={collab.name} 
                    className="w-8 h-8 rounded-full border border-border object-cover grayscale"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background-elevated bg-gray-500" />
                </div>
                
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[13px] font-semibold truncate text-foreground">
                      {collab.name}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-background border border-border text-foreground-subtle">
                      {collab.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-foreground-subtle mt-0.5">Last seen recently</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
