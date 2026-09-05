import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCollaborationStore } from "@/store/useCollaborationStore";

export const JoinNotification = () => {
  const { recentJoins, removeJoinNotification } = useCollaborationStore();

  useEffect(() => {
    if (recentJoins.length > 0) {
      const latest = recentJoins[recentJoins.length - 1];
      const timer = setTimeout(() => {
        removeJoinNotification(latest.id);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [recentJoins, removeJoinNotification]);

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {recentJoins.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex items-center gap-3 bg-background-elevated/95 backdrop-blur-md border border-border shadow-lg rounded-full py-1.5 pl-1.5 pr-4 pointer-events-auto"
          >
            <img
              src={notification.avatar}
              alt="Avatar"
              className="w-7 h-7 rounded-full object-cover border border-background"
            />
            <span className="text-xs font-medium text-foreground">
              {notification.message}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
