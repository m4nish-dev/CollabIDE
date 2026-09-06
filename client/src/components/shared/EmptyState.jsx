import React from "react";

export const EmptyState = ({ icon, title, description, action, size = "default" }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${size === "sm" ? "p-4 min-h-[150px]" : "p-8 min-h-[400px]"}`}>
      <div className={`mb-4 flex items-center justify-center rounded-full bg-background-elevated border border-border text-foreground-muted ${size === "sm" ? "h-12 w-12" : "h-16 w-16 mb-6"}`}>
        {icon}
      </div>
      <h3 className={`font-semibold text-foreground ${size === "sm" ? "text-sm mb-1" : "text-lg mb-2"}`}>{title}</h3>
      <p className={`text-foreground-muted leading-relaxed ${size === "sm" ? "text-xs mb-4" : "text-sm mb-6 max-w-sm"}`}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
