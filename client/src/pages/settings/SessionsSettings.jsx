import React, { useState } from "react";
import { SettingsLayout } from "@/components/layout/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Laptop, Smartphone, Globe, ShieldAlert } from "lucide-react";
import { toast } from "@/lib/toast";

const INITIAL_SESSIONS = [
  { id: 1, device: "MacBook Pro 14\"", browser: "Chrome 120", location: "San Francisco, CA", ip: "192.168.1.1", time: "Active now", current: true },
  { id: 2, device: "iPhone 13 Pro", browser: "Safari Mobile", location: "San Francisco, CA", ip: "10.0.0.45", time: "2 hours ago", current: false },
  { id: 3, device: "Windows PC", browser: "Firefox 118", location: "Seattle, WA", ip: "172.16.0.2", time: "Yesterday", current: false },
  { id: 4, device: "iPad Air", browser: "Safari", location: "Portland, OR", ip: "192.168.1.5", time: "3 days ago", current: false },
];

export const SessionsSettings = () => {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);

  const revokeSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    toast.success("Session revoked successfully");
  };

  const revokeAllOtherSessions = () => {
    setSessions(prev => prev.filter(s => s.current));
    toast.success("All other sessions revoked");
  };

  return (
    <SettingsLayout 
      title="Active Sessions" 
      description="Manage and revoke your active sessions across all devices."
    >
      <div className="space-y-6">
        
        {/* Top Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/20">
          <div>
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-500" />
              Sign out everywhere else
            </h3>
            <p className="text-xs text-foreground-subtle mt-1 max-w-[400px]">
              This will sign you out of all other devices and browsers except for the one you are currently using.
            </p>
          </div>
          <Button 
            onClick={revokeAllOtherSessions}
            disabled={sessions.length <= 1}
            variant="destructive" 
            className="shrink-0 h-9 bg-red-500 hover:bg-red-600 text-white border-transparent"
          >
            Sign out all others
          </Button>
        </div>

        {/* Sessions List */}
        <div className="border border-border rounded-lg overflow-hidden bg-background">
          <div className="bg-background-elevated px-4 py-2 border-b border-border flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider">
              Your Sessions ({sessions.length})
            </span>
          </div>
          
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-foreground-muted text-sm">
              No active sessions found.
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {sessions.map((session) => (
                <div key={session.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-background-hover transition-colors">
                  
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-lg shrink-0 border ${session.current ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-background-elevated border-border text-foreground-muted'}`}>
                      {session.device.includes("iPhone") || session.device.includes("iPad") ? (
                        <Smartphone className="h-5 w-5" />
                      ) : (
                        <Laptop className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        {session.device}
                        {session.current && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                            Current
                          </span>
                        )}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-subtle mt-1">
                        <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {session.browser}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{session.location}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="font-mono">{session.ip}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className={session.current ? "text-emerald-500/80" : ""}>{session.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pl-14 sm:pl-0">
                    {!session.current && (
                      <Button 
                        onClick={() => revokeSession(session.id)}
                        variant="outline" 
                        className="h-8 text-xs text-red-400 hover:text-red-500 border-border hover:bg-red-500/10"
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </SettingsLayout>
  );
};
