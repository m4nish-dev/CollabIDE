import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import "@/lib/mockData";
import { LANG_CONFIG } from "@/lib/langConfig";
import { Button } from "@/components/ui/button";

export const RecentProjects = ({ projects }) => {
  const navigate = useNavigate();
  const recents = projects.slice(0, 4);

  if (recents.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-accent" />
          <h2 className="text-sm font-semibold text-foreground tracking-tight">
            Recent Projects
          </h2>
        </div>
        <span className="text-xs text-foreground-subtle">Last 4 accessed</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {recents.map((project, idx) => {
          const lang = LANG_CONFIG[project.language];
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.04, duration: 0.3 }}
              onClick={() => navigate(`/project/${project.id}`)}
              className="group relative flex flex-col justify-between rounded-xl border border-border bg-background-elevated/70 p-3.5 cursor-pointer transition-all duration-200 hover:border-accent/40 hover:bg-background-elevated hover:shadow-[0_4px_20px_rgba(124,92,255,0.08)]"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold shrink-0"
                    style={{ color: lang.color, background: lang.bg }}
                  >
                    {lang.label}
                  </span>
                  <span className="text-sm font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                    {project.name}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-foreground-subtle hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/project/${project.id}`);
                  }}
                  title="Open Project"
                >
                  <ExternalLink size={13} />
                </Button>
              </div>

              <p className="text-xs text-foreground-muted line-clamp-1 mb-3">
                {project.description}
              </p>

              <div className="flex items-center justify-between text-[11px] text-foreground-subtle pt-2 border-t border-border/60">
                <span>
                  {formatDistanceToNow(new Date(project.updatedAt), {
                    addSuffix: true,
                  })}
                </span>
                <span className="flex items-center gap-1 text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <ArrowRight size={11} />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
