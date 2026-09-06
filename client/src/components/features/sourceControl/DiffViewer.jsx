import React, { useState } from "react";
import { DiffEditor } from "@monaco-editor/react";
import { FileCode, Columns, AlignLeft, X } from "lucide-react";
import { COLLAB_IDE_THEME } from "@/lib/monacoTheme";
import PropTypes from "prop-types";

export const DiffViewer = ({ file, originalContent, modifiedContent, onClose }) => {
  const [isInline, setIsInline] = useState(false);

  const handleEditorMount = (editor, monaco) => {
    monaco.editor.defineTheme("collab-dark", COLLAB_IDE_THEME);
    monaco.editor.setTheme("collab-dark");
  };

  if (!file) return null;

  return (
    <div className="flex flex-col h-full w-full bg-[#0E0E12]">
      {/* Diff Header */}
      <div className="h-[40px] px-4 border-b border-border bg-background-elevated flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FileCode className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-foreground">{file.path}</span>
          </div>
          <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">
            M
          </span>
          <div className="flex items-center gap-2 text-xs font-mono ml-2">
            <span className="text-emerald-400">+14</span>
            <span className="text-red-400">-5</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-background border border-border rounded-md p-0.5">
            <button
              onClick={() => setIsInline(false)}
              className={`p-1.5 rounded-sm transition-colors ${!isInline ? "bg-accent/20 text-accent" : "text-foreground-muted hover:text-foreground"}`}
              title="Side by Side View"
            >
              <Columns className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setIsInline(true)}
              className={`p-1.5 rounded-sm transition-colors ${isInline ? "bg-accent/20 text-accent" : "text-foreground-muted hover:text-foreground"}`}
              title="Inline View"
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </button>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 text-foreground-muted hover:text-foreground hover:bg-background-hover rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Monaco Diff Editor */}
      <div className="flex-1 relative">
        <DiffEditor
          height="100%"
          language="javascript"
          original={originalContent}
          modified={modifiedContent}
          theme="collab-dark"
          onMount={handleEditorMount}
          options={{
            renderSideBySide: !isInline,
            readOnly: true,
            fontSize: 13,
            fontFamily: '"JetBrains Mono", Menlo, Monaco, Consolas, monospace',
            lineNumbers: "on",
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            useInlineViewWhenSpaceIsLimited: false,
            ignoreTrimWhitespace: false,
            diffWordWrap: "off",
            padding: { top: 12, bottom: 12 }
          }}
        />
      </div>
    </div>
  );
};

DiffViewer.propTypes = {
  file: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }),
  originalContent: PropTypes.string.isRequired,
  modifiedContent: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};
