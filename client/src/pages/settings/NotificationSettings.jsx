import React from "react";
import { SettingsLayout } from "@/components/layout/SettingsLayout";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail } from "lucide-react";

export const NotificationSettings = () => {
  const { notificationPrefs, updateNotificationPrefs } = useSettingsStore();

  const NOTIFICATION_TYPES = [
    {
      id: "invites",
      label: "Workspace & Project Invites",
      desc: "When someone invites you to join a workspace or project."
    },
    {
      id: "mentions",
      label: "Comments & Mentions",
      desc: "When someone mentions you (@username) in a file or comment thread."
    },
    {
      id: "activity",
      label: "Project Activity",
      desc: "When members join, branches are created, or code is merged."
    },
    {
      id: "system",
      label: "System Alerts",
      desc: "Important updates about your account, billing, or security."
    }
  ];

  return (
    <SettingsLayout 
      title="Notifications" 
      description="Choose how and when you want to be notified."
    >
      <div className="space-y-6">
        
        {/* Table Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 px-2">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">Notification Type</h3>
          </div>
          <div className="flex items-center gap-12 sm:gap-20 text-sm font-medium text-foreground-subtle w-[160px] sm:w-[200px] shrink-0 justify-end pr-4">
            <div className="flex flex-col items-center gap-1.5 w-12 text-center">
              <Bell className="h-4 w-4" />
              <span className="text-[10px] uppercase tracking-wider">In-App</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 w-12 text-center">
              <Mail className="h-4 w-4" />
              <span className="text-[10px] uppercase tracking-wider">Email</span>
            </div>
          </div>
        </div>

        {/* Table Rows */}
        <div className="space-y-2">
          {NOTIFICATION_TYPES.map((type) => (
            <div 
              key={type.id} 
              className="flex items-start sm:items-center justify-between p-4 rounded-lg bg-background-elevated border border-border"
            >
              <div className="flex-1 pr-6">
                <p className="text-sm font-medium text-foreground">{type.label}</p>
                <p className="text-xs text-foreground-subtle mt-1">{type.desc}</p>
              </div>
              
              <div className="flex items-center gap-12 sm:gap-20 w-[160px] sm:w-[200px] shrink-0 justify-end pr-6">
                <div className="flex justify-center w-12">
                  <Switch 
                    checked={notificationPrefs[type.id].inApp}
                    onCheckedChange={(checked) => updateNotificationPrefs(type.id, 'inApp', checked)}
                  />
                </div>
                <div className="flex justify-center w-12">
                  <Switch 
                    checked={notificationPrefs[type.id].email}
                    onCheckedChange={(checked) => updateNotificationPrefs(type.id, 'email', checked)}
                    disabled={type.id === "system" && !notificationPrefs.system.email} // System emails can't be disabled realistically, but we allow toggle for UI demo
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 mt-8 rounded-lg bg-accent/5 border border-accent/20">
          <h4 className="text-sm font-medium text-accent">Don't disturb schedule</h4>
          <p className="text-xs text-foreground-subtle mt-1 mb-4">
            Pause all non-critical notifications during specific hours.
          </p>
          <div className="flex items-center gap-4">
            <Switch />
            <span className="text-sm text-foreground">Enable schedule</span>
          </div>
        </div>

      </div>
    </SettingsLayout>
  );
};
