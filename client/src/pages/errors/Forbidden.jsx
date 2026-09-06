import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-background-elevated border border-border rounded-2xl p-8 sm:p-10 text-center shadow-lg">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="h-10 w-10 text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-3">
          You don't have access
        </h1>
        
        <p className="text-sm text-foreground-subtle mb-8">
          You need permission to view this page. If you believe this is a mistake, you can request access from the workspace owner.
        </p>
        
        <div className="flex flex-col gap-3">
          <Button 
            className="w-full h-11 bg-accent hover:bg-accent-hover text-white"
          >
            Request access
          </Button>
          <Button 
            variant="outline" 
            className="w-full h-11"
            onClick={() => navigate("/dashboard")}
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
