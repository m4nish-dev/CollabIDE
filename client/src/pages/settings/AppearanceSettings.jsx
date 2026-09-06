import React from "react";
import { SettingsLayout } from "@/components/layout/SettingsLayout";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";

export const AppearanceSettings = () => {
  const { appearance, updateAppearance } = useSettingsStore();

  const THEMES = [
    { id: "light", label: "Light", classes: "bg-white border-neutral-200" },
    { id: "dark", label: "Dark", classes: "bg-zinc-950 border-zinc-800" },
    { id: "system", label: "System", classes: "bg-gradient-to-br from-white to-zinc-950 border-neutral-300" }
  ];

  const ACCENTS = [
    { id: "violet", color: "bg-violet-500", ring: "ring-violet-500/50" },
    { id: "cyan", color: "bg-cyan-500", ring: "ring-cyan-500/50" },
    { id: "pink", color: "bg-pink-500", ring: "ring-pink-500/50" },
    { id: "emerald", color: "bg-emerald-500", ring: "ring-emerald-500/50" },
    { id: "amber", color: "bg-amber-500", ring: "ring-amber-500/50" },
    { id: "blue", color: "bg-blue-500", ring: "ring-blue-500/50" },
  ];

  const DENSITIES = [
    { id: "comfortable", label: "Comfortable", desc: "More spacing between elements" },
    { id: "compact", label: "Compact", desc: "Fits more information on screen" }
  ];

  return (
    <SettingsLayout 
      title="Appearance" 
      description="Customize how CollabIDE looks and feels on your device."
    >
      <div className="space-y-10">
        
        {/* Theme */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Theme</h3>
            <p className="text-xs text-foreground-subtle mt-1">
              Select your preferred color theme.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-[500px]">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => updateAppearance({ theme: theme.id })}
                className={`flex flex-col items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                  appearance.theme === theme.id 
                    ? "border-accent bg-accent/5" 
                    : "border-border bg-background-elevated hover:border-foreground-muted/50"
                }`}
              >
                <div className={`w-full h-16 rounded-md border shadow-sm flex items-center justify-center relative overflow-hidden ${theme.classes}`}>
                  {/* Mini preview elements */}
                  <div className="absolute top-2 left-2 right-2 h-2 rounded bg-current opacity-10" />
                  <div className="absolute top-6 left-2 right-8 h-2 rounded bg-current opacity-10" />
                  <div className="absolute bottom-2 left-2 right-12 h-2 rounded bg-current opacity-10" />
                  {appearance.theme === theme.id && (
                    <div className="absolute inset-0 bg-accent/10 flex items-center justify-center">
                      <Check className="h-5 w-5 text-accent" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-foreground">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Accent Color</h3>
            <p className="text-xs text-foreground-subtle mt-1">
              Choose the primary color for buttons, active states, and highlights.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {ACCENTS.map((accent) => (
              <button
                key={accent.id}
                onClick={() => updateAppearance({ accentColor: accent.id })}
                className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${accent.color} ${
                  appearance.accentColor === accent.id 
                    ? `ring-4 ${accent.ring} scale-110` 
                    : "hover:scale-105"
                }`}
                aria-label={`Select ${accent.id} accent color`}
              >
                {appearance.accentColor === accent.id && (
                  <Check className="h-5 w-5 text-white/90 drop-shadow-md" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Interface Density */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Interface Density</h3>
            <p className="text-xs text-foreground-subtle mt-1">
              Adjust the spacing and size of UI elements.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-[500px]">
            {DENSITIES.map((density) => (
              <button
                key={density.id}
                onClick={() => updateAppearance({ density: density.id })}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  appearance.density === density.id 
                    ? "border-accent bg-accent/5" 
                    : "border-border bg-background-elevated hover:border-foreground-muted/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{density.label}</span>
                  {appearance.density === density.id && (
                    <Check className="h-4 w-4 text-accent" />
                  )}
                </div>
                <p className="text-xs text-foreground-subtle">{density.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Reduced Motion */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
            Accessibility
          </h3>
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background-elevated">
            <div>
              <p className="text-sm font-medium text-foreground">Reduced motion</p>
              <p className="text-xs text-foreground-subtle mt-1">
                Minimize UI animations, transitions, and hover effects.
              </p>
            </div>
            <Switch 
              checked={appearance.reducedMotion}
              onCheckedChange={(checked) => updateAppearance({ reducedMotion: checked })}
            />
          </div>
        </div>

      </div>
    </SettingsLayout>
  );
};
