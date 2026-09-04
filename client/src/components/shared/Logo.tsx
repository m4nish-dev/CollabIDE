import React from 'react'

interface LogoProps {
  compact?: boolean
  className?: string
}

export const Logo: React.FC<LogoProps> = ({ compact = false, className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7C5CFF" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <path d="M9 18L3 12L9 6" stroke="url(#logo-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 6L21 12L15 18" stroke="url(#logo-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {!compact && (
        <span className="font-semibold text-[17px] tracking-tight text-foreground font-sans">
          CollabIDE
        </span>
      )}
    </div>
  )
}
