import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { useSettingsStore } from "@/store/useSettingsStore";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const USER_NAV = [
  { id: "profile", label: "Profile", href: "/settings/profile" },
  { id: "account", label: "Account", href: "/settings/account" },
  { id: "appearance", label: "Appearance", href: "/settings/appearance" },
  { id: "editor", label: "Editor", href: "/settings/editor" },
  { id: "keyboard", label: "Keyboard", href: "/settings/keyboard" },
  { id: "notifications", label: "Notifications", href: "/settings/notifications" },
  { id: "security", label: "Security", href: "/settings/security" },
  { id: "connections", label: "Connected Accounts", href: "/settings/connections" },
  { id: "sessions", label: "Sessions", href: "/settings/sessions" },
];

const WORKSPACE_NAV = [
  { id: "ws-general", label: "General", href: "/workspace/settings/general" },
  { id: "ws-members", label: "Members", href: "/workspace/settings/members" },
  { id: "ws-permissions", label: "Permissions", href: "#" }, // Mock link
  { id: "ws-environment", label: "Environment", href: "#" }, // Mock link
  { id: "ws-runtime", label: "Runtime", href: "#" }, // Mock link
  { id: "ws-resource", label: "Resource Limits", href: "#" }, // Mock link
  { id: "ws-visibility", label: "Visibility", href: "#" }, // Mock link
  { id: "ws-billing", label: "Billing", href: "#" }, // Mock link
  { id: "ws-danger", label: "Danger Zone", href: "/workspace/settings/danger", textClass: "text-red-400 hover:text-red-500" },
];

export const SettingsLayout = ({ children, title, description }) => {
  const { pathname } = useLocation();
  const { isSaving } = useSettingsStore();
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    let timeout;
    if (isSaving) {
      setShowSaved(false);
    } else {
      setShowSaved(true);
      timeout = setTimeout(() => {
        setShowSaved(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [isSaving]);

  return (
    <AppShell>
      <div className="flex h-full bg-background relative">
        {/* Left Nav */}
        <div className="w-64 border-r border-border bg-background-elevated overflow-y-auto hidden md:block shrink-0">
          <div className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Settings</h2>
            
            <div className="space-y-8">
              {/* User Section */}
              <div>
                <h3 className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider mb-3 px-3">
                  User Settings
                </h3>
                <nav className="space-y-0.5">
                  {USER_NAV.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.id}
                        to={item.href}
                        className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                          isActive 
                            ? "bg-accent/15 text-accent font-medium" 
                            : `text-foreground-muted hover:bg-background-hover hover:text-foreground ${item.textClass || ""}`
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Workspace Section */}
              <div>
                <h3 className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider mb-3 px-3">
                  Workspace Settings
                </h3>
                <nav className="space-y-0.5">
                  {WORKSPACE_NAV.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.id}
                        to={item.href}
                        className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                          isActive 
                            ? "bg-accent/15 text-accent font-medium" 
                            : `text-foreground-muted hover:bg-background-hover hover:text-foreground ${item.textClass || ""}`
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-[720px] mx-auto w-full p-6 md:p-10 lg:p-12">
            
            <div className="flex items-start justify-between mb-8 pb-6 border-b border-border relative">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                {description && (
                  <p className="text-sm text-foreground-subtle mt-1.5">
                    {description}
                  </p>
                )}
              </div>
              
              {/* Auto-save Indicator */}
              <div className="h-8 flex items-center justify-end min-w-[80px]">
                <AnimatePresence mode="wait">
                  {isSaving ? (
                    <motion.div 
                      key="saving"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-xs text-foreground-subtle"
                    >
                      <div className="h-3 w-3 border-2 border-foreground-muted border-t-accent rounded-full animate-spin" />
                      Saving...
                    </motion.div>
                  ) : showSaved ? (
                    <motion.div 
                      key="saved"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium bg-emerald-500/10 px-2 py-1 rounded-full"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Saved
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            <div className="pb-20">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
