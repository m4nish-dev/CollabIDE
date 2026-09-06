import React, { useState } from "react";
import { SettingsLayout } from "@/components/layout/SettingsLayout";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  UploadCloud, 
  Globe2, 
  Lock, 
  EyeOff, 
  Link as LinkIcon 
} from "lucide-react";

export const WorkspaceGeneralSettings = () => {
  const { workspaceGeneral, updateWorkspaceGeneral } = useSettingsStore();
  const [localData, setLocalData] = useState(workspaceGeneral);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
    updateWorkspaceGeneral({ [name]: value });
  };

  const VISIBILITY_OPTIONS = [
    { id: "public", label: "Public", desc: "Anyone on the internet can see projects in this workspace.", icon: Globe2 },
    { id: "private", label: "Private", desc: "Only invited workspace members can see these projects.", icon: Lock },
    { id: "unlisted", label: "Unlisted", desc: "Anyone with the link can view projects, but they don't appear in search.", icon: EyeOff },
  ];

  return (
    <SettingsLayout 
      title="Workspace Settings" 
      description="Manage details, identity, and visibility of your workspace."
    >
      <div className="space-y-8">
        
        {/* Workspace Icon */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-xl border border-border bg-background-elevated flex items-center justify-center overflow-hidden relative group cursor-pointer">
            {localData.icon ? (
              <img src={localData.icon} alt="Workspace Icon" className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-8 h-8 text-foreground-subtle" />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <UploadCloud className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground mb-1">Workspace logo</h3>
            <p className="text-xs text-foreground-subtle mb-3 max-w-[300px]">
              This logo will be displayed on all projects within this workspace. Recommended size: 256x256px.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="h-8 text-xs">
                Upload image
              </Button>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-border" />

        <div className="grid gap-6">
          {/* Workspace Name */}
          <div className="space-y-2 max-w-md">
            <label className="text-sm font-medium text-foreground">Workspace Name</label>
            <Input 
              name="name"
              value={localData.name} 
              onChange={handleChange}
              className="bg-background-elevated"
              placeholder="e.g. Acme Corp"
            />
          </div>

          {/* URL Slug */}
          <div className="space-y-2 max-w-md">
            <label className="text-sm font-medium text-foreground">Workspace URL</label>
            <div className="flex rounded-md border border-border overflow-hidden bg-background-elevated focus-within:ring-1 focus-within:ring-accent focus-within:border-accent">
              <div className="flex items-center px-3 bg-background border-r border-border text-foreground-muted text-sm shrink-0 gap-1.5">
                <LinkIcon className="h-3.5 w-3.5" />
                collabide.dev/w/
              </div>
              <input 
                name="slug"
                value={localData.slug} 
                onChange={handleChange}
                className="flex-1 px-3 py-2 bg-transparent text-sm text-foreground focus:outline-none"
                placeholder="acme-corp"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 max-w-md">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              name="description"
              value={localData.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border border-border bg-background-elevated px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-foreground-muted resize-none"
              placeholder="What is this workspace for?"
            />
          </div>

          {/* Default Visibility */}
          <div className="space-y-3 pt-2 max-w-2xl">
            <div>
              <label className="text-sm font-medium text-foreground">Default Project Visibility</label>
              <p className="text-xs text-foreground-subtle mt-1">
                This will be the default visibility setting when new projects are created in this workspace.
              </p>
            </div>
            
            <div className="grid gap-3 sm:grid-cols-3">
              {VISIBILITY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setLocalData(prev => ({ ...prev, defaultVisibility: opt.id }));
                    updateWorkspaceGeneral({ defaultVisibility: opt.id });
                  }}
                  className={`text-left p-3 rounded-lg border transition-colors ${
                    localData.defaultVisibility === opt.id
                      ? "border-accent bg-accent/5 ring-1 ring-accent"
                      : "border-border bg-background-elevated hover:border-foreground-muted/50"
                  }`}
                >
                  <opt.icon className={`h-5 w-5 mb-2 ${localData.defaultVisibility === opt.id ? 'text-accent' : 'text-foreground-muted'}`} />
                  <div className="text-sm font-medium text-foreground mb-1">{opt.label}</div>
                  <div className="text-xs text-foreground-subtle leading-snug">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </SettingsLayout>
  );
};
