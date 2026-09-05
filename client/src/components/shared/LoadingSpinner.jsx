import React from "react";
import { cn } from "@/lib/utils";

export const LoadingSpinner = ({ size = "md", className }) => {
  const sizes = {
    sm: "h-4 w-4 border-[1.5px]",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-2",
  };
  return (
    <span
      className={cn(
        "inline-block rounded-full border-border-strong border-t-accent animate-spin",
        sizes[size],
        className,
      )}
    />
  );
};
