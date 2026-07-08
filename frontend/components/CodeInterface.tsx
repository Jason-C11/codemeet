"use client";

import { Group, Panel, Separator } from "react-resizable-panels";
import { Box, Button, Typography } from "@mui/material";
import CodeEditor from "@/components/CodeEditor";
import TestCaseEditor from "@/components/TestCaseEditor";
import { Problem } from "@/lib/types/Problem";
import { TestCase } from "@/lib/types/TestCase";
import { TestCaseResult } from "@/lib/types/TestCaseResult";
type Props = {
  problem: Problem | null;
  code: string;
  testCases: TestCase[];
  results: TestCaseResult[];
  onCodeChange: (value: string | undefined) => void;
  onRun: () => void;
  onOpenProblemSelector: () => void;
  onSetTestCases: (testCases: TestCase[]) => void;
};

export default function CodeInterface({
  problem,
  code,
  testCases,
  results,
  onCodeChange,
  onRun,
  onOpenProblemSelector,
  onSetTestCases,
}: Props) {
  return (
    <Group orientation="horizontal" style={{ height: "100vh" }}>
      {/* LEFT */}
      <Panel defaultSize={"50%"} minSize={"30%"}>
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
          background: "#333",
          cursor: "col-resize",
        }}
      />

      {/* RIGHT */}
      <Panel defaultSize={"50%"} minSize={"30%"}>
        <Group orientation="vertical" style={{ height: "100%" }}>
          {/* CODE EDITOR */}
          <Panel defaultSize={"70%"} minSize={"20%"}>
            <Box sx={{ height: "100%" }}>
              <CodeEditor
                value={code}
                onChange={onCodeChange}
                theme={"vs-dark"}
              />
            </Box>
          </Panel>

          <Separator
            style={{
              height: "4px",
              background: "#333",
              cursor: "row-resize",
            }}
          />

          {/* TEST CASE EDITOR */}
          <Panel defaultSize={"30%"} minSize={"20%"}>
            {problem ? (
              <Box sx={{ height: "100%" }}>
                <TestCaseEditor
                  problem={problem}
                  testCases={testCases}
                  results={results}
                  setTestCases={onSetTestCases}
                  onRun={onRun}
                />
              </Box>
            ) : null}
          </Panel>
        </Group>
      </Panel>
    </Group>
  );
}
