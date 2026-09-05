import React from "react";
import {
  Code2,
  Server,
  Layers,
  Flame,
  Zap,
  Cpu,
  Globe2,
  Terminal,
  Database,
  FileCode2,
  FolderGit2,
} from "lucide-react";

export const FrameworkIcon = ({ name, className = "", size = 24, style }) => {
  switch (name.toLowerCase()) {
    case "react":
      return (
        <svg
          width={size}
          height={size}
          viewBox="-11.5 -10.23174 23 20.46348"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={style}
        >
          <circle cx="0" cy="0" r="2.05" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );

    case "nextjs":
    case "next.js":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 180 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={style}
        >
          <mask
            id="mask0_next"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="180"
            height="180"
          >
            <circle cx="90" cy="90" r="90" fill="black" />
          </mask>
          <g mask="url(#mask0_next)">
            <circle
              cx="90"
              cy="90"
              r="90"
              fill="currentColor"
              fillOpacity="0.15"
            />
            <path
              d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
              fill="currentColor"
            />

            <rect x="115" y="54" width="12" height="72" fill="currentColor" />
          </g>
        </svg>
      );

    case "node":
    case "nodejs":
    case "node.js":
      return <Server size={size} className={className} style={style} />;
    case "express":
      return <Terminal size={size} className={className} style={style} />;
    case "python":
      return <Code2 size={size} className={className} style={style} />;
    case "django":
      return <Database size={size} className={className} style={style} />;
    case "html":
    case "vanilla":
      return <FileCode2 size={size} className={className} style={style} />;
    case "vue":
    case "vue 3":
      return <Layers size={size} className={className} style={style} />;
    case "svelte":
    case "sveltekit":
      return <Flame size={size} className={className} style={style} />;
    case "eleventy":
    case "static":
      return <Globe2 size={size} className={className} style={style} />;
    case "rust":
      return <Cpu size={size} className={className} style={style} />;
    case "go":
      return <Zap size={size} className={className} style={style} />;
    default:
      return <FolderGit2 size={size} className={className} style={style} />;
  }
};
