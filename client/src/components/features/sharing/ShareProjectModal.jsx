import React, { useState } from "react";
import {
  Check,
  Copy,
  Globe,
  Link as LinkIcon,
  Lock,
  Mail,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Users,
  X,
  HelpCircle,
  Eye,
  Settings2,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useProjectStore } from "@/store/useProjectStore";
import { useCollaborationStore } from "@/store/useCollaborationStore";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { toast } from "@/lib/toast";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

// ── Components ────────────────────────────────────────────────────────

const PermissionsMatrix = () => {
  const permissions = [
    { name: "View files", owner: true, admin: true, editor: true, viewer: true },
    { name: "Edit files", owner: true, admin: true, editor: true, viewer: false },
    { name: "Run code", owner: true, admin: true, editor: true, viewer: false },
    { name: "Use terminal", owner: true, admin: true, editor: false, viewer: false },
    { name: "Invite users", owner: true, admin: true, editor: false, viewer: false },
    { name: "Manage settings", owner: true, admin: true, editor: false, viewer: false },
    { name: "Delete project", owner: true, admin: false, editor: false, viewer: false },
  ];

  const renderIcon = (can) => {
    return can ? (
      <Check className="h-3 w-3 text-emerald-500 mx-auto" />
    ) : (
      <X className="h-3 w-3 text-red-500/50 mx-auto" />
    );
  };

  return (
    <div className="w-80">
      <div className="text-xs font-semibold mb-3 px-1 text-foreground">
        Role Permissions
      </div>
      <div className="grid grid-cols-5 gap-1 text-[10px] font-medium text-foreground-muted mb-2 border-b border-border pb-2 px-1">
        <div className="col-span-1">Action</div>
        <div className="text-center text-violet-400">Owner</div>
        <div className="text-center text-blue-400">Admin</div>
        <div className="text-center text-emerald-400">Editor</div>
        <div className="text-center text-neutral-400">Viewer</div>
      </div>
      <div className="space-y-1">
        {permissions.map((p, idx) => (
          <div
            key={idx}
            className="grid grid-cols-5 gap-1 text-[10px] items-center py-1.5 px-1 hover:bg-background-hover rounded"
          >
            <div className="col-span-1 text-foreground-subtle">{p.name}</div>
            <div className="text-center">{renderIcon(p.owner)}</div>
            <div className="text-center">{renderIcon(p.admin)}</div>
            <div className="text-center">{renderIcon(p.editor)}</div>
            <div className="text-center">{renderIcon(p.viewer)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ShareProjectModal = ({ isOpen, onClose }) => {
  const { projectName } = useProjectStore();
  const { collaborators } = useCollaborationStore();
  const [activeTab, setActiveTab] = useState("invite");

  // Invite Tab State
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState([]);
  const [selectedRole, setSelectedRole] = useState("Editor");

  // General Tab State
  const [linkAccess, setLinkAccess] = useState("restricted"); // restricted, view, edit
  const [isCopied, setIsCopied] = useState(false);

  // Advanced Tab State
  const [guestRunCode, setGuestRunCode] = useState(false);
  const [requireEmail, setRequireEmail] = useState(true);
  const [expiration, setExpiration] = useState("never");
  const [passwordProtect, setPasswordProtect] = useState(false);
  const [password, setPassword] = useState("");

  const shareUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = emailInput.trim();
      if (val && !emails.includes(val) && val.includes("@")) {
        setEmails([...emails, val]);
        setEmailInput("");
      }
    } else if (e.key === "Backspace" && !emailInput && emails.length > 0) {
      setEmails(emails.slice(0, -1));
    }
  };

  const removeEmail = (email) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const handleInvite = () => {
    if (emails.length === 0 && emailInput.trim() === "") return;

    let finalEmails = [...emails];
    if (emailInput.trim() && emailInput.includes("@")) {
      finalEmails.push(emailInput.trim());
    }

    toast.success(`Invites sent to ${finalEmails.length} people as ${selectedRole}`);
    setEmails([]);
    setEmailInput("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-background-elevated/95 border-border shadow-2xl backdrop-blur-2xl p-0 text-foreground overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  Share "{projectName}"
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-foreground-muted hover:text-foreground transition-colors p-1 rounded hover:bg-background-hover">
                        <HelpCircle className="h-3.5 w-3.5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="right"
                      align="start"
                      className="bg-background-overlay border-border p-3 shadow-xl"
                    >
                      <PermissionsMatrix />
                    </PopoverContent>
                  </Popover>
                </DialogTitle>
                <p className="text-xs text-foreground-muted mt-0.5">
                  Manage access and permissions for your team
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-foreground-subtle hover:text-foreground p-1.5 rounded-md hover:bg-background-hover transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 mt-6 border-b border-border">
            {[
              { id: "invite", label: "Invite people" },
              { id: "general", label: "General access" },
              { id: "advanced", label: "Advanced" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-xs font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-foreground-muted hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="share-tab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                  />
                )}
              </button>
            ))}
          </div>
        </DialogHeader>

        <div className="p-6 min-h-[340px]">
          <AnimatePresence mode="wait">
            {activeTab === "invite" && (
              <motion.div
                key="invite"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 bg-background border border-border rounded-lg min-h-[40px] p-1.5 flex flex-wrap gap-1.5 focus-within:ring-1 focus-within:ring-accent focus-within:border-accent transition-all">
                    {emails.map((email) => (
                      <div
                        key={email}
                        className="bg-accent/15 text-accent border border-accent/20 rounded flex items-center px-2 py-1 text-xs"
                      >
                        {email}
                        <button
                          onClick={() => removeEmail(email)}
                          className="ml-1.5 hover:text-accent-hover focus:outline-none"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      placeholder={
                        emails.length === 0 ? "Add email addresses..." : ""
                      }
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={handleEmailKeyDown}
                      className="flex-1 min-w-[120px] bg-transparent text-xs text-foreground px-2 py-1 outline-none placeholder:text-foreground-subtle"
                    />
                  </div>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="h-10 px-3 text-xs bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                  <Button
                    onClick={handleInvite}
                    disabled={emails.length === 0 && emailInput.trim() === ""}
                    className="h-10 px-4 bg-accent hover:bg-accent-hover text-white text-xs font-medium"
                  >
                    Send invites
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider">
                    Current Members ({collaborators.length})
                  </h4>
                  <div className="max-h-[200px] overflow-y-auto space-y-1 pr-2 no-scrollbar">
                    {collaborators.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-background-hover transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="h-8 w-8 rounded-full bg-background-elevated object-cover border border-border"
                          />
                          <div>
                            <div className="text-xs font-medium text-foreground flex items-center gap-1.5">
                              {c.name}
                            </div>
                            <div className="text-[10px] text-foreground-subtle">
                              {c.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {c.role === "Owner" ? (
                            <RoleBadge role="Owner" />
                          ) : (
                            <div className="flex items-center gap-1">
                              <select
                                defaultValue={c.role}
                                className="bg-transparent text-xs text-foreground-muted hover:text-foreground cursor-pointer focus:outline-none py-1 px-2 rounded hover:bg-background"
                              >
                                <option value="Admin">Admin</option>
                                <option value="Editor">Editor</option>
                                <option value="Viewer">Viewer</option>
                              </select>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-1 rounded text-foreground-subtle hover:text-foreground hover:bg-background opacity-0 group-hover:opacity-100 transition-all">
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-32">
                                  <DropdownMenuItem className="text-red-400 focus:text-red-500 focus:bg-red-500/10">
                                    Remove access
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "general" && (
              <motion.div
                key="general"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider">
                    Link Access
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        id: "restricted",
                        title: "Restricted",
                        desc: "Only invited people can access this project",
                        icon: Lock,
                      },
                      {
                        id: "view",
                        title: "Anyone with the link — View only",
                        desc: "Anyone on the internet with the link can view",
                        icon: Eye,
                      },
                      {
                        id: "edit",
                        title: "Anyone with the link — Can edit",
                        desc: "Anyone on the internet with the link can edit",
                        icon: Globe,
                      },
                    ].map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => setLinkAccess(opt.id)}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          linkAccess === opt.id
                            ? "bg-accent/5 border-accent"
                            : "bg-background border-border hover:border-accent/50"
                        }`}
                      >
                        <div
                          className={`mt-0.5 rounded-full p-1.5 ${
                            linkAccess === opt.id
                              ? "bg-accent text-white"
                              : "bg-background-elevated text-foreground-muted"
                          }`}
                        >
                          <opt.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div
                            className={`text-sm font-medium ${
                              linkAccess === opt.id
                                ? "text-foreground"
                                : "text-foreground-muted"
                            }`}
                          >
                            {opt.title}
                          </div>
                          <div className="text-xs text-foreground-subtle mt-0.5">
                            {opt.desc}
                          </div>
                        </div>
                        {linkAccess === opt.id && (
                          <Check className="h-4 w-4 text-accent mt-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 bg-background p-1.5 rounded-lg border border-border">
                    <div className="flex items-center justify-center pl-3">
                      <LinkIcon className="h-4 w-4 text-foreground-subtle" />
                    </div>
                    <input
                      readOnly
                      value={shareUrl}
                      className="flex-1 bg-transparent text-xs text-foreground-muted px-2 py-2 outline-none font-mono"
                    />
                    <Button
                      onClick={handleCopyLink}
                      variant="secondary"
                      className="h-8 px-3 text-xs border border-border hover:border-accent hover:bg-background-elevated transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 mr-1.5 text-success" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 mr-1.5" />
                          Copy link
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "advanced" && (
              <motion.div
                key="advanced"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-blue-500/10 text-blue-400">
                        <Settings2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          Allow guests to run code
                        </div>
                        <div className="text-xs text-foreground-subtle">
                          Let unauthenticated users execute code in the sandbox
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={guestRunCode}
                      onCheckedChange={setGuestRunCode}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          Require email verification
                        </div>
                        <div className="text-xs text-foreground-subtle">
                          Users must verify their email before joining
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={requireEmail}
                      onCheckedChange={setRequireEmail}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-amber-500/10 text-amber-400">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          Session expiration
                        </div>
                        <div className="text-xs text-foreground-subtle">
                          Force re-authentication after a period
                        </div>
                      </div>
                    </div>
                    <select
                      value={expiration}
                      onChange={(e) => setExpiration(e.target.value)}
                      className="h-8 px-2 text-xs bg-background-elevated border border-border rounded text-foreground focus:outline-none focus:border-accent cursor-pointer"
                    >
                      <option value="never">Never</option>
                      <option value="1day">1 Day</option>
                      <option value="7days">7 Days</option>
                      <option value="30days">30 Days</option>
                    </select>
                  </div>

                  <div className="border border-border rounded-lg bg-background overflow-hidden">
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-red-500/10 text-red-400">
                          <ShieldAlert className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            Password protect this link
                          </div>
                          <div className="text-xs text-foreground-subtle">
                            Require a password to access the project
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={passwordProtect}
                        onCheckedChange={setPasswordProtect}
                      />
                    </div>
                    {passwordProtect && (
                      <div className="p-3 pt-0 border-t border-border mt-3 bg-background-elevated/50 flex gap-2 items-center">
                        <Lock className="h-4 w-4 text-foreground-muted ml-1" />
                        <Input
                          type="password"
                          placeholder="Enter a secure password..."
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="flex-1 h-8 text-xs bg-background"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

ShareProjectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
