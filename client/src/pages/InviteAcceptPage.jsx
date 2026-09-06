import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Hexagon, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { toast } from "@/lib/toast";
import { motion } from "framer-motion";

export default function InviteAcceptPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  // Mock state to demonstrate logged-out vs logged-in experience
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Mock invite details based on token
  const inviteDetails = {
    workspaceName: "Acme Team",
    inviterName: "Priya Sharma",
    inviterAvatar: "https://i.pravatar.cc/150?u=priya",
    role: "Editor",
  };

  const handleAccept = () => {
    toast.success(`You've joined ${inviteDetails.workspaceName}!`);
    // Redirect to dashboard or project
    navigate("/dashboard");
  };

  const handleDecline = () => {
    toast.info("Invitation declined.");
    navigate("/login");
  };

  const handleSignIn = () => {
    // In a real app, this might redirect to login with a ?next=/invite/:token parameter
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0A0B] flex flex-col relative overflow-hidden text-foreground">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white">
            <Hexagon className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">CollabIDE</span>
        </div>
        
        {/* Toggle auth state for demonstration */}
        <button 
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className="ml-auto text-xs text-foreground-subtle underline hover:text-foreground"
        >
          Toggle auth state (Demo)
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-background-elevated/80 border border-border rounded-2xl p-8 shadow-2xl backdrop-blur-xl text-center"
        >
          <div className="mx-auto w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <Mail className="h-8 w-8 text-accent" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            You've been invited to join <span className="text-accent">{inviteDetails.workspaceName}</span>
          </h1>

          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-sm text-foreground-muted">By</span>
            <div className="flex items-center gap-1.5 bg-background px-2 py-1 rounded-full border border-border">
              <img
                src={inviteDetails.inviterAvatar}
                alt={inviteDetails.inviterName}
                className="w-5 h-5 rounded-full"
              />
              <span className="text-xs font-medium text-foreground">
                {inviteDetails.inviterName}
              </span>
            </div>
          </div>

          <div className="bg-background border border-border rounded-xl p-4 mb-8 flex flex-col items-center gap-3">
            <div className="text-xs text-foreground-muted uppercase tracking-wider font-semibold">
              Your Role
            </div>
            <RoleBadge role={inviteDetails.role} className="px-3 py-1 text-xs" />
            <p className="text-[11px] text-foreground-subtle mt-1 text-center max-w-[250px]">
              You will be able to edit files and collaborate in real-time, but cannot manage workspace settings.
            </p>
          </div>

          {isLoggedIn ? (
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleAccept}
                className="w-full h-11 bg-accent hover:bg-accent-hover text-white font-medium"
              >
                Accept invitation
              </Button>
              <Button
                onClick={handleDecline}
                variant="ghost"
                className="w-full h-11 text-foreground-muted hover:text-foreground hover:bg-background-hover"
              >
                Decline
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="text-sm text-foreground-muted">
                You need to sign in to accept this invitation.
              </div>
              <Button
                onClick={handleSignIn}
                className="w-full h-11 bg-accent hover:bg-accent-hover text-white font-medium"
              >
                Sign in to accept
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
