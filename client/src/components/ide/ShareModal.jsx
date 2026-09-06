import React, { useState } from "react";
import { Check, Copy, Globe, Mail, UserPlus, Users, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProjectStore } from "@/store/useProjectStore";
import { toast } from "@/lib/toast";

export const ShareModal = ({ isOpen, onClose }) => {
  const { projectName, collaborators } = useProjectStore();
  const [emailInput, setEmailInput] = useState("");
  const [selectedRole, setSelectedRole] = useState("Editor");
  const [isCopied, setIsCopied] = useState(false);
  const [isPublic] = useState(false);

  const shareUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    toast.success("Project invite link copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    toast.success(`Invite sent to ${emailInput.trim()} as ${selectedRole}`);
    setEmailInput("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-background-elevated/95 border-border shadow-2xl backdrop-blur-2xl p-6 text-foreground">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-semibold text-foreground">
                Share "{projectName}"
              </DialogTitle>
              <p className="text-xs text-foreground-muted">
                Invite teammates to collaborate in real-time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-foreground-subtle hover:text-foreground p-1 rounded-md transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Email Invite Form */}
          <form onSubmit={handleInvite} className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-foreground-subtle" />
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="pl-9 text-xs h-9 bg-background border-border focus-visible:ring-accent"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="h-9 px-2.5 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:border-accent"
            >
              <option value="Editor">Can Edit</option>
              <option value="Viewer">Can View</option>
            </select>
            <Button
              type="submit"
              size="sm"
              className="h-9 text-xs bg-accent hover:bg-accent-hover text-white"
            >
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              Invite
            </Button>
          </form>

          {/* Quick link sharing */}
          <div className="p-3 rounded-lg bg-background border border-border space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <Globe className="h-3.5 w-3.5 text-secondary" />
                <span>General Access</span>
              </div>
              <span className="text-[11px] text-foreground-subtle">
                {isPublic
                  ? "Anyone with link can view"
                  : "Only invited members"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 px-2.5 py-1.5 bg-background-elevated border border-border rounded-md text-[11px] font-mono text-foreground-muted truncate select-all">
                {shareUrl}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyLink}
                className="h-8 text-xs shrink-0 border-border hover:border-accent/40"
              >
                {isCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-success mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Current Collaborators */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
              Active Collaborators ({collaborators.length})
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {collaborators.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/60 hover:border-border transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="h-7 w-7 rounded-full object-cover border"
                        style={{ borderColor: c.color }}
                      />

                      <span
                        className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-background"
                        style={{
                          backgroundColor:
                            c.status === "online" ? "#10B981" : "#F59E0B",
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        {c.name}
                        {c.role === "Owner" && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-accent/20 text-accent rounded font-medium">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-foreground-subtle flex items-center gap-1">
                        <span
                          className="inline-block h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: c.color }}
                        />
                        <span>Editing {c.activeFile.split("/").pop()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-foreground-muted px-2 py-0.5 rounded bg-background border border-border">
                      {c.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
