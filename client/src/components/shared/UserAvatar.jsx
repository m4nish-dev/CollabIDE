import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const UserAvatar = ({ name, image, size = "md", presence }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const sizeClasses = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-8 w-8 text-xs",
    lg: "h-10 w-10 text-sm",
  };

  const presenceColors = {
    online: "bg-success",
    away: "bg-warning",
    offline: "bg-foreground-subtle",
  };

  return (
    <div className="relative inline-block">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={image} alt={name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      {presence && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-background ${presenceColors[presence]} ${size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2"}`}
        />
      )}
    </div>
  );
};
