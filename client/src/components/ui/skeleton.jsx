import * as React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-border-strong", className)}
      {...props}
    />
  );
}
export { Skeleton };
