import React from "react";
import { useCollaborationStore } from "@/store/useCollaborationStore";
import { useProjectStore } from "@/store/useProjectStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const CollaboratorStack = () => {
  const { collaborators } = useCollaborationStore();
  const { setIsRightPanelOpen, setActiveRightTab } = useProjectStore();

  const onlineCollaborators = collaborators.filter((c) => c.status === "online" || c.status === "idle");
  const maxVisible = 5;
  const visibleCollabs = onlineCollaborators.slice(0, maxVisible);
  const extraCount = onlineCollaborators.length - maxVisible;

  const handleStackClick = () => {
    setActiveRightTab("collaborators");
    setIsRightPanelOpen(true);
  };

  if (onlineCollaborators.length === 0) return null;

  return (
    <div 
      className="flex items-center -space-x-1.5 cursor-pointer pl-1 hover:opacity-80 transition-opacity"
      onClick={handleStackClick}
    >
      <TooltipProvider delayDuration={200}>
        {visibleCollabs.map((collab) => (
          <Tooltip key={collab.id}>
            <TooltipTrigger asChild>
              <div className="relative">
                <img
                  src={collab.avatar}
                  alt={collab.name}
                  className="w-7 h-7 rounded-full border-2 border-background object-cover bg-background-elevated"
                />
                <div 
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background"
                  style={{ backgroundColor: collab.status === 'idle' ? '#9CA3AF' : collab.color }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <div className="flex flex-col">
                <span className="font-semibold flex items-center gap-1.5">
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: collab.color }} 
                  />
                  {collab.name}
                  {collab.status === 'idle' && <span className="text-foreground-subtle text-[10px] ml-1">(Idle)</span>}
                </span>
                <span className="text-foreground-subtle text-[10px] mt-0.5">
                  Currently editing {collab.currentFile.split('/').pop()}
                </span>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
        {extraCount > 0 && (
          <div className="w-7 h-7 rounded-full border-2 border-background bg-background-elevated flex items-center justify-center text-[10px] font-medium text-foreground">
            +{extraCount}
          </div>
        )}
      </TooltipProvider>
    </div>
  );
};
