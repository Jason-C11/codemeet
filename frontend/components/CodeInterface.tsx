"use client";

import { Group, Panel, Separator } from "react-resizable-panels";
import { Box, Button, Typography } from "@mui/material";
import CodeEditor from "@/components/CodeEditor";
import { Problem } from "@/lib/types/Problem";

type Props = {
  problem: Problem | null;
  code: string;
  onCodeChange: (value: string | undefined) => void;
  onRun: () => void;
  onOpenProblemSelector: () => void;
};

export default function CodeInterface({
  problem,
  code,
  onCodeChange,
  onRun,
  onOpenProblemSelector,
}: Props) {
  return (
    <Group orientation="horizontal" style={{ height: "100vh" }}>
      {/* LEFT */}
      <Panel defaultSize={50} minSize={20}>
        <Box sx={{ height: "100%", overflow: "auto", p: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Button variant="outlined" onClick={onOpenProblemSelector}>
              Change Problem
            </Button>
          </Box>

          {problem ? (
            <>
              <Typography variant="h5" gutterBottom>
                {problem.title}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Difficulty: {problem.difficulty}
              </Typography>

              <Typography variant="body1" sx={{ mt: 2 }}>
                {problem.description}
              </Typography>

              <Typography variant="subtitle1" sx={{ mt: 3 }}>
                Constraints
              </Typography>

              <ul>
                {(problem.constraints ?? []).map((c, i) => (
                  <li key={i}>
                    <Typography variant="body2">{c}</Typography>
                  </li>
                ))}
              </ul>

              <Typography variant="subtitle1" sx={{ mt: 3 }}>
                Examples
              </Typography>

              <ul>
                {(problem.examples ?? []).map((ex, i) => (
                  <li key={i}>
                    <Typography variant="body2">{ex}</Typography>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
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
              value={code}
              onChange={onCodeChange}
              theme={"vs-dark"}
            />
          </Box>

          <Box sx={{ p: 1, display: "flex", gap: 1 }}>
            <Button variant="contained" onClick={onRun}>
              Run
            </Button>
          </Box>
        </Box>
      </Panel>
    </Group>
  );
}
