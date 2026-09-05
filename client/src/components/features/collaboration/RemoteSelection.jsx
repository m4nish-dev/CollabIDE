import React from "react";
import { motion } from "framer-motion";

export const RemoteSelection = ({ selection, color }) => {
  if (!selection) return null;

  const { startLine, startCol, endLine, endCol } = selection;
  const isMultiLine = startLine !== endLine;

  const charWidth = 8;
  const lineHeight = 19;
  const lineNumWidth = 48;

  if (!isMultiLine) {
    const x = (startCol - 1) * charWidth + lineNumWidth;
    const y = (startLine - 1) * lineHeight;
    const width = Math.max((endCol - startCol) * charWidth, 4);

    return (
      <motion.div
        initial={false}
        animate={{ x, y, width }}
        transition={{ type: "tween", ease: "linear", duration: 0.12 }}
        className="absolute top-0 left-0 pointer-events-none z-30"
        style={{
          height: `${lineHeight}px`,
          backgroundColor: color,
          opacity: 0.25,
        }}
      />
    );
  }

  // Very rudimentary multiline mock. In a real editor, this spans across lines accurately.
  return (
    <>
      {/* First line */}
      <div
        className="absolute top-0 left-0 pointer-events-none z-30"
        style={{
          transform: `translate(${(startCol - 1) * charWidth + lineNumWidth}px, ${(startLine - 1) * lineHeight}px)`,
          height: `${lineHeight}px`,
          width: `100px`, // mock width to end of line
          backgroundColor: color,
          opacity: 0.25,
        }}
      />
      {/* Middle lines */}
      {endLine - startLine > 1 && (
        <div
          className="absolute top-0 left-0 pointer-events-none z-30"
          style={{
            transform: `translate(${lineNumWidth}px, ${startLine * lineHeight}px)`,
            height: `${(endLine - startLine - 1) * lineHeight}px`,
            width: `150px`, // mock width for full line
            backgroundColor: color,
            opacity: 0.25,
          }}
        />
      )}
      {/* Last line */}
      <div
        className="absolute top-0 left-0 pointer-events-none z-30"
        style={{
          transform: `translate(${lineNumWidth}px, ${(endLine - 1) * lineHeight}px)`,
          height: `${lineHeight}px`,
          width: `${(endCol - 1) * charWidth}px`,
          backgroundColor: color,
          opacity: 0.25,
        }}
      />
    </>
  );
};
