import React from "react";
import { cn } from "@/lib/utils";

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-foreground-muted/10",
        className
      )}
      {...props}
    />
  );
};
