"use client";

import Editor from "@monaco-editor/react";
type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  theme: "vs-dark" | "light";
};

export default function CodeEditor({ value, onChange, theme}: Props) {
  return (
    <div style={{ height: "500px", border: "1px solid #ddd", borderRadius: 8 }}>
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
    </div>
  );
}