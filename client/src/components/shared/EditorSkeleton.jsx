import React from "react";
import { Skeleton } from "./Skeleton";

export const EditorSkeleton = () => {
  return (
    <div className="w-full h-full bg-background flex flex-col font-mono text-sm p-4 space-y-4 opacity-50">
      <Skeleton className="h-4 w-1/3 max-w-[300px]" />
      <Skeleton className="h-4 w-1/2 max-w-[400px]" />
      <Skeleton className="h-4 w-1/4 max-w-[200px]" />
      <br />
      <Skeleton className="h-4 w-2/3 max-w-[500px]" />
      <Skeleton className="h-4 w-4/5 max-w-[600px] ml-4" />
      <Skeleton className="h-4 w-3/4 max-w-[550px] ml-4" />
      <Skeleton className="h-4 w-1/2 max-w-[350px] ml-8" />
      <Skeleton className="h-4 w-1/4 max-w-[200px] ml-4" />
      <Skeleton className="h-4 w-16" />
      <br />
      <Skeleton className="h-4 w-1/3 max-w-[300px]" />
    </div>
  );
};
