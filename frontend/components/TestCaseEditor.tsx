"use client";

import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";

import { TestCase } from "@/lib/types/TestCase";
import { TestCaseResult } from "@/lib/types/TestCaseResult";
import { Problem } from "@/lib/types/Problem";
import { useState } from "react";
import { formatSingleVar, formatVariables } from "@/utils/typeParser";

type Props = {
  problem: Problem;
  testCases: TestCase[];
  results: TestCaseResult[];
  setTestCases: (tc: TestCase[]) => void;
  onRun: () => void;
  onSubmit: () => void;
};

export default function TestCaseEditor({
  problem,
  testCases,
  results,
  setTestCases,
  onRun,
  onSubmit
}: Props) {
  const [tabIndex, setTabIndex] = useState(0);

  const safeTabIndex =
    testCases.length === 0 ? 0 : Math.min(tabIndex, testCases.length - 1);

  // Number of sample test cases
  const sampleCount = problem.sampleTestCases?.length ?? 0;

  // check if generated test case
  const isUserGeneratedCase = safeTabIndex >= sampleCount;

  const handleInputChange = (
    tcIndex: number,
    paramIndex: number,
    value: string,
  ) => {
    if (tcIndex < sampleCount) return;
    const updated = [...testCases];
    updated[tcIndex] = {
      ...updated[tcIndex],
      input: [...updated[tcIndex].input],
    };
    updated[tcIndex].input[paramIndex] = value;
    setTestCases(updated);
  };

  const handleExpectedChange = (tcIndex: number, value: string) => {
    if (tcIndex < sampleCount) return;
    const updated = [...testCases];
    updated[tcIndex] = {
      ...updated[tcIndex],
      expected: value,
    };
    setTestCases(updated);
  };

  const handleAddTestCase = () => {
    if (testCases.length >= 7) return;

    const newTestCase: TestCase = {
      input: problem.params.map(() => ""),
      expected: "",
    };

    const updated = [...testCases, newTestCase];
    setTestCases(updated);
    setTabIndex(updated.length - 1);
  };

  const currentTestCase = testCases[safeTabIndex];
  const currentResult = results?.[safeTabIndex];

  const formattedInputs = !isUserGeneratedCase
    ? formatVariables(currentTestCase.input, problem.params)
    : null;

  return (
    <Paper
      sx={{
        height: "100%",
        overflow: "auto",
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          px: 2,
          pt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Test Cases</Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleAddTestCase}
            disabled={testCases.length >= 7}
          >
            Add
          </Button>

          <Button variant="contained" color="primary" onClick={onRun}>
            Run
          </Button>
          
          <Button variant="contained" color="success" onClick={onSubmit}>
            Submit
          </Button>
        </Box>
      </Box>

      <Tabs
        value={safeTabIndex}
        onChange={(_, v) => setTabIndex(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ px: 2 }}
      >
        {testCases.map((_, i) => (
          <Tab
            key={i}
            label={
              i < sampleCount
                ? `Sample ${i + 1}`
                : `Custom ${i + 1 - sampleCount}`
            }
          />
        ))}
      </Tabs>

      {currentTestCase && (
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {problem.params.map((param, paramIndex) => (
            <TextField
              key={param.name}
              label={`${param.name} (${param.type})`}
              value={
                !isUserGeneratedCase
                  ? (formattedInputs?.[paramIndex] ?? "")
                  : (currentTestCase.input[paramIndex] ?? "")
              }
              onChange={(e) =>
                handleInputChange(safeTabIndex, paramIndex, e.target.value)
              }
              fullWidth
              disabled={!isUserGeneratedCase}
            />
          ))}

          {!isUserGeneratedCase && (
            <TextField
              label="Expected Output"
              value={
                !isUserGeneratedCase
                  ? formatSingleVar(
                      currentTestCase.expected,
                      problem.returnType,
                    )
                  : currentTestCase.expected
              }
              onChange={(e) =>
                handleExpectedChange(safeTabIndex, e.target.value)
              }
              fullWidth
              disabled
              helperText="Expected sample output"
            />
          )}

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Output
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                minHeight: 60,
              }}
            >
              {currentResult?.actual !== undefined &&
              currentResult?.actual !== ""
                ? JSON.stringify(currentResult.actual)
                : "Not run yet"}
            </Paper>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
