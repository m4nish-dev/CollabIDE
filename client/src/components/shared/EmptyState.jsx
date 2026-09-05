import React from "react";

export const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-background-elevated border border-border text-foreground-muted">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-foreground-muted leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
