import React, { useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { MOCK_ACTIVITIES } from "@/lib/mockData";
import { 
  GitBranch, 
  GitCommit, 
  UserPlus, 
  FileEdit, 
  Settings, 
  PlayCircle,
  Filter,
  Calendar,
  ChevronDown
} from "lucide-react";

export const ActivityPage = () => {
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);

  // Group activities
  const groupActivities = (acts) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups = {
      Today: [],
      Yesterday: [],
      "Last Week": [],
      Earlier: []
    };

    acts.forEach(act => {
      const actDate = new Date(act.timestamp);
      if (actDate.toDateString() === today.toDateString()) {
        groups.Today.push(act);
      } else if (actDate.toDateString() === yesterday.toDateString()) {
        groups.Yesterday.push(act);
      } else if (actDate > lastWeek) {
        groups["Last Week"].push(act);
      } else {
        groups.Earlier.push(act);
      }
    });

    return groups;
  };

  const groupedActivities = groupActivities(activities);

  const getIconForType = (type) => {
    switch (type) {
      case "branch_created": return <GitBranch className="h-4 w-4 text-blue-400" />;
      case "commit": return <GitCommit className="h-4 w-4 text-violet-400" />;
      case "member_added": return <UserPlus className="h-4 w-4 text-emerald-400" />;
      case "file_changed": return <FileEdit className="h-4 w-4 text-amber-400" />;
      case "settings_updated": return <Settings className="h-4 w-4 text-neutral-400" />;
      default: return <PlayCircle className="h-4 w-4 text-cyan-400" />;
    }
  };

  const getTimeOnly = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Mock infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        setIsLoading(true);
        setTimeout(() => {
          // Add some mocked older data
            const olderActivity = {
              id: `a${Date.now()}`,
              type: "commit",
              user: { name: "Rohit Chugh", avatar: "https://i.pravatar.cc/150?u=rohit" },
              action: "pushed a commit to",
              target: "main",
              project: { name: "legacy-app" },
              timestamp: new Date(Date.now() - 30 * 86400000).toISOString(),
            };
          setActivities(prev => [...prev, olderActivity]);
          setIsLoading(false);
        }, 1000);
      }
    }, { threshold: 1.0 });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [isLoading]);

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-background max-w-5xl mx-auto w-full">
        {/* Header & Filters */}
        <div className="p-6 md:p-8 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
          <h1 className="text-2xl font-bold text-foreground mb-6">Activity Feed</h1>
          
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-background-elevated border border-border rounded-md text-sm text-foreground hover:bg-background-hover transition-colors">
              <span className="font-medium">Workspace:</span> CollabIDE Team <ChevronDown className="h-3.5 w-3.5 text-foreground-subtle" />
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-background-elevated border border-border rounded-md text-sm text-foreground hover:bg-background-hover transition-colors">
              <Filter className="h-3.5 w-3.5 text-foreground-subtle" /> 
              <span>All Users</span> <ChevronDown className="h-3.5 w-3.5 text-foreground-subtle" />
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-background-elevated border border-border rounded-md text-sm text-foreground hover:bg-background-hover transition-colors">
              <Calendar className="h-3.5 w-3.5 text-foreground-subtle" /> 
              <span>Last 30 days</span> <ChevronDown className="h-3.5 w-3.5 text-foreground-subtle" />
            </button>
          </div>
        </div>

        {/* Feed Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10">
          {Object.entries(groupedActivities).map(([dateLabel, items]) => {
            if (items.length === 0) return null;
            
            return (
              <div key={dateLabel}>
                <h3 className="text-sm font-semibold text-foreground-subtle mb-4 sticky top-0 bg-background py-1 z-10">
                  {dateLabel}
                </h3>
                <div className="space-y-4">
                  {items.map((act) => (
                    <div key={act.id} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-background-elevated hover:border-foreground-muted/30 transition-colors group">
                      
                      {/* Left Type Icon */}
                      <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center shrink-0 mt-0.5 border border-border group-hover:border-accent/50 transition-colors">
                        {getIconForType(act.type)}
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            {act.user?.avatar ? (
                              <img src={act.user.avatar} alt={act.user.name} className="w-5 h-5 rounded-full object-cover" />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                                <Settings className="h-3 w-3" />
                              </div>
                            )}
                            <p className="text-sm text-foreground">
                              <span className="font-medium mr-1.5">{act.user?.name}</span>
                              <span className="text-foreground-muted mr-1.5">{act.action}</span>
                              <span className="font-semibold text-foreground mr-1.5">{act.target}</span>
                              {act.project && (
                                <span className="text-foreground-muted">
                                  in <span className="font-medium text-foreground">{act.project.name}</span>
                                </span>
                              )}
                            </p>
                          </div>
                          <span className="text-xs text-foreground-subtle shrink-0 font-mono">
                            {getTimeOnly(act.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div ref={loaderRef} className="py-6 flex justify-center">
            {isLoading && (
              <div className="flex items-center gap-2 text-foreground-subtle text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-foreground-muted border-t-accent" />
                Loading older activity...
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};
