"use client";

import Editor from "@monaco-editor/react";
import Box from "@mui/material/Box";
type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  theme: "vs-dark" | "light";
};

export default function CodeEditor({ value, onChange, theme}: Props) {
  return (
    <Box sx={{ height: "100%", overflow: "hidden" }}>
      <Editor
        height="100%"
        defaultLanguage="python"
        language="python"
        theme={theme}
        value={value}
        onChange={onChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
      />
    </Box>
  );
}