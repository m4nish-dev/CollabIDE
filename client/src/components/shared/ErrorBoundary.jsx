import React from "react";
import { AlertOctagon, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <AlertOctagon className="h-10 w-10 text-red-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Something went wrong
          </h1>
          
          <p className="text-sm text-foreground-subtle mb-6 max-w-md">
            An unexpected error occurred in this part of the application.
          </p>

          {import.meta.env.DEV && this.state.error && (
            <div className="text-left w-full max-w-2xl bg-background-elevated border border-red-500/30 rounded-md p-4 overflow-auto mb-8 text-xs font-mono text-red-400">
              {this.state.error.toString()}
            </div>
          )}
          
          <div className="flex gap-4">
            <Button 
              className="gap-2 bg-accent hover:bg-accent-hover text-white"
              onClick={() => window.location.reload()}
            >
              <RotateCw className="h-4 w-4" /> Reload page
            </Button>
            <Button variant="outline">
              Report issue
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
