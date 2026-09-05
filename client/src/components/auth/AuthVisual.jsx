import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

// ── Fake syntax-highlighted code lines ──────────────────────────
const CODE_LINES = [
  {
    tokens: [
      { t: "import ", c: "text-[#C792EA]" },
      { t: "React", c: "text-[#82AAFF]" },
      { t: " from ", c: "text-[#C792EA]" },
      { t: "'react'", c: "text-[#C3E88D]" },
    ],
  },
  {
    tokens: [
      { t: "import ", c: "text-[#C792EA]" },
      { t: "{ useCollabSession }", c: "text-[#82AAFF]" },
      { t: " from ", c: "text-[#C792EA]" },
      { t: "'@collabide/sdk'", c: "text-[#C3E88D]" },
    ],
  },
  { tokens: [] }, // blank
  {
    tokens: [
      { t: "export ", c: "text-[#C792EA]" },
      { t: "const ", c: "text-[#C792EA]" },
      { t: "Editor", c: "text-[#82AAFF]" },
      { t: " = () => {", c: "text-foreground-muted" },
    ],
  },
  {
    tokens: [
      { t: "  const ", c: "text-[#C792EA]" },
      { t: "{ cursors, doc }", c: "text-foreground" },
      { t: " = ", c: "text-foreground-muted" },
      { t: "useCollabSession", c: "text-[#82AAFF]" },
      { t: "()", c: "text-foreground-muted" },
    ],
  },
  {
    tokens: [
      { t: "  const ", c: "text-[#C792EA]" },
      { t: "[value, setValue]", c: "text-foreground" },
      { t: " = ", c: "text-foreground-muted" },
      { t: "useState", c: "text-[#82AAFF]" },
      { t: "(doc)", c: "text-foreground-muted" },
    ],
  },
  { tokens: [] }, // blank
  {
    tokens: [
      { t: "  return ", c: "text-[#C792EA]" },
      { t: "(", c: "text-foreground-muted" },
    ],
  },
  {
    tokens: [
      { t: "    <", c: "text-[#89DDFF]" },
      { t: "MonacoEditor", c: "text-[#F07178]" },
      { t: " value", c: "text-[#82AAFF]" },
      { t: "={value}", c: "text-foreground-muted" },
      { t: " />", c: "text-[#89DDFF]" },
    ],
  },
  { tokens: [{ t: "  )", c: "text-foreground-muted" }] },
  { tokens: [{ t: "}", c: "text-foreground-muted" }] },
];

// ── Animated cursors ─────────────────────────────────────────────
const CURSORS = [
  { name: "Rohit", color: "#7C5CFF", lineStart: 4, lineEnd: 5, delay: 0 },
  { name: "Priya", color: "#22D3EE", lineStart: 7, lineEnd: 8, delay: 1.2 },
  { name: "Arjun", color: "#EC4899", lineStart: 1, lineEnd: 2, delay: 0.6 },
];

// ── Floating chips ───────────────────────────────────────────────
const CHIPS = [
  {
    name: "RC",
    label: "editing App.jsx",
    color: "#7C5CFF",
    top: "18%",
    left: "60%",
    delay: 0,
  },
  {
    name: "PA",
    label: "viewing Header.jsx",
    color: "#22D3EE",
    top: "55%",
    left: "68%",
    delay: 0.8,
  },
  {
    name: "AK",
    label: "reviewing types",
    color: "#EC4899",
    top: "75%",
    left: "52%",
    delay: 1.6,
  },
];

const FloatingChip = ({ name, label, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: [0, -6, 0] }}
    transition={{
      opacity: { delay, duration: 0.4 },
      y: { delay, duration: 4, repeat: Infinity, ease: "easeInOut" },
    }}
    className="absolute flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium text-white shadow-lg backdrop-blur-sm border border-white/10"
    style={{ background: `${color}22`, borderColor: `${color}44` }}
  >
    <span
      className="flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold"
      style={{ background: color }}
    >
      {name}
    </span>
    {label}
  </motion.div>
);

