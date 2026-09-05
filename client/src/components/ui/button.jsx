import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-120 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-[0.98] active:duration-75 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-white hover:bg-accent-hover shadow-[0_0_15px_rgba(124,92,255,0.25)] hover:shadow-[0_0_20px_rgba(124,92,255,0.4)]",
        secondary:
          "bg-background-elevated border border-border text-foreground hover:bg-background-hover hover:border-border-strong",
        ghost: "hover:bg-background-hover text-foreground",
        danger: "bg-danger text-white hover:bg-red-600 shadow-sm",
        icon: "h-9 w-9 p-0 bg-transparent hover:bg-background-hover text-foreground",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    // Apply scale-95 to active state explicitly via inline class if needed, or via tailwind active:scale-95
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          "active:scale-95",
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
