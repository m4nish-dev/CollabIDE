import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Search, MoreVertical, Shield, Clock, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCollaborationStore } from "@/store/useCollaborationStore";
import { RoleBadge } from "@/components/shared/RoleBadge";

export const PermissionsTable = () => {
  const { collaborators } = useCollaborationStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Owners", "Admins", "Editors", "Viewers"];

  const filteredMembers = collaborators.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      activeFilter === "All" || c.role.toLowerCase() === activeFilter.toLowerCase().slice(0, -1);
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header & Controls */}
      <div className="p-6 border-b border-border space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Workspace Members
          </h2>
          <p className="text-sm text-foreground-muted">
            Manage who has access to this workspace and their roles.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground-subtle" />
            <Input
              type="text"
              placeholder="Search members by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm bg-background-elevated border-border"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeFilter === filter
                    ? "bg-accent text-white"
                    : "bg-background-elevated text-foreground-muted hover:text-foreground hover:bg-background-hover border border-border"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-foreground-subtle uppercase bg-background-elevated sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 font-medium">Member</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Joined</th>
              <th className="px-6 py-3 font-medium">Last Active</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="bg-background hover:bg-background-hover/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-10 w-10 rounded-full object-cover border border-border bg-background-elevated"
                        />
                        <span
                          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background"
                          style={{
                            backgroundColor:
                              member.online ? "#10B981" : "#F59E0B",
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {member.name}
                        </div>
                        <div className="text-xs text-foreground-muted">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {member.role === "Owner" ? (
                      <RoleBadge role="Owner" />
                    ) : (
                      <div className="flex items-center">
                        <Shield className="h-3.5 w-3.5 text-foreground-subtle mr-1.5" />
                        <select
                          defaultValue={member.role}
                          className="bg-transparent text-sm text-foreground focus:outline-none cursor-pointer p-1 -ml-1 rounded hover:bg-background-elevated transition-colors"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Editor">Editor</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-foreground-muted text-xs">
                      <CalendarDays className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                      {new Date(member.joinedDate).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-foreground-muted text-xs">
                      <Clock className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                      {member.online
                        ? "Active now"
                        : formatDistanceToNow(new Date(member.lastActive), {
                            addSuffix: true,
                          })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-md text-foreground-subtle hover:text-foreground hover:bg-background-elevated opacity-0 group-hover:opacity-100 transition-all focus:opacity-100">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        {member.role !== "Owner" && (
                          <DropdownMenuItem>Change role</DropdownMenuItem>
                        )}
                        <DropdownMenuItem>Resend invite</DropdownMenuItem>
                        {member.role !== "Owner" && (
                          <DropdownMenuItem className="text-red-400 focus:text-red-500 focus:bg-red-500/10">
                            Remove member
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-foreground-muted">
                  No members found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
