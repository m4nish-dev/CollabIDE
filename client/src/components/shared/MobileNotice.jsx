import React from "react";
import { MonitorPlay } from "lucide-react";

export const MobileNotice = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center p-8 text-center md:hidden">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-accent mb-6">
        <MonitorPlay className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-3">
        Desktop Required
      </h2>
      <p className="text-sm text-foreground-muted leading-relaxed max-w-sm">
        The CollabIDE workspace is optimized for larger screens to provide the best coding experience. Please open this project on a desktop or tablet device.
      </p>
    </div>
  );
};