const CursorLine = ({ cursor, lineIdx }) => {
  const controls = useAnimation();
  const isActive = lineIdx >= cursor.lineStart && lineIdx <= cursor.lineEnd;

  useEffect(() => {
    if (isActive) {
      controls.start({
        opacity: [0, 1, 1, 0],
        transition: {
          duration: 2,
          delay: cursor.delay,
          repeat: Infinity,
          repeatDelay: 3,
        },
      });
    }
  }, [controls, isActive, cursor.delay]);

  if (!isActive) return null;
  return (
    <motion.span
      animate={controls}
      className="inline-flex items-center"
      style={{ color: cursor.color }}
    >
      <span
        className="relative inline-block w-0.5 h-3.5 rounded-sm mr-0.5"
        style={{ background: cursor.color }}
      >
        <span
          className="absolute -top-4 left-0 whitespace-nowrap rounded px-1 py-0.5 text-[9px] font-semibold text-white"
          style={{ background: cursor.color, fontSize: "9px" }}
        >
          {cursor.name}
        </span>
      </span>
    </motion.span>
  );
};

// ── Ambient blobs ────────────────────────────────────────────────
const Blob = ({ color, style, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={{ background: color, ...style }}
    animate={{ scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, -15, 0] }}
    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

// ── Main component ───────────────────────────────────────────────
export const AuthVisual = () => {
  const [typedLines, setTypedLines] = useState(3);

  useEffect(() => {
    const id = setInterval(() => {
      setTypedLines((prev) => (prev < CODE_LINES.length ? prev + 1 : prev));
    }, 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#0D0B1A]">
      {/* Ambient gradient blobs */}
      <Blob
        color="#7C5CFF"
        style={{ width: 340, height: 340, top: "5%", left: "10%" }}
        delay={0}
      />
      <Blob
        color="#22D3EE"
        style={{ width: 280, height: 280, bottom: "10%", right: "5%" }}
        delay={2}
      />
      <Blob
        color="#EC4899"
        style={{ width: 200, height: 200, top: "50%", left: "50%" }}
        delay={4}
      />

      {/* Noise grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating chips */}
      <div className="absolute inset-0 pointer-events-none">
        {CHIPS.map((chip) => (
          <div
            key={chip.name}
            style={{ position: "absolute", top: chip.top, left: chip.left }}
          >
            <FloatingChip
              name={chip.name}
              label={chip.label}
              color={chip.color}
              delay={chip.delay}
            />
          </div>
        ))}
      </div>

      {/* Editor card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-[420px] rounded-xl border border-white/10 bg-[#0F0F1A]/80 backdrop-blur-xl shadow-2xl overflow-hidden"
      >
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]/70" />
          <span className="ml-2 text-[11px] text-white/30 font-mono">
            Editor.jsx — CollabIDE
          </span>
        </div>

        {/* Code content */}
        <div className="px-4 py-4 font-mono text-[12px] leading-6 space-y-0.5 select-none">
          {/* Line numbers + code */}
          {CODE_LINES.slice(0, typedLines).map((line, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-4 text-right text-white/20 text-[10px] shrink-0">
                {i + 1}
              </span>
              <div className="flex items-center gap-0 flex-wrap">
                {line.tokens.map((tok, j) => (
                  <span key={j} className={tok.c}>
                    {tok.t}
                  </span>
                ))}
                {/* Cursors on this line */}
                {CURSORS.map((c) => (
                  <CursorLine key={c.name} cursor={c} lineIdx={i} />
                ))}
                {/* Blinking caret on last typed line */}
                {i === typedLines - 1 && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                    className="inline-block w-0.5 h-3.5 bg-white/60 rounded-sm"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-white/5 bg-white/[0.02]">
          <div className="flex -space-x-1">
            {CURSORS.map((c) => (
              <span
                key={c.name}
                className="flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold text-white ring-1 ring-[#0F0F1A]"
                style={{ background: c.color }}
              >
                {c.name[0]}
              </span>
            ))}
          </div>
          <span className="text-[11px] text-white/40">
            <span className="text-white/70 font-semibold">12,847</span>{" "}
            developers collaborating right now
          </span>
        </div>
      </motion.div>

      {/* Bottom tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-0 right-0 text-center text-xs text-white/30"
      >
        Real-time collaboration · Instant preview · AI-powered
      </motion.p>
    </div>
  );
};
