import React, { useState } from "react";
import { SettingsLayout } from "@/components/layout/SettingsLayout";
import { useCollaborationStore } from "@/store/useCollaborationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { MoreVertical, Search, UserPlus, Users } from "lucide-react";
import { toast } from "@/lib/toast";

export const WorkspaceMembersSettings = () => {
  const { collaborators } = useCollaborationStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = collaborators.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveMember = (name) => {
    toast.success(`${name} has been removed from the workspace.`);
  };

  return (
    <SettingsLayout 
      title="Workspace Members" 
      description={`Manage who has access to this workspace. (${collaborators.length} members)`}
    >
      <div className="space-y-6">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
            <Input 
              placeholder="Search members by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background-elevated h-10"
            />
          </div>
          <Button 
            className="w-full sm:w-auto h-10 gap-2 bg-accent hover:bg-accent-hover text-white shrink-0"
          >
            <UserPlus className="h-4 w-4" /> Invite Members
          </Button>
        </div>

        {/* Members List */}
        <div className="border border-border rounded-lg overflow-hidden bg-background">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-background-elevated/50 text-xs font-semibold text-foreground-subtle uppercase tracking-wider">
            <div className="col-span-6 sm:col-span-5">Member</div>
            <div className="col-span-3 hidden sm:block">Role</div>
            <div className="col-span-4 hidden md:block">Joined</div>
            <div className="col-span-6 sm:col-span-4 md:col-span-4 text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border/50">
            {filteredMembers.length === 0 ? (
              <div className="p-4 bg-background">
                <EmptyState 
                  icon={<Users className="h-8 w-8 text-foreground-muted" />}
                  title="No members found"
                  description={`No members match your search for "${searchQuery}".`}
                />
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div key={member.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-background-hover transition-colors group">
                  
                  {/* User Info */}
                  <div className="col-span-8 sm:col-span-5 flex items-center gap-3 min-w-0">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="h-9 w-9 rounded-full object-cover bg-background-elevated border border-border shrink-0" 
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{member.name}</div>
                      <div className="text-xs text-foreground-subtle truncate">{member.email}</div>
                    </div>
                  </div>

                  {/* Role (Mobile hidden, Desktop shows proper) */}
                  <div className="col-span-3 hidden sm:block">
                    {member.role === "Owner" ? (
                      <RoleBadge role="Owner" />
                    ) : (
                      <select
                        defaultValue={member.role}
                        className="bg-transparent text-sm text-foreground-muted hover:text-foreground cursor-pointer focus:outline-none py-1 -ml-1 px-1 rounded hover:bg-background border border-transparent focus:border-border"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    )}
                  </div>

                  {/* Joined Date */}
                  <div className="col-span-4 hidden md:block text-sm text-foreground-subtle">
                    {new Date(member.joinedDate || Date.now()).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>

                  {/* Actions */}
                  <div className="col-span-4 sm:col-span-4 md:col-span-3 flex justify-end items-center gap-2">
                    {member.role !== "Owner" && (
                      <>
                        {/* Mobile Role view since it's hidden on small screens */}
                        <div className="sm:hidden mr-2">
                          <select
                            defaultValue={member.role}
                            className="bg-transparent text-xs text-foreground-muted focus:outline-none"
                          >
                            <option value="Admin">Admin</option>
                            <option value="Editor">Editor</option>
                            <option value="Viewer">Viewer</option>
                          </select>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 rounded-md text-foreground-subtle hover:text-foreground hover:bg-background-elevated transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 border-border bg-background-elevated">
                            <DropdownMenuItem className="text-foreground">
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-foreground">
                              Copy Email
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-400 focus:text-red-500 focus:bg-red-500/10"
                              onClick={() => handleRemoveMember(member.name)}
                            >
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </SettingsLayout>
  );
};
