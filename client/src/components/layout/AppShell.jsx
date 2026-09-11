import React, { useState, useMemo } from "react";
import { NavLink, useLocation, useNavigate, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Star,
  LayoutTemplate,
  Activity,
  Settings,
  Bell,
  Search,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  User,
  ChevronDown,
  Plus,
  Menu,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { KeyboardShortcut } from "@/components/shared/KeyboardShortcut";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAuthStore } from "@/store/useAuthStore";

// ─────────────────────────────────────────────
// Nav config
// ─────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Projects", icon: FolderOpen, to: "/projects" },
  { label: "Shared with me", icon: Users, to: "/shared" },
  { label: "Starred", icon: Star, to: "/starred" },
  { label: "Templates", icon: LayoutTemplate, to: "/templates" },
  { label: "Activity", icon: Activity, to: "/activity" },
];

// ─────────────────────────────────────────────
// Sidebar nav item
// ─────────────────────────────────────────────

const SidebarNavItem = ({ item, collapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === item.to;

  const linkContent = (
    <NavLink
      to={item.to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 group relative",
        isActive
          ? "bg-accent/10 text-accent"
          : "text-foreground-muted hover:bg-background-hover hover:text-foreground",
      )}
    >
      {isActive && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-full"
        />
      )}
      <item.icon
        size={16}
        className={cn(
          "shrink-0 transition-colors",
          isActive
            ? "text-accent"
            : "text-foreground-subtle group-hover:text-foreground-muted",
        )}
      />

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            key="label"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
};

// ─────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────

const Sidebar = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const workspaceGeneral = useSettingsStore(state => state.workspaceGeneral);
  
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="relative hidden md:flex flex-col h-full bg-background-elevated border-r border-border overflow-hidden shrink-0"
    >
      {/* Top: Logo + collapse toggle */}
      <div className="flex items-center justify-between px-3 h-14 border-b border-border">
        <div
          className={cn(
            "flex items-center",
            collapsed && "justify-center w-full",
          )}
        >
          <Logo compact={collapsed} />
        </div>
        {!collapsed && (
          <button
            onClick={onToggle}
            className="ml-auto p-1 rounded-md text-foreground-subtle hover:text-foreground hover:bg-background-hover transition-colors"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={15} />
          </button>
        )}
      </div>

      {/* Middle: navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem key={item.to} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom: workspace, settings, user */}
      <div className="border-t border-border p-2 space-y-1">
        {/* Workspace Switcher */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground-muted hover:bg-background-hover hover:text-foreground transition-colors outline-none",
                    collapsed && "justify-center",
                  )}
                >
                  <div className="h-5 w-5 rounded bg-gradient-to-br from-accent to-secondary shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left font-medium text-foreground text-xs truncate">
                        {workspaceGeneral?.name || "Personal Workspace"}
                      </span>
                      <ChevronsUpDown
                        size={13}
                        className="text-foreground-subtle shrink-0"
                      />
                    </>
                  )}
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">{workspaceGeneral?.name || "Personal Workspace"}</TooltipContent>
            )}
          </Tooltip>
          <DropdownMenuContent side="right" align="start" className="w-52 mb-1">
            <div className="px-2 py-1.5 mb-1">
              <div className="text-xs font-semibold text-foreground">
                Workspaces
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer font-medium bg-accent/10 text-accent">
              <div className="h-4 w-4 rounded bg-gradient-to-br from-accent to-secondary shrink-0" />
              {workspaceGeneral?.name || "Personal Workspace"}
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer text-foreground-muted" onClick={() => navigate("/workspace/settings")}>
              <Settings size={14} /> Workspace Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer text-foreground-muted" onClick={() => {}}>
              <Plus size={14} /> Create new workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink
              to="/settings"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground-muted hover:bg-background-hover hover:text-foreground transition-colors",
                collapsed && "justify-center",
              )}
            >
              <Settings size={16} className="shrink-0" />
              {!collapsed && <span>Settings</span>}
            </NavLink>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Settings</TooltipContent>}
        </Tooltip>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center gap-2 rounded-md px-2 py-2 hover:bg-background-hover transition-colors",
                collapsed && "justify-center",
              )}
            >
              <UserAvatar
                name={user?.name || "User"}
                image={user?.avatar}
                size="sm"
                presence="online"
              />
              {!collapsed && (
                <>
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-xs font-medium text-foreground truncate">
                      {user?.name || "User"}
                    </div>
                    <div className="text-[10px] text-foreground-subtle truncate">
                      {user?.email || ""}
                    </div>
                  </div>
                  <ChevronDown
                    size={12}
                    className="text-foreground-subtle shrink-0"
                  />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-52 mb-1">
            <div className="px-2 py-1.5 mb-1">
              <div className="text-xs font-semibold text-foreground">
                {user?.name || "User"}
              </div>
              <div className="text-[11px] text-foreground-muted">
                {user?.email || ""}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <User size={14} /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Settings size={14} /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 cursor-pointer text-danger focus:text-danger focus:bg-danger/10"
              onClick={async () => {
                try {
                  const { api } = await import("@/lib/api");
                  await api.auth.logout();
                } catch (e) {
                  // ignore
                }
                logout();
                navigate("/login");
              }}
            >
              <LogOut size={14} /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Expand handle when collapsed */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-16 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-background-elevated border border-border text-foreground-subtle hover:text-foreground shadow-md transition-colors"
          aria-label="Expand sidebar"
        >
          <ChevronRight size={12} />
        </button>
      )}
    </motion.aside>
  );
};

// ─────────────────────────────────────────────
// Topbar
// ─────────────────────────────────────────────

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = useSettingsStore(state => state.profile);
  const account = useSettingsStore(state => state.account);
  
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const breadcrumbs = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) return [{ label: "Dashboard" }];
    if (path.startsWith("/projects")) return [{ label: "Projects" }];
    if (path.startsWith("/shared")) return [{ label: "Shared with me" }];
    if (path.startsWith("/starred")) return [{ label: "Starred" }];
    if (path.startsWith("/templates")) return [{ label: "Templates" }];
    if (path.startsWith("/activity")) return [{ label: "Activity" }];
    if (path.startsWith("/notifications")) return [{ label: "Notifications" }];
    
    if (path.startsWith("/workspace/settings")) {
      const section = path.split("/").pop();
      const formatSection = (str) => str.charAt(0).toUpperCase() + str.slice(1).replace("-", " ");
      return [{ label: "Workspace" }, { label: "Settings" }, { label: formatSection(section) }];
    }
    
    if (path.startsWith("/settings")) {
      const section = path.split("/").pop();
      const formatSection = (str) => str.charAt(0).toUpperCase() + str.slice(1).replace("-", " ");
      return [{ label: "Settings" }, { label: formatSection(section) }];
    }
    
    return [];
  }, [location.pathname]);
  
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-background-elevated/60 backdrop-blur-sm shrink-0">
      {/* Left: breadcrumbs & Mobile Menu */}
      <div className="flex items-center gap-1.5 text-sm">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 -ml-1.5 mr-1 rounded-md text-foreground-subtle hover:text-foreground hover:bg-background-hover transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu size={18} />
        </button>
        {breadcrumbs.length > 0 ? (
          breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <span className="text-foreground-subtle text-xs">/</span>
              )}
              <span
                className={cn(
                  "font-medium",
                  i === breadcrumbs.length - 1
                    ? "text-foreground"
                    : "text-foreground-muted hover:text-foreground transition-colors cursor-pointer",
                )}
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))
        ) : (
          <span className="text-foreground-muted text-sm">CollabIDE</span>
        )}
      </div>

      {/* Center: global search */}
      <button
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border text-foreground-subtle hover:border-border-strong hover:text-foreground-muted transition-colors text-sm w-64 group"
        aria-label="Open search"
      >
        <Search size={14} className="shrink-0" />
        <span className="flex-1 text-left text-xs text-foreground-subtle">
          Search or jump to…
        </span>
        <KeyboardShortcut keys={["⌘", "K"]} />
      </button>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        {/* Help */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-2 rounded-md text-foreground-subtle hover:text-foreground hover:bg-background-hover transition-colors">
              <HelpCircle size={16} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Help & docs</TooltipContent>
        </Tooltip>

        {/* Notifications */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="relative p-2 rounded-md text-foreground-subtle hover:text-foreground hover:bg-background-hover transition-colors">
              <Bell size={16} />
              {/* Unread dot */}
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>

        {/* User avatar */}
        <div className="ml-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full ring-2 ring-transparent hover:ring-border transition-all">
                <UserAvatar
                  name={profile?.displayName || "User"}
                  image={profile?.avatar}
                  size="sm"
                  presence="online"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <div className="px-2 py-1.5 mb-1">
                <div className="text-xs font-semibold text-foreground">
                  {profile?.displayName || "User"}
                </div>
                <div className="text-[11px] text-foreground-muted">
                  {account?.email || ""}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <User size={14} /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Settings size={14} /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 cursor-pointer text-danger focus:text-danger focus:bg-danger/10"
                onClick={() => setIsLogoutDialogOpen(true)}
              >
                <LogOut size={14} /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Sign out of CollabIDE?</DialogTitle>
            <DialogDescription className="text-foreground-subtle">
              Are you sure you want to log out? You will need to log in again to access your projects.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={async () => {
              try {
                const { api } = await import("@/lib/api");
                await api.auth.logout();
              } catch (e) {
                // ignore
              }
              const { useAuthStore } = await import("@/store/useAuthStore");
              useAuthStore.getState().logout();
              navigate("/login");
              setIsLogoutDialogOpen(false);
            }}>
              Sign out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

// ─────────────────────────────────────────────
// AppShell
// ─────────────────────────────────────────────

export const AppShell = ({ children, mainClassName }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />

        {/* Mobile Drawer Overlay */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-64 bg-background-elevated border-r border-border shadow-xl md:hidden flex flex-col"
              >
                <div className="flex items-center justify-between px-3 h-14 border-b border-border">
                  <Logo />
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-1.5 rounded-md text-foreground-subtle hover:text-foreground hover:bg-background-hover transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                  <div className="text-xs font-semibold text-foreground-muted mb-2 px-2 uppercase tracking-wider">
                    Menu
                  </div>
                  {NAV_ITEMS.map((item) => (
                    <SidebarNavItem
                      key={item.label}
                      item={item}
                      collapsed={false}
                    />
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Topbar onMenuClick={() => setIsMobileOpen(true)} />

          <main className={cn("flex-1 overflow-y-auto flex flex-col relative", mainClassName !== undefined ? mainClassName : "p-6")}>
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};
