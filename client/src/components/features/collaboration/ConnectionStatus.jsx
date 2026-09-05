import React from "react";
import { Loader2 } from "lucide-react";
import { useCollaborationStore } from "@/store/useCollaborationStore";

export const ConnectionStatus = () => {
  const { connectionStatus } = useCollaborationStore();

  let colorClass = "bg-green-500";
  let textColorClass = "text-foreground-subtle";
  let icon = null;

  switch (connectionStatus) {
    case "Connected":
      colorClass = "bg-emerald-500";
      break;
    case "Syncing...":
      colorClass = "bg-amber-500";
      icon = <Loader2 className="h-3 w-3 animate-spin text-amber-500 shrink-0" />;
      break;
    case "Reconnecting...":
      colorClass = "bg-amber-500";
      textColorClass = "text-amber-400";
      break;
    case "Offline":
      colorClass = "bg-red-500";
      textColorClass = "text-red-400";
      break;
    default:
      break;
  }

  return (
    <div className="flex items-center gap-1.5 px-2 hover:bg-background-hover cursor-pointer rounded transition-colors h-full">
      {icon ? (
        icon
      ) : (
        <div className={`w-1.5 h-1.5 rounded-full ${colorClass}`} />
      )}
      <span className={`text-[10px] ${textColorClass} truncate max-w-[200px]`}>
        {connectionStatus === "Offline" ? "Offline — Changes will sync when reconnected" : connectionStatus}
      </span>
    </div>
  );
};
