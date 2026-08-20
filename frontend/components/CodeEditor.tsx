"use client";

import { useThemeContext } from "@/context/ThemeContext";
import Editor from "@monaco-editor/react";
import Box from "@mui/material/Box";

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  
};


export default function CodeEditor({ value, onChange }: Props) {
  const { themeName } = useThemeContext();

  return (
    <Box sx={{ height: "100%", overflow: "hidden" }}>
      <Editor
        height="100%"
        defaultLanguage="python"
        language="python"
        theme={themeName === 'light' ? 'light' : 'vs-dark'}
        value={value}
        onChange={onChange}
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
