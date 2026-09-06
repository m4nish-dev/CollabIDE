import { toast as sonnerToast } from "sonner";

export const toast = {
  success: (message, options) => {
    return sonnerToast.success(message, {
      className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
      ...options,
    });
  },
  error: (message, options) => {
    return sonnerToast.error(message, {
      className: "border-red-500/20 bg-red-500/10 text-red-500",
      ...options,
    });
  },
  info: (message, options) => {
    return sonnerToast.info(message, {
      className: "border-blue-500/20 bg-blue-500/10 text-blue-500",
      ...options,
    });
  },
  warning: (message, options) => {
    return sonnerToast.warning(message, {
      className: "border-amber-500/20 bg-amber-500/10 text-amber-500",
      ...options,
    });
  },
  default: (message, options) => {
    return sonnerToast(message, {
      className: "border-border bg-background-elevated text-foreground",
      ...options,
    });
  },
};
