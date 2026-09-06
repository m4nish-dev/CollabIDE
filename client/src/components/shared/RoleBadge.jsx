import React from "react";
import PropTypes from "prop-types";

export const RoleBadge = ({ role, className = "" }) => {
  const getRoleStyles = () => {
    switch (role?.toLowerCase()) {
      case "owner":
        return "bg-violet-500/10 text-violet-400 border-violet-500/30 shadow-[0_0_10px_rgba(139,92,246,0.1)]";
      case "admin":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]";
      case "editor":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
      case "viewer":
      default:
        return "bg-neutral-500/10 text-neutral-400 border-neutral-500/30 shadow-[0_0_10px_rgba(163,163,163,0.1)]";
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-medium border ${getRoleStyles()} ${className}`}
    >
      {role}
    </span>
  );
};

RoleBadge.propTypes = {
  role: PropTypes.string.isRequired,
  className: PropTypes.string,
};
