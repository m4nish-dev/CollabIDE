import React from "react";

export const PageHeader = ({ title, description, actions }) => {
  return (
    <div className="flex items-start justify-between gap-4 pb-6 border-b border-border">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-foreground-muted">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
};
