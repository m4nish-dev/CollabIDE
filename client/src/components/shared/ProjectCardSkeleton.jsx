import React from "react";
import { Skeleton } from "./Skeleton";

export const ProjectCardSkeleton = () => {
  return (
    <div className="flex flex-col p-4 h-[160px] bg-background-elevated border border-border rounded-xl shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-5 w-5 rounded-md" />
      </div>
      <Skeleton className="h-4 w-1/2 rounded-md mb-auto" />
      <div className="flex justify-between items-end mt-4">
        <div className="flex -space-x-2">
          <Skeleton className="h-6 w-6 rounded-full border border-background-elevated" />
          <Skeleton className="h-6 w-6 rounded-full border border-background-elevated" />
        </div>
        <Skeleton className="h-3 w-20 rounded-md" />
      </div>
    </div>
  );
};
