"use client";

import { Group, Panel, Separator } from "react-resizable-panels";
import { Box, Button } from "@mui/material"; 
import CodeEditor from "@/components/CodeEditor";

export default function SplitPane() {
  return (
    <Group orientation="horizontal" style={{ height: "100vh" }}>
      
      {/* LEFT */}
      <Panel defaultSize={50} minSize={20}>
        <Box sx={{ height: "100%", overflow: "auto", p: 2 }}>
          Problem Info
        </Box>
      </Panel>

      <Separator
        style={{
          width: "4px",
          background: "#ddd",
          cursor: "col-resize",
        }}
      />

      {/* RIGHT */}
      <Panel defaultSize={50} minSize={30}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          
          <Box sx={{ flex: 1 }}>
            <CodeEditor
              value={"print('hello')"}
              onChange={() => {}}
              theme={"vs-dark"}
            />
          </Box>
            
          <Box sx={{ p: 1, display: "flex", gap: 1 }}>
            <Button variant="contained">Run</Button>
          </Box>

        </Box>
      </Panel>

    </Group>
  );
}