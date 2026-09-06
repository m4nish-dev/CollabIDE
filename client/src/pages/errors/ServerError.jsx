import React from "react";
import { Button } from "@/components/ui/button";
import { AlertOctagon } from "lucide-react";

export default function ServerError({ onRetry }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertOctagon className="h-12 w-12 text-amber-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Something went wrong on our end
        </h1>
        
        <p className="text-base text-foreground-subtle mb-8">
          We encountered an unexpected error processing your request. Our team has been notified.
        </p>
        
        <Button 
          onClick={onRetry || (() => window.location.reload())}
          className="h-11 px-8 bg-amber-500 hover:bg-amber-600 text-white"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
