import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Bell, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Shield, 
  Zap,
  Check as CheckIcon,
  X
} from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export const NotificationDropdown = () => {
  const { notifications, markAllNotificationsAsRead, markNotificationAsRead } = useSettingsStore();
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    if (activeTab === "mentions") return n.type === "mention";
    return true;
  });

  const getIconForType = (n) => {
    if (n.actor.avatar) {
      return (
        <img 
          src={n.actor.avatar} 
          alt={n.actor.name}
          className="h-8 w-8 rounded-full border border-border" 
        />
      );
    }
    
    switch (n.actor.icon) {
      case "CheckCircle2": return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
      case "AlertCircle": return <AlertCircle className="h-5 w-5 text-red-400" />;
      case "Shield": return <Shield className="h-5 w-5 text-blue-400" />;
      case "Zap": return <Zap className="h-5 w-5 text-amber-400" />;
      default: return <Bell className="h-5 w-5 text-foreground-subtle" />;
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
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative h-7 w-7 rounded-md flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent ring-2 ring-background-elevated" />
          )}
        </button>
      </PopoverTrigger>
      
      <PopoverContent 
        align="end" 
        sideOffset={8}
        className="w-[400px] p-0 bg-background-elevated border-border shadow-2xl overflow-hidden flex flex-col max-h-[500px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
          <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <button 
              onClick={markAllNotificationsAsRead}
              className="text-xs text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
            >
              <Check className="h-3 w-3" /> Mark all as read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 px-4 border-b border-border text-xs font-medium">
          {["all", "unread", "mentions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-accent text-foreground"
                  : "border-transparent text-foreground-muted hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto min-h-[200px]">
          {filteredNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-12 text-foreground-muted">
              <Bell className="h-8 w-8 opacity-20 mb-3" />
              <p className="text-sm">You're all caught up</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredNotifications.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => { if (!n.read) markNotificationAsRead(n.id); }}
                  className={`group relative flex items-start gap-3 p-4 hover:bg-background-hover transition-colors cursor-pointer ${
                    !n.read ? "bg-accent/5" : ""
                  }`}
                >
                  {!n.read && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-accent" />
                  )}
                  
                  <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-background rounded-full">
                    {getIconForType(n)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-foreground leading-snug">
                      <span className="font-semibold mr-1">{n.actor.name}</span>
                      <span className="text-foreground-subtle mr-1">{n.action}</span>
                      <span className="font-bold">{n.target}</span>
                    </p>
                    <div className="text-[11px] text-foreground-muted mt-1">
                      {getTimeAgo(n.timestamp)}
                    </div>
                    
                    {n.requiresAction && (
                      <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" className="h-6 text-[10px] px-3 bg-accent hover:bg-accent-hover text-white">
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" className="h-6 text-[10px] px-3 border-border hover:bg-background">
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

        {/* Footer */}
        <div className="p-2 border-t border-border bg-background/50 flex justify-center">
          <Link 
            to="/notifications" 
            className="text-xs text-foreground-muted hover:text-foreground hover:underline p-2 w-full text-center rounded hover:bg-background-hover transition-colors"
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};
