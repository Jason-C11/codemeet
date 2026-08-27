"use client";

import { useThemeContext } from "@/context/ThemeContext";
import { Editor, OnMount } from "@monaco-editor/react";
import Box from "@mui/material/Box";
import { EditorSelection } from "@/lib/types/EditorSelection";
import { useEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  onCursorChange?: (selection: EditorSelection) => void;
};

export default function CodeEditor({ value, onChange, onCursorChange }: Props) {
  const { themeName } = useThemeContext();

  const onCursorChangeRef = useRef(onCursorChange);

  useEffect(() => {
    onCursorChangeRef.current = onCursorChange;
  }, [onCursorChange]);

  const handleEditorDidMount: OnMount = (editor) => {
    editor.onDidChangeCursorSelection((event) => {
      const selection = event.selection;

      onCursorChangeRef.current?.({
        startLine: selection.startLineNumber,
        endLine: selection.endLineNumber,
        startColumn: selection.startColumn,
        endColumn: selection.endColumn,
        hasHighlight: !selection.isEmpty(),
      });
    });

    const model = editor.getModel();

    if (model) {
      const lastLine = model.getLineCount();
      const lastColumn = model.getLineContent(lastLine).length + 1;

      editor.setPosition({
        lineNumber: lastLine,
        column: lastColumn,
      });

      editor.focus();
    }
  };

  return (
    <Box sx={{ height: "100%", overflow: "hidden" }}>
      <Editor
        height="100%"
        defaultLanguage="python"
        language="python"
        theme={themeName === "light" ? "light" : "vs-dark"}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          fontFamily: "var(--font-code)",
          fontLigatures: false,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
      />
    </Box>
  );
}
