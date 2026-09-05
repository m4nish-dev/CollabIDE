import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const RemoteCursor = ({ collaborator }) => {
  const [showLabel, setShowLabel] = useState(true);

  // Approximate pixel conversion for the mock Monaco editor 
  // (Assuming standard 19px line height, 8px char width, starting from a base offset)
  const xOffset = (collaborator.cursorPosition.col - 1) * 8 + 48; // 48px for line numbers
  const yOffset = (collaborator.cursorPosition.line - 1) * 19;

  useEffect(() => {
    setShowLabel(true);
    const timer = setTimeout(() => {
      setShowLabel(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [collaborator.cursorPosition]);

  return (
    <motion.div
      initial={false}
      animate={{ x: xOffset, y: yOffset }}
      transition={{ type: "tween", ease: "linear", duration: 0.12 }}
      className="absolute top-0 left-0 pointer-events-none z-40"
      style={{ width: "2px", height: "19px" }}
    >
      <div 
        className="w-full h-full"
        style={{ backgroundColor: collaborator.color }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showLabel ? 1 : 0 }}
        className="absolute bottom-full left-0 mb-1 px-1.5 py-0.5 rounded text-[10px] font-medium text-white whitespace-nowrap shadow-sm"
        style={{ 
          backgroundColor: collaborator.color,
          borderBottomLeftRadius: 0
        }}
      >
        {collaborator.name}
      </motion.div>
    </motion.div>
  );
};
