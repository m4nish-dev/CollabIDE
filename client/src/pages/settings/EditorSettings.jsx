import React from "react";
import { SettingsLayout } from "@/components/layout/SettingsLayout";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Editor } from "@monaco-editor/react";

export const EditorSettings = () => {
  const { editor, updateEditor } = useSettingsStore();

  const SAMPLE_CODE = `function calculateTotal(items) {
  // Compute the total price of all items
  const total = items.reduce((acc, item) => {
    const price = item.price || 0;
    const qty = item.quantity || 1;
    return acc + (price * qty);
  }, 0);
  
  if (total > 100) {
    return total * 0.9; // 10% discount
  }
  return total;
}`;

  return (
    <SettingsLayout 
      title="Editor" 
      description="Configure the behavior and appearance of the code editor."
    >
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left: Controls */}
        <div className="flex-1 space-y-8">
          
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Typography
            </h3>
            
            {/* Font Family */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Font Family</label>
              <select
                value={editor.fontFamily}
                onChange={(e) => updateEditor({ fontFamily: e.target.value })}
                className="w-full h-9 px-3 rounded-md border border-border bg-background-elevated text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value='"JetBrains Mono", monospace'>JetBrains Mono</option>
                <option value='"Fira Code", monospace'>Fira Code</option>
                <option value='"Cascadia Code", monospace'>Cascadia Code</option>
                <option value="Menlo, Monaco, Consolas, monospace">Menlo / Monaco</option>
              </select>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Font Size</label>
                <span className="text-xs text-foreground-subtle font-mono">{editor.fontSize}px</span>
              </div>
              <Slider
                min={10}
                max={24}
                step={1}
                value={[editor.fontSize]}
                onValueChange={(val) => updateEditor({ fontSize: val[0] })}
                className="py-1"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Formatting
            </h3>
            
            {/* Tab Size */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-foreground">Tab Size</label>
              <div className="flex gap-3">
                {[2, 4, 8].map((size) => (
                  <button
                    key={size}
                    onClick={() => updateEditor({ tabSize: size })}
                    className={`flex-1 py-1.5 rounded-md border text-sm font-mono transition-colors ${
                      editor.tabSize === size
                        ? "bg-accent/10 border-accent text-accent"
                        : "bg-background-elevated border-border text-foreground-muted hover:border-foreground-muted/50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Formatting Toggles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Insert spaces</p>
                  <p className="text-xs text-foreground-subtle">Insert spaces when pressing Tab.</p>
                </div>
                <Switch 
                  checked={editor.insertSpaces}
                  onCheckedChange={(checked) => updateEditor({ insertSpaces: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Format on save</p>
                  <p className="text-xs text-foreground-subtle">Automatically format the file on save.</p>
                </div>
                <Switch 
                  checked={editor.formatOnSave}
                  onCheckedChange={(checked) => updateEditor({ formatOnSave: checked })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Display & Layout
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Word wrap</p>
                <Switch 
                  checked={editor.wordWrap === "on"}
                  onCheckedChange={(checked) => updateEditor({ wordWrap: checked ? "on" : "off" })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Minimap</p>
                <Switch 
                  checked={editor.minimap}
                  onCheckedChange={(checked) => updateEditor({ minimap: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Line numbers</p>
                <Switch 
                  checked={editor.lineNumbers}
                  onCheckedChange={(checked) => updateEditor({ lineNumbers: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Render whitespace</p>
                <Switch 
                  checked={editor.showWhitespace}
                  onCheckedChange={(checked) => updateEditor({ showWhitespace: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Bracket pair colorization</p>
                <Switch 
                  checked={editor.bracketPairColorization}
                  onCheckedChange={(checked) => updateEditor({ bracketPairColorization: checked })}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right: Live Preview */}
        <div className="lg:w-[380px] shrink-0 hidden md:block">
          <div className="sticky top-6 rounded-xl border border-border bg-background-elevated overflow-hidden shadow-sm h-[500px] flex flex-col">
            <div className="px-4 py-2 border-b border-border bg-background/50 flex items-center justify-between">
              <span className="text-xs font-medium text-foreground-subtle">Live Preview</span>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
              </div>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={SAMPLE_CODE}
                theme="vs-dark" // Ideally syncs with app theme, using vs-dark for preview consistency
                options={{
                  fontFamily: editor.fontFamily,
                  fontSize: editor.fontSize,
                  tabSize: editor.tabSize,
                  insertSpaces: editor.insertSpaces,
                  wordWrap: editor.wordWrap,
                  minimap: { enabled: editor.minimap, scale: 0.75 },
                  lineNumbers: editor.lineNumbers ? "on" : "off",
                  renderWhitespace: editor.showWhitespace ? "all" : "none",
                  bracketPairColorization: { enabled: editor.bracketPairColorization },
                  readOnly: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </div>
          </div>
        </div>

      </div>
    </SettingsLayout>
  );
};
