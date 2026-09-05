import React from "react";
import { motion } from "framer-motion";
import { FolderGit2, Users, Play, HardDrive, TrendingUp } from "lucide-react";

export const StatsStrip = ({
  totalProjects = 12,
  activeCollaborators = 8,
  runsThisWeek = 47,
  storageUsedMB = 340,
  storageLimitMB = 1024,
}) => {
  const storagePercent = Math.min(
    100,
    Math.round((storageUsedMB / storageLimitMB) * 100),
  );

  const stats = [
    {
      id: "projects",
      label: "Total Projects",
      value: totalProjects.toString(),
      icon: FolderGit2,
      detail: "Across 3 workspaces",
    },
    {
      id: "collaborators",
      label: "Active Collaborators",
      value: activeCollaborators.toString(),
      icon: Users,
      detail: "5 online right now",
    },
    {
      id: "runs",
      label: "Runs This Week",
      value: runsThisWeek.toString(),
      icon: Play,
      badge: {
        text: "+18% from last week",
        icon: TrendingUp,
      },
    },
    {
      id: "storage",
      label: "Storage Used",
      value: `${storageUsedMB} MB / ${(storageLimitMB / 1024).toFixed(0)} GB`,
      icon: HardDrive,
      progress: storagePercent,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.04, duration: 0.3 }}
            className="flex flex-col justify-between rounded-xl border border-border bg-background-elevated/40 p-4 transition-colors hover:border-border-strong"
          >
            <div className="flex items-center justify-between text-foreground-muted mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">
                {stat.label}
              </span>
              <Icon size={15} className="text-foreground-subtle" />
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <div className="text-2xl font-bold tracking-tight text-foreground font-mono">
                {stat.value}
              </div>

              {stat.badge && (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success border border-success/20">
                  <stat.badge.icon size={11} />
                  {stat.badge.text}
                </span>
              )}
            </div>

            <div className="mt-2.5">
              {stat.progress !== undefined ? (
                <div>
                  <div className="flex items-center justify-between text-[11px] text-foreground-subtle mb-1">
                    <span>Usage</span>
                    <span>{stat.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-background-hover overflow-hidden border border-border/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-[#22D3EE] transition-all duration-500"
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-foreground-subtle">
                  {stat.detail}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
