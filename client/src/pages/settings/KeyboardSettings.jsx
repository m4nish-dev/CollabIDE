import React, { useState, useEffect } from "react";
import { SettingsLayout } from "@/components/layout/SettingsLayout";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, Keyboard as KeyboardIcon, Check, X } from "lucide-react";
import { toast } from "@/lib/toast";

const DEFAULT_SHORTCUTS = [
  { id: "s1", action: "Command Palette", keys: ["⌘", "K"], category: "General" },
  { id: "s2", action: "Quick Open File", keys: ["⌘", "P"], category: "General" },
  { id: "s3", action: "Global Search", keys: ["⌘", "⇧", "F"], category: "General" },
  { id: "s4", action: "Save File", keys: ["⌘", "S"], category: "Editor" },
  { id: "s5", action: "Format Document", keys: ["⇧", "⌥", "F"], category: "Editor" },
  { id: "s6", action: "Toggle Line Comment", keys: ["⌘", "/"], category: "Editor" },
  { id: "s7", action: "Toggle Terminal", keys: ["⌃", "`"], category: "View" },
  { id: "s8", action: "Toggle Sidebar", keys: ["⌘", "B"], category: "View" },
  { id: "s9", action: "New File", keys: ["⌘", "N"], category: "File" },
  { id: "s10", action: "Close Editor", keys: ["⌘", "W"], category: "File" },
  { id: "s11", action: "Commit Changes", keys: ["⌘", "Enter"], category: "Source Control" },
  { id: "s12", action: "Run Project", keys: ["⌃", "R"], category: "Debug" },
];

export const KeyboardSettings = () => {
  const { keyboard, updateKeyboard } = useSettingsStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [capturedKeys, setCapturedKeys] = useState([]);

  // Merge defaults with user overrides
  const shortcuts = DEFAULT_SHORTCUTS.map(def => ({
    ...def,
    keys: keyboard[def.id] || def.keys
  }));

  const filteredShortcuts = shortcuts.filter(s => 
    s.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by category
  const groupedShortcuts = filteredShortcuts.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {});

  useEffect(() => {
    if (!editingId) return;

    const handleKeyDown = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const keys = [];
      if (e.metaKey) keys.push("⌘");
      if (e.ctrlKey) keys.push("⌃");
      if (e.altKey) keys.push("⌥");
      if (e.shiftKey) keys.push("⇧");

      const keyName = e.key.toUpperCase();
      if (!["META", "CONTROL", "ALT", "SHIFT"].includes(keyName)) {
        if (keyName === " ") keys.push("Space");
        else if (keyName === "ENTER") keys.push("Enter");
        else if (keyName === "ESCAPE") keys.push("Esc");
        else keys.push(keyName);
      }

      setCapturedKeys(keys);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingId]);

  const handleSaveShortcut = () => {
    if (capturedKeys.length > 0) {
      updateKeyboard({ [editingId]: capturedKeys });
      toast.success("Shortcut updated");
    }
    setEditingId(null);
    setCapturedKeys([]);
  };

  const handleResetDefaults = () => {
    updateKeyboard(DEFAULT_SHORTCUTS.reduce((acc, curr) => {
      acc[curr.id] = null; // Removing override
      return acc;
    }, {}));
    toast.success("Keyboard shortcuts reset to defaults");
  };

  return (
    <SettingsLayout 
      title="Keyboard Shortcuts" 
      description="Customize keybindings for various commands in the editor."
    >
      <div className="space-y-6">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
            <Input 
              placeholder="Type to search bindings..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background-elevated h-9"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={handleResetDefaults}
            className="h-9 gap-2 shrink-0 w-full sm:w-auto bg-background hover:bg-background-hover"
          >
            <RotateCcw className="h-4 w-4" /> Reset to defaults
          </Button>
        </div>

        {/* Shortcuts List */}
        <div className="border border-border rounded-lg bg-background overflow-hidden">
          {Object.keys(groupedShortcuts).length === 0 ? (
            <div className="p-12 text-center text-foreground-muted flex flex-col items-center">
              <KeyboardIcon className="h-8 w-8 mb-3 opacity-20" />
              <p>No shortcuts match your search.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {Object.entries(groupedShortcuts).map(([category, items]) => (
                <div key={category}>
                  <div className="bg-background-elevated/50 px-4 py-2 border-b border-border">
                    <span className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider">
                      {category}
                    </span>
                  </div>
                  <div className="divide-y divide-border/50">
                    {items.map((shortcut) => (
                      <div 
                        key={shortcut.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-background-hover transition-colors"
                      >
                        <div className="text-sm font-medium text-foreground">
                          {shortcut.action}
                        </div>
                        
                        {editingId === shortcut.id ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 min-w-[120px] h-8 px-3 rounded border border-accent bg-accent/10 animate-pulse text-xs font-mono text-accent">
                              {capturedKeys.length > 0 ? (
                                capturedKeys.map((k, i) => <kbd key={i} className="bg-background px-1.5 py-0.5 rounded shadow-sm border border-border">{k}</kbd>)
                              ) : (
                                "Press desired keys..."
                              )}
                            </div>
                            <button 
                              onClick={handleSaveShortcut}
                              disabled={capturedKeys.length === 0}
                              className="p-1.5 rounded bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 disabled:opacity-50"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => { setEditingId(null); setCapturedKeys([]); }}
                              className="p-1.5 rounded bg-red-500/20 text-red-500 hover:bg-red-500/30"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setEditingId(shortcut.id); setCapturedKeys(shortcut.keys); }}
                            className="flex items-center gap-1 p-1 -mr-1 rounded hover:bg-background-elevated group"
                          >
                            {shortcut.keys.map((key, i) => (
                              <kbd 
                                key={i} 
                                className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 text-[11px] font-mono font-medium text-foreground bg-background-elevated border border-border rounded shadow-[0_1px_0_rgba(255,255,255,0.1)] group-hover:border-foreground-muted transition-colors"
                              >
                                {key}
                              </kbd>
                            ))}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </SettingsLayout>
  );
};
