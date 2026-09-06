import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useSettingsStore } from "@/store/useSettingsStore";
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Shield, 
  Zap,
  Check,
  MailOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";

export const NotificationsPage = () => {
  const { notifications, markAllNotificationsAsRead, markNotificationAsRead } = useSettingsStore();
  const [filterType, setFilterType] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filters = [
    { id: "all", label: "All Notifications" },
    { id: "unread", label: "Unread", count: unreadCount },
    { id: "invitation", label: "Invitations" },
    { id: "mention", label: "Mentions" },
    { id: "activity", label: "Activity" }, // maps to member_joined, run_completed, etc.
    { id: "system", label: "System Alerts" }, // maps to system_announcement
  ];

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === "unread") return !n.read;
    if (filterType === "invitation") return n.type === "invitation";
    if (filterType === "mention") return n.type === "mention";
    if (filterType === "system") return n.type === "system_announcement";
    if (filterType === "activity") return ["member_joined", "run_completed", "permission_changed", "run_failed"].includes(n.type);
    return true; // all
  });

  const getIconForType = (n) => {
    if (n.actor.avatar) {
      return (
        <img 
          src={n.actor.avatar} 
          alt={n.actor.name}
          className="h-10 w-10 rounded-full border border-border" 
        />
      );
    }
    
    switch (n.actor.icon) {
      case "CheckCircle2": return <CheckCircle2 className="h-6 w-6 text-emerald-400" />;
      case "AlertCircle": return <AlertCircle className="h-6 w-6 text-red-400" />;
      case "Shield": return <Shield className="h-6 w-6 text-blue-400" />;
      case "Zap": return <Zap className="h-6 w-6 text-amber-400" />;
      default: return <Bell className="h-6 w-6 text-foreground-subtle" />;
    }
  };

  const getTimeAgo = (dateString) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return "just now";
  };

  return (
    <AppShell>
      <div className="flex h-full bg-background">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-background-elevated p-6 flex flex-col hidden md:flex shrink-0">
          <h2 className="text-xl font-semibold text-foreground mb-6">Notifications</h2>
          <div className="space-y-1">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  filterType === f.id
                    ? "bg-accent/15 text-accent font-medium"
                    : "text-foreground-muted hover:text-foreground hover:bg-background-hover"
                }`}
              >
                <span>{f.label}</span>
                {f.count > 0 && (
                  <span className="bg-accent text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {f.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full h-full">
          <div className="p-6 md:p-8 flex items-center justify-between border-b border-border">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {filters.find(f => f.id === filterType)?.label}
              </h1>
              <p className="text-sm text-foreground-subtle mt-1">
                Stay updated on your team's activities
              </p>
            </div>
            {unreadCount > 0 && (
              <Button 
                onClick={markAllNotificationsAsRead}
                variant="outline"
                className="h-9 gap-2"
              >
                <Check className="h-4 w-4" /> Mark all as read
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {filteredNotifications.length === 0 ? (
              <EmptyState 
                icon={<CheckCircle2 className="h-8 w-8 text-emerald-500" />}
                title="You're all caught up!"
                description="No new notifications in this category."
              />
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((n) => (
                  <div 
                    key={n.id}
                    onClick={() => { if (!n.read) markNotificationAsRead(n.id); }}
                    className={`group relative flex items-start gap-4 p-5 rounded-xl border transition-all cursor-pointer ${
                      !n.read 
                        ? "bg-accent/5 border-accent/20 hover:border-accent/40" 
                        : "bg-background-elevated border-border hover:border-foreground-muted/30"
                    }`}
                  >
                    {!n.read && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l-xl" />
                    )}
                    
                    <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-background rounded-full">
                      {getIconForType(n)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm text-foreground leading-relaxed">
                          <span className="font-semibold mr-1.5">{n.actor.name}</span>
                          <span className="text-foreground-muted mr-1.5">{n.action}</span>
                          <span className="font-bold text-foreground">{n.target}</span>
                        </p>
                        <span className="text-xs text-foreground-subtle shrink-0 whitespace-nowrap mt-1">
                          {getTimeAgo(n.timestamp)}
                        </span>
                      </div>
                      
                      {n.requiresAction && (
                        <div className="flex items-center gap-3 mt-4">
                          <Button size="sm" className="h-8 px-4 bg-accent hover:bg-accent-hover text-white">
                            Accept Invitation
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 px-4 border-border hover:bg-background">
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};
