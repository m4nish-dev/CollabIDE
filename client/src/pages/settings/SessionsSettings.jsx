import React, { useState, useEffect } from "react";
import { SettingsLayout } from "@/components/layout/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Laptop, Smartphone, Globe, ShieldAlert } from "lucide-react";
import { toast } from "@/lib/toast";
import { api } from "@/lib/api";

export const SessionsSettings = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRevokingAll, setIsRevokingAll] = useState(false);
  const [revokingId, setRevokingId] = useState(null);

  const fetchSessions = () => {
    let mounted = true;
    setIsLoading(true);
    setError(null);
    api.auth.sessions()
      .then((res) => {
        if (mounted) {
          setSessions(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          console.error("Failed to load sessions", err);
          setError(err.message || "Failed to load sessions");
          setIsLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  };

  useEffect(() => {
    return fetchSessions();
  }, []);

  const revokeSession = async (id) => {
    setRevokingId(id);
    try {
      await api.auth.revokeSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      toast.success("Session revoked successfully");
    } catch (err) {
      toast.error(err.message || "Failed to revoke session");
    } finally {
      setRevokingId(null);
    }
  };

  const revokeAllOtherSessions = async () => {
    setIsRevokingAll(true);
    try {
      await api.auth.revokeAllOtherSessions();
      setSessions(prev => prev.filter(s => s.current));
      toast.success("All other sessions revoked");
    } catch (err) {
      toast.error(err.message || "Failed to revoke sessions");
    } finally {
      setIsRevokingAll(false);
    }
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
            disabled={sessions.length <= 1 || isRevokingAll || isLoading}
            variant="destructive" 
            className="shrink-0 h-9 bg-red-500 hover:bg-red-600 text-white border-transparent"
          >
            {isRevokingAll ? "Revoking..." : "Sign out all others"}
          </Button>
        </div>

        {/* Sessions List */}
        <div className="border border-border rounded-lg overflow-hidden bg-background">
          <div className="bg-background-elevated px-4 py-2 border-b border-border flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider">
              Your Sessions ({sessions.length})
            </span>
          </div>
          
          {error ? (
            <div className="flex flex-col items-center justify-center p-8">
              <p className="text-red-400 mb-4">{error}</p>
              <Button variant="secondary" onClick={fetchSessions}>Retry</Button>
            </div>
          ) : isLoading ? (
            <div className="divide-y divide-border/50">
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg shrink-0 bg-background-elevated" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40 bg-background-elevated" />
                    <Skeleton className="h-3 w-60 bg-background-elevated" />
                  </div>
                  <Skeleton className="h-8 w-20 shrink-0 bg-background-elevated" />
                </div>
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <EmptyState
              icon={Laptop}
              title="No active sessions"
              description="You have no other active sessions."
            />
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
                        disabled={revokingId === session.id}
                        variant="outline" 
                        className="h-8 text-xs text-red-400 hover:text-red-500 border-border hover:bg-red-500/10"
                      >
                        {revokingId === session.id ? "Revoking..." : "Revoke"}
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
