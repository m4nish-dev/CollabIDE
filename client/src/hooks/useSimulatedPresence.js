import { useEffect, useRef } from "react";
import { useCollaborationStore } from "@/store/useCollaborationStore";

const FILES = ["src/App.jsx", "src/components/Header.jsx", "src/index.css", "package.json"];

export function useSimulatedPresence() {
  const {
    collaborators,
    updateCollaboratorCursor,
    updateCollaboratorFile,
    updateCollaboratorStatus,
    updateCollaboratorSelection,
    setConnectionStatus,
    addJoinNotification,
  } = useCollaborationStore();

  const collabsRef = useRef(collaborators);

  useEffect(() => {
    collabsRef.current = collaborators;
  }, [collaborators]);

  // Main simulation loop for cursor/file/idle changes
  useEffect(() => {
    const interval = setInterval(() => {
      const currentCollabs = collabsRef.current;
      const onlineCollabs = currentCollabs.filter(c => c.status !== "offline");
      
      if (onlineCollabs.length === 0) return;

      // Pick a random online collaborator to act
      const actor = onlineCollabs[Math.floor(Math.random() * onlineCollabs.length)];
      const r = Math.random();

      if (r < 0.1) {
        // 10% chance to change file
        const newFile = FILES[Math.floor(Math.random() * FILES.length)];
        updateCollaboratorFile(actor.id, newFile);
      } else if (r < 0.2) {
        // 10% chance to toggle idle/online
        updateCollaboratorStatus(actor.id, actor.status === "idle" ? "online" : "idle");
      } else if (r < 0.8) {
        // 60% chance to move cursor and optionally select
        const newLine = Math.max(1, actor.cursorPosition.line + Math.floor(Math.random() * 5) - 2);
        const newCol = Math.max(1, actor.cursorPosition.col + Math.floor(Math.random() * 10) - 5);
        updateCollaboratorCursor(actor.id, { line: newLine, col: newCol });
        
        // Sometimes create a selection
        if (Math.random() < 0.3) {
          updateCollaboratorSelection(actor.id, {
            startLine: newLine,
            startCol: Math.max(1, newCol - Math.floor(Math.random() * 10)),
            endLine: newLine,
            endCol: newCol,
          });
        } else {
          updateCollaboratorSelection(actor.id, null);
        }
      }
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, [updateCollaboratorFile, updateCollaboratorStatus, updateCollaboratorCursor, updateCollaboratorSelection]);

  // Offline/Online simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      const currentCollabs = collabsRef.current;
      const onlineCollabs = currentCollabs.filter(c => c.status !== "offline");
      
      if (onlineCollabs.length > 0) {
        // take one offline
        const actor = onlineCollabs[Math.floor(Math.random() * onlineCollabs.length)];
        updateCollaboratorStatus(actor.id, "offline");
        
        // bring them back online after 5 seconds
        setTimeout(() => {
          updateCollaboratorStatus(actor.id, "online");
          addJoinNotification(`${actor.name} joined the session`, actor.avatar);
        }, 5000);
      }
    }, 15000); // every 15 seconds

    return () => clearInterval(interval);
  }, [updateCollaboratorStatus, addJoinNotification]);

  // Connection drop simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus("Reconnecting...");
      setTimeout(() => {
        setConnectionStatus("Connected");
      }, 2000);
    }, 45000); // every 45 seconds

    return () => clearInterval(interval);
  }, [setConnectionStatus]);
}
