import React from "react";
import { Skeleton } from "./Skeleton";

export const FileExplorerSkeleton = () => {
  return (
    <div className="flex flex-col space-y-2 p-2 w-full">
      <Skeleton className="h-5 w-32 mb-2" />
      <div className="pl-4 space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-36" />
        <div className="pl-4 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-44" />
        </div>
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-5 w-28 mt-2" />
      <div className="pl-4 space-y-2">
        <Skeleton className="h-5 w-40" />
      </div>
    </div>
  );
};
