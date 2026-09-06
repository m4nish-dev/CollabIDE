import React, { useState } from "react";
import { SettingsLayout } from "@/components/layout/SettingsLayout";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, KeyRound, AlertTriangle } from "lucide-react";
import { toast } from "@/lib/toast";

export const AccountSettings = () => {
  const { account } = useSettingsStore();

  // Modals state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Forms state
  const [newEmail, setNewEmail] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleEmailChangeSubmit = () => {
    if (newEmail.includes("@")) {
      toast.success("Verification link sent to new email address.");
      setIsEmailModalOpen(false);
      setNewEmail("");
    } else {
      toast.error("Please enter a valid email.");
    }
  };

  const handlePasswordSubmit = () => {
    toast.success("Password updated successfully.");
    setIsPasswordModalOpen(false);
  };

  const handleDeleteSubmit = () => {
    if (deleteConfirmText === "delete my account") {
      toast.error("Account deleted. Logging out...");
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <SettingsLayout 
      title="Account Settings" 
      description="Manage your account security and email preferences."
    >
      <div className="space-y-8">
        
        {/* Email Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
            Email Address
          </h3>
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background-elevated">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded bg-accent/10 text-accent">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{account.email}</p>
                <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                  Primary email (Verified)
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsEmailModalOpen(true)}
              className="h-8 text-xs bg-background hover:bg-background-hover"
            >
              Change Email
            </Button>
          </div>
        </div>

        {/* Password Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
            Password
          </h3>
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background-elevated">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded bg-foreground-muted/10 text-foreground-muted">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Password authentication</p>
                <p className="text-xs text-foreground-subtle mt-1">
                  You are using password-based login for this account.
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsPasswordModalOpen(true)}
              className="h-8 text-xs bg-background hover:bg-background-hover"
            >
              Change Password
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-12 space-y-4">
          <h3 className="text-sm font-semibold text-red-400 border-b border-red-500/20 pb-2">
            Danger Zone
          </h3>
          <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Delete account</h4>
                <p className="text-xs text-foreground-subtle mt-1">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <Button 
                onClick={() => setIsDeleteModalOpen(true)}
                variant="destructive" 
                className="shrink-0 h-9 bg-red-500 hover:bg-red-600 text-white border-transparent"
              >
                Delete account
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* Email Modal */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="sm:max-w-md bg-background-elevated border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Change Email Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs text-foreground-subtle">New Email Address</label>
              <Input 
                type="email" 
                placeholder="new@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="bg-background"
              />
            </div>
            <p className="text-[11px] text-foreground-muted">
              We will send a verification link to this new email address. Your email won't change until you verify it.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>Cancel</Button>
              <Button onClick={handleEmailChangeSubmit} className="bg-accent text-white hover:bg-accent-hover">Send Verification</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md bg-background-elevated border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs text-foreground-subtle">Current Password</label>
              <Input type="password" placeholder="••••••••" className="bg-background" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-foreground-subtle">New Password</label>
              <Input type="password" placeholder="••••••••" className="bg-background" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-foreground-subtle">Confirm New Password</label>
              <Input type="password" placeholder="••••••••" className="bg-background" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>Cancel</Button>
              <Button onClick={handlePasswordSubmit} className="bg-accent text-white hover:bg-accent-hover">Update Password</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md bg-background-elevated border-red-500/30 text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-foreground">
              This will permanently delete your account, including all personal data, workspaces, and projects you own.
            </p>
            <div className="p-3 bg-red-500/10 rounded-md border border-red-500/20 text-xs text-red-200">
              <span className="font-semibold text-red-400">Warning:</span> This action is irreversible.
            </div>
            <div className="space-y-2">
              <label className="text-xs text-foreground-subtle">
                Please type <strong className="text-foreground select-none">delete my account</strong> to confirm.
              </label>
              <Input 
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="delete my account"
                className="bg-background border-red-500/30 focus:border-red-500 focus:ring-red-500/20" 
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => {
                setIsDeleteModalOpen(false);
                setDeleteConfirmText("");
              }}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteSubmit} 
                disabled={deleteConfirmText !== "delete my account"}
                className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                Permanently Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </SettingsLayout>
  );
};
