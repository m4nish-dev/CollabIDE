import React from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/shared/Logo";
import { AuthVisual } from "./AuthVisual";

export const AuthLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left — Form panel */}
      <div className="relative flex w-full flex-col lg:max-w-[480px] overflow-y-auto">
        {/* Logo header */}
        <div className="px-8 pt-8 pb-4">
          <Logo />
        </div>

        {/* Form content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-1 flex-col justify-center px-8 py-8 max-w-[420px] w-full mx-auto"
        >
          {children}
        </motion.div>

        {/* Footer links */}
        <div className="px-8 pb-6 text-center text-[11px] text-foreground-subtle">
          By continuing, you agree to our{" "}
          <a
            href="#"
            className="text-foreground-muted hover:text-foreground underline-offset-2 hover:underline transition-colors"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-foreground-muted hover:text-foreground underline-offset-2 hover:underline transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </div>

      {/* Right — Visual panel (hidden on mobile) */}
      <div className="hidden lg:flex flex-1">
        <AuthVisual />
      </div>
    </div>
  );
};
