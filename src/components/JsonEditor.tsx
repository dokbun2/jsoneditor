import React, { useState, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  fontSize?: number;
  theme?: 'light' | 'dark';
  height?: string;
  showLineNumbers?: boolean;
  wordWrap?: boolean;
  minimap?: boolean;
  formatOnLoad?: boolean;
  editorRef?: React.MutableRefObject<any>;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  fontSize = 14,
  theme = 'dark',
  height = '500px',
  showLineNumbers = true,
  wordWrap = true,
  minimap = false,
  formatOnLoad = false,
  editorRef: externalEditorRef,
}) => {
  const internalEditorRef = useRef<any>(null);
  const editorRef = externalEditorRef || internalEditorRef;
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Define custom dark theme with black background
    monaco.editor.defineTheme('blackTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#000000',
        'editor.foreground': '#ffffff',
        'editorLineNumber.foreground': '#666666',
        'editorLineNumber.activeForeground': '#999999',
        'editor.lineHighlightBackground': '#1a1a1a',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41',
        'editorIndentGuide.background': '#2a2a2a',
        'editorIndentGuide.activeBackground': '#444444',
      }
    });
    
    // Apply the theme
    monaco.editor.setTheme('blackTheme');
    
    // Track cursor position
    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column
      });
    });

    // Format on load if requested
    if (formatOnLoad && value) {
      try {
        const parsed = JSON.parse(value);
        const formatted = JSON.stringify(parsed, null, 2);
        editor.setValue(formatted);
      } catch (e) {
        // Keep original value if not valid JSON
      }
    }
  }, [formatOnLoad, value]);


  return (
    <div className="relative h-full">
      <Editor
        height={height}
        defaultLanguage="json"
        theme="blackTheme"
        value={value}
        onChange={(val) => onChange(val || '')}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: minimap },
          fontSize,
          lineNumbers: showLineNumbers ? 'on' : 'off',
          wordWrap: wordWrap ? 'on' : 'off',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          formatOnPaste: true,
          formatOnType: true,
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'always',
          bracketPairColorization: {
            enabled: true
          },
          renderLineHighlight: 'all',
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10
          },
          suggest: {
            showKeywords: true,
            showSnippets: true
          }
        }}
      />
      
      {/* Cursor position indicator */}
      <div className="absolute bottom-0 right-0 bg-background-secondary/90 backdrop-blur-sm px-3 py-1 text-xs text-text-tertiary border-t border-l border-border-primary rounded-tl">
        줄: {cursorPosition.line}, 열: {cursorPosition.column}
      </div>
    </div>
  );
};

export default JsonEditor;