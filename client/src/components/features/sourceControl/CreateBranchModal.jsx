import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { GitBranch, AlertCircle } from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { toast } from "@/lib/toast";
import PropTypes from "prop-types";

export const CreateBranchModal = ({ isOpen, onClose }) => {
  const { currentBranch, branches, createBranch } = useProjectStore();
  const [branchName, setBranchName] = useState("");
  const [baseBranch, setBaseBranch] = useState("");
  const [switchToBranch, setSwitchToBranch] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setBranchName("");
      setBaseBranch(currentBranch);
      setSwitchToBranch(true);
      setError("");
    }
  }, [isOpen, currentBranch]);

  const validateBranchName = (name) => {
    if (!name) return "Branch name is required";
    if (/\s/.test(name)) return "Branch name cannot contain spaces";
    if (/[~^:?*[\]\\]/.test(name)) return "Invalid characters in branch name";
    if (branches.some(b => b.name === name)) return "A branch with this name already exists";
    return "";
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setBranchName(val);
    if (error) setError(validateBranchName(val));
  };

  const handleCreate = () => {
    const validationError = validateBranchName(branchName);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    createBranch(branchName, switchToBranch);
    toast.success(`Branch '${branchName}' created successfully`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-background-elevated/95 border-border shadow-2xl backdrop-blur-2xl text-foreground">
        <DialogHeader className="flex flex-row items-center gap-3 pb-4 border-b border-border">
          <div className="h-10 w-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent shrink-0">
            <GitBranch className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle className="text-base font-semibold">Create new branch</DialogTitle>
            <p className="text-xs text-foreground-muted">
              Create a new branch to work on a feature or fix.
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground-subtle">
              Branch Name
            </label>
            <Input
              value={branchName}
              onChange={handleChange}
              placeholder="e.g. feature/new-login"
              className={`h-9 bg-background ${error ? "border-red-500 focus-visible:ring-red-500/20" : "border-border focus-visible:ring-accent"}`}
            />
            {error && (
              <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground-subtle">
              Based on
            </label>
            <select
              value={baseBranch}
              onChange={(e) => setBaseBranch(e.target.value)}
              className="w-full h-9 px-3 text-sm bg-background border border-border rounded-md text-foreground focus:outline-none focus:border-accent"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background mt-4">
            <div>
              <div className="text-sm font-medium text-foreground">
                Switch to new branch
              </div>
              <div className="text-xs text-foreground-subtle">
                Checkout this branch immediately
              </div>
            </div>
            <Switch
              checked={switchToBranch}
              onCheckedChange={setSwitchToBranch}
            />
          </div>
        </div>

        <DialogFooter className="border-t border-border pt-4">
          <Button variant="ghost" onClick={onClose} className="h-9 text-xs">
            Cancel
          </Button>
          <Button onClick={handleCreate} className="h-9 text-xs bg-accent hover:bg-accent-hover text-white">
            Create Branch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

CreateBranchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
