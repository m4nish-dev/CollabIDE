import React, { useState } from "react";
import { SettingsLayout } from "@/components/layout/SettingsLayout";
import { Button } from "@/components/ui/button";
import { GitBranch, Globe, GitFork, Link as LinkIcon, Unlink } from "lucide-react";

export const ConnectedAccountsSettings = () => {
  const [connections, setConnections] = useState({
    github: { connected: true, username: "manish_dev", avatar: "https://i.pravatar.cc/150?u=manish" },
    google: { connected: false, username: null, avatar: null },
    gitlab: { connected: true, username: "manish_gitlab", avatar: "https://i.pravatar.cc/150?u=manish2" }
  });

  const toggleConnection = (provider) => {
    setConnections(prev => ({
      ...prev,
      [provider]: {
        connected: !prev[provider].connected,
        username: !prev[provider].connected ? "new_user_connected" : null,
        avatar: !prev[provider].connected ? "https://i.pravatar.cc/150?u=new" : null
      }
    }));
  };

  const PROVIDERS = [
    { 
      id: "github", 
      name: "GitHub", 
      icon: GitBranch, 
      desc: "Connect to import repositories, sync changes, and manage pull requests directly from the IDE.",
      color: "bg-neutral-800 text-white border-neutral-700" 
    },
    { 
      id: "google", 
      name: "Google", 
      icon: Globe, 
      desc: "Use your Google account for single sign-on (SSO) and exporting logs to Google Drive.",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20" 
    },
    { 
      id: "gitlab", 
      name: "GitLab", 
      icon: GitFork, 
      desc: "Connect to import repositories and manage your GitLab CI/CD pipelines.",
      color: "bg-orange-500/10 text-orange-500 border-orange-500/20" 
    }
  ];

  return (
    <SettingsLayout 
      title="Connected Accounts" 
      description="Connect third-party services to enhance your CollabIDE experience."
    >
      <div className="space-y-6">
        
        <div className="grid gap-6">
          {PROVIDERS.map((provider) => {
            const isConnected = connections[provider.id].connected;
            const data = connections[provider.id];

            return (
              <div 
                key={provider.id} 
                className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 p-5 rounded-xl bg-background-elevated border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg border shrink-0 ${provider.color}`}>
                    <provider.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                      {provider.name}
                      {isConnected && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                          Connected
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-foreground-subtle mt-1 max-w-[400px]">
                      {provider.desc}
                    </p>
                    
                    {isConnected && (
                      <div className="flex items-center gap-2 mt-4 p-2 pr-4 bg-background border border-border rounded-lg inline-flex">
                        <img 
                          src={data.avatar} 
                          alt={data.username}
                          className="h-6 w-6 rounded-md object-cover border border-border" 
                        />
                        <span className="text-xs font-medium text-foreground">{data.username}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 pt-1">
                  {isConnected ? (
                    <Button 
                      variant="outline" 
                      onClick={() => toggleConnection(provider.id)}
                      className="w-full sm:w-auto h-9 gap-2 text-foreground-subtle hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
                    >
                      <Unlink className="h-4 w-4" /> Disconnect
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => toggleConnection(provider.id)}
                      className="w-full sm:w-auto h-9 gap-2 bg-background-hover text-foreground hover:bg-background-elevated hover:text-accent border border-border transition-colors"
                    >
                      <LinkIcon className="h-4 w-4" /> Connect {provider.name}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </SettingsLayout>
  );
};
