import React from "react";
import { useCollaborationStore } from "@/store/useCollaborationStore";

export const PresenceIndicator = ({ filePath }) => {
  const { collaborators } = useCollaborationStore();

  const activeCollabs = collaborators.filter(
    (c) => c.status !== "offline" && c.currentFile === filePath
  );

  if (activeCollabs.length === 0) return null;

  if (activeCollabs.length === 1) {
    const collab = activeCollabs[0];
    return (
      <div 
        className="w-2 h-2 rounded-full shrink-0 shadow-sm"
        style={{ backgroundColor: collab.color }}
        title={`${collab.name} is editing this file`}
      />
    );
  }

  return (
    <div className="flex -space-x-1 shrink-0" title={`${activeCollabs.map(c => c.name).join(", ")} are editing this file`}>
      {activeCollabs.slice(0, 3).map((collab) => (
        <div 
          key={collab.id}
          className="w-2.5 h-2.5 rounded-full border border-background shadow-sm"
          style={{ backgroundColor: collab.color }}
        />
      ))}
      {activeCollabs.length > 3 && (
        <div className="w-2.5 h-2.5 rounded-full border border-background bg-foreground-muted flex items-center justify-center text-[6px] font-bold text-background shadow-sm">
          +
        </div>
      )}
    </div>
  );
};
