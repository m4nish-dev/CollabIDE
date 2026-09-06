import React, { useState } from "react";
import { SettingsLayout } from "@/components/layout/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, ArrowRightLeft, Trash2 } from "lucide-react";
import { toast } from "@/lib/toast";
import { useSettingsStore } from "@/store/useSettingsStore";

export const WorkspaceDangerSettings = () => {
  const { workspaceGeneral } = useSettingsStore();

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [transferUsername, setTransferUsername] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleTransfer = () => {
    if (transferUsername.trim()) {
      toast.success(`Ownership transfer request sent to ${transferUsername}`);
      setIsTransferModalOpen(false);
      setTransferUsername("");
    }
  };

  const handleDelete = () => {
    if (deleteConfirmText === workspaceGeneral.name) {
      toast.error(`Workspace '${workspaceGeneral.name}' deleted.`);
      setIsDeleteModalOpen(false);
      setDeleteConfirmText("");
    }
  };

  return (
    <SettingsLayout 
      title="Danger Zone" 
      description="Destructive actions that cannot be easily reversed."
    >
      <div className="space-y-6">
        
        {/* Transfer Ownership */}
        <div className="border border-red-500/20 rounded-xl overflow-hidden bg-background">
          <div className="p-5 border-b border-border bg-red-500/5">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-red-400" />
              Transfer Workspace Ownership
            </h3>
            <p className="text-sm text-foreground-subtle mt-1.5 max-w-2xl">
              Transfer this workspace to another user. You will lose owner privileges and become an admin. 
              The new owner must accept the transfer before it takes effect.
            </p>
          </div>
          <div className="p-5 bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm font-medium text-foreground">
              Current Owner: <span className="font-semibold text-accent">You</span>
            </div>
            <Button 
              variant="outline"
              onClick={() => setIsTransferModalOpen(true)}
              className="border-red-500/30 text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              Transfer Ownership
            </Button>
          </div>
        </div>

        {/* Delete Workspace */}
        <div className="border border-red-500/30 rounded-xl overflow-hidden bg-background">
          <div className="p-5 border-b border-red-500/20 bg-red-500/10">
            <h3 className="text-base font-semibold text-red-500 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Workspace
            </h3>
            <p className="text-sm text-foreground-subtle mt-1.5 max-w-2xl">
              Permanently delete this workspace, all of its projects, code, and settings. 
              This action <span className="font-semibold text-red-400">cannot</span> be undone.
            </p>
          </div>
          <div className="p-5 bg-background flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="space-y-2 max-w-md text-sm text-foreground-subtle">
              <p>Once you delete a workspace, there is no going back. Please be certain.</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>All projects will be deleted</li>
                <li>All workspace members will lose access</li>
                <li>Active subscriptions will be canceled</li>
              </ul>
            </div>
            <Button 
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(true)}
              className="bg-red-500 hover:bg-red-600 text-white border-transparent shrink-0"
            >
              Delete Workspace
            </Button>
          </div>
        </div>

      </div>

      {/* Transfer Modal */}
      <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
        <DialogContent className="sm:max-w-md bg-background-elevated border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Transfer Ownership</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-foreground-subtle">
              Please enter the username or email of the user you wish to transfer this workspace to.
            </p>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">New Owner</label>
              <Input 
                value={transferUsername}
                onChange={(e) => setTransferUsername(e.target.value)}
                placeholder="username or email"
                className="bg-background" 
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => {
                setIsTransferModalOpen(false);
                setTransferUsername("");
              }}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleTransfer} 
                disabled={!transferUsername.trim()}
                className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                Transfer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md bg-background-elevated border-red-500/30 text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              Delete Workspace
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-foreground">
              This will permanently delete the <strong className="text-accent">{workspaceGeneral.name}</strong> workspace and all of its data.
            </p>
            <div className="p-3 bg-red-500/10 rounded-md border border-red-500/20 text-xs text-red-200">
              <span className="font-semibold text-red-400">Warning:</span> This action is irreversible.
            </div>
            <div className="space-y-2">
              <label className="text-xs text-foreground-subtle">
                Please type <strong className="text-foreground select-none">{workspaceGeneral.name}</strong> to confirm.
              </label>
              <Input 
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={workspaceGeneral.name}
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
                onClick={handleDelete} 
                disabled={deleteConfirmText !== workspaceGeneral.name}
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
