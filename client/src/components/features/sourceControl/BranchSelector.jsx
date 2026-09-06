import React, { useState } from "react";
import { 
  GitBranch, 
  Search, 
  Check, 
  Cloud, 
  Plus, 
  Settings 
} from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CreateBranchModal } from "./CreateBranchModal";

export const BranchSelector = () => {
  const { currentBranch, branches, setCurrentBranch } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const localBranches = branches.filter((b) => b.type === "local");
  const remoteBranches = branches.filter((b) => b.type === "remote");

  const filterBranches = (branchList) => {
    if (!searchQuery) return branchList;
    return branchList.filter((b) => 
      b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredLocal = filterBranches(localBranches);
  const filteredRemote = filterBranches(remoteBranches);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors">
            <GitBranch className="h-3.5 w-3.5 text-accent" />
            <span className="truncate max-w-[120px]">{currentBranch}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64 p-0">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-foreground-subtle" />
              <Input
                placeholder="Search branches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-background border-border"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {filteredLocal.length > 0 && (
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[10px] text-foreground-subtle uppercase px-2 py-1.5 font-semibold">
                  Local Branches
                </DropdownMenuLabel>
                {filteredLocal.map((branch) => (
                  <DropdownMenuItem
                    key={branch.id}
                    onSelect={() => setCurrentBranch(branch.name)}
                    className="flex items-center justify-between px-2 py-1.5 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-xs text-foreground">
                      <GitBranch className="h-3.5 w-3.5 text-foreground-subtle" />
                      <span className="truncate max-w-[160px]">{branch.name}</span>
                    </div>
                    {currentBranch === branch.name && (
                      <Check className="h-3.5 w-3.5 text-accent" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            )}

            {filteredRemote.length > 0 && (
              <>
                {filteredLocal.length > 0 && <DropdownMenuSeparator />}
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-[10px] text-foreground-subtle uppercase px-2 py-1.5 font-semibold">
                    Remote Branches
                  </DropdownMenuLabel>
                  {filteredRemote.map((branch) => (
                    <DropdownMenuItem
                      key={branch.id}
                      onSelect={() => setCurrentBranch(branch.name)}
                      className="flex items-center justify-between px-2 py-1.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-xs text-foreground">
                        <Cloud className="h-3.5 w-3.5 text-foreground-subtle" />
                        <span className="truncate max-w-[160px]">{branch.name}</span>
                      </div>
                      {currentBranch === branch.name && (
                        <Check className="h-3.5 w-3.5 text-accent" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </>
            )}

            {filteredLocal.length === 0 && filteredRemote.length === 0 && (
              <div className="px-3 py-4 text-center text-xs text-foreground-muted">
                No branches found
              </div>
            )}
          </div>

          <DropdownMenuSeparator />
          
          <div className="p-1">
            <DropdownMenuItem 
              onSelect={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 text-xs cursor-pointer py-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Create new branch
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 text-xs cursor-pointer py-1.5">
              <Settings className="h-3.5 w-3.5" />
              Manage branches...
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateBranchModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </>
  );
};
