import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FolderX } from "lucide-react";

export default function ProjectNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-background-elevated border border-border rounded-2xl p-8 sm:p-10 text-center shadow-lg">
        <div className="w-20 h-20 bg-background border border-border rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <FolderX className="h-10 w-10 text-foreground-muted" />
        </div>
        
        <h1 className="text-xl font-bold text-foreground mb-3">
          This project doesn't exist
        </h1>
        
        <p className="text-sm text-foreground-subtle mb-8">
          The project you are looking for might have been deleted, or you may have followed an invalid link.
        </p>
        
        <Button 
          className="w-full h-11 bg-accent hover:bg-accent-hover text-white"
          onClick={() => navigate("/dashboard")}
        >
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}
