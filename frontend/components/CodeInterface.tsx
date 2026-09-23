"use client";

import { Group, Panel, Separator } from "react-resizable-panels";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  Tooltip,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import CodeEditor from "@/components/CodeEditor";
import TestCaseEditor from "@/components/TestCaseEditor";
import Stopwatch from "@/components/Stopwatch";
import { Problem } from "@/lib/types/Problem";
import { TestCase } from "@/lib/types/TestCase";
import { TestCaseResult } from "@/lib/types/TestCaseResult";
import { CodeEvaluation } from "@/lib/types/CodeEvaluation";
import RestoreIcon from "@mui/icons-material/Restore";
import { useState } from "react";
import { EditorSelection, RemoteCursor } from "@/lib/types/EditorSelection";
import { StopwatchState } from "@/lib/types/StopwatchState";

type Props = {
  problem: Problem | null;
  code: string;
  testCases: TestCase[];
  results: TestCaseResult[];
  remoteCursors?: RemoteCursor[];
  stopwatch?: StopwatchState;
  stopwatchDisabled?: boolean;
  codeEvaluation: CodeEvaluation | null;
  isCodeEvalLoading: boolean;
  isHintLoading: boolean;
  hint: string | null;
  onCodeChange: (value: string | undefined) => void;
  onCursorChange?: (selection: EditorSelection) => void;
  onResetCode: () => void;
  onRun: () => void;
  onSubmit: () => void;
  onOpenProblemSelector: () => void;
  onSetTestCases: (testCases: TestCase[]) => void;
  onStopwatchAction?: (action: "start" | "pause" | "reset") => void;
  onCodeEval: () => Promise<void>;
  onHintGen: () => Promise<void>;
  toolbarActions?: React.ReactNode;
};

export default function CodeInterface({
  problem,
  code,
  testCases,
  results,
  remoteCursors,
  stopwatch,
  stopwatchDisabled,
  codeEvaluation,
  hint,
  isCodeEvalLoading,
  isHintLoading,
  onCodeChange,
  onCursorChange,
  onResetCode,
  onRun,
  onSubmit,
  onOpenProblemSelector,
  onSetTestCases,
  onStopwatchAction,
  onCodeEval,
  onHintGen,
  toolbarActions,
}: Props) {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [evaluationDialogOpen, setEvaluationDialogOpen] = useState(false);
  const [hintDialogOpen, setHintDialogOpen] = useState(false);

  return (
    <>
      <Dialog
        open={evaluationDialogOpen}
        onClose={() => setEvaluationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>AI Code Evaluation</DialogTitle>

        <DialogContent dividers>
          {isCodeEvalLoading ? (
            <Typography color="text.secondary">Evaluating code...</Typography>
          ) : codeEvaluation ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 4,
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Current Complexity
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Time
                      </Typography>
                      <Typography variant="body1">
                        {codeEvaluation.timeComplexity}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Space
                      </Typography>
                      <Typography variant="body1">
                        {codeEvaluation.spaceComplexity}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Optimal Complexity
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Time
                      </Typography>
                      <Typography variant="body1">
                        {codeEvaluation.optimalTimeComplexity}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Space
                      </Typography>
                      <Typography variant="body1">
                        {codeEvaluation.optimalSpaceComplexity}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Code Style
                </Typography>

                <Typography variant="body1">
                  {codeEvaluation.codeStyle}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Suggestions
                </Typography>

                {codeEvaluation.suggestions.length > 0 ? (
                  <Box
                    component="ul"
                    sx={{
                      mt: 0,
                      mb: 0,
                      pl: 3,
                      listStyleType: "disc",
                    }}
                  >
                    {codeEvaluation.suggestions.map((suggestion, index) => (
                      <Box
                        component="li"
                        key={index}
                        sx={{
                          display: "list-item",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body1">{suggestion}</Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No suggestions.
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Typography color="text.secondary">
              Ask AI to analyze your current code.
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEvaluationDialogOpen(false)}>Close</Button>

          <Button
            variant="contained"
            onClick={onCodeEval}
            disabled={isCodeEvalLoading}
            sx={{ m: 1 }}
            startIcon={
              isCodeEvalLoading ? <CircularProgress size={16} /> : undefined
            }
          >
            {isCodeEvalLoading ? "Evaluating..." : "Evaluate Code"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={hintDialogOpen}
        onClose={() => setHintDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Hint</DialogTitle>

        <DialogContent dividers>
          {isHintLoading ? (
            <Typography color="text.secondary">Generating hint...</Typography>
          ) : hint ? (
            <Typography variant="body1">{hint}</Typography>
          ) : (
            <Typography color="text.secondary">Ask AI for a hint.</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setHintDialogOpen(false)}>Close</Button>

          <Button
            variant="contained"
            onClick={onHintGen}
            disabled={isHintLoading}
            sx={{ m: 1 }}
            startIcon={
              isHintLoading ? <CircularProgress size={16} /> : undefined
            }
          >
            {isHintLoading ? "Generating..." : "Generate Hint"}
          </Button>
        </DialogActions>
      </Dialog>

      <Group orientation="horizontal" style={{ height: "100%", minHeight: 0 }}>
        {/* LEFT */}
        <Panel defaultSize={"50%"} minSize={"30%"}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                flexShrink: 0,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Button variant="outlined" onClick={onOpenProblemSelector}>
                Change Problem
              </Button>
              <Tooltip title="Reset to default code">
                <IconButton onClick={() => setResetDialogOpen(true)}>
                  <RestoreIcon />
                </IconButton>
              </Tooltip>

              <Dialog
                open={resetDialogOpen}
                onClose={() => setResetDialogOpen(false)}
              >
                <DialogTitle>Reset Code?</DialogTitle>

                <DialogContent>
                  <Typography>
                    Your code will be discarded and the default code will be
                    set.
                  </Typography>
                </DialogContent>

                <DialogActions>
                  <Button onClick={() => setResetDialogOpen(false)}>
                    Cancel
                  </Button>

                  <Button
                    onClick={() => {
                      onResetCode();
                      setResetDialogOpen(false);
                    }}
                    color="error"
                  >
                    Reset
                  </Button>
                </DialogActions>
              </Dialog>
              <Stopwatch
                stopwatch={stopwatch}
                onStopwatchAction={onStopwatchAction}
                isDisabled={stopwatchDisabled}
              />
              <Tooltip title="Ask AI to evaluate your code">
                <span>
                  <Button
                    variant="outlined"
                    onClick={() => setEvaluationDialogOpen(true)}
                    disabled={!problem}
                    startIcon={
                      isCodeEvalLoading ? (
                        <CircularProgress size={16} />
                      ) : undefined
                    }
                  >
                    {isCodeEvalLoading ? "Evaluating..." : "Evaluate"}
                  </Button>
                </span>
              </Tooltip>

              <Tooltip title="Ask AI to generate a hint">
                <span>
                  <Button
                    variant="outlined"
                    onClick={() => setHintDialogOpen(true)}
                    disabled={!problem}
                    startIcon={
                      isHintLoading ? <CircularProgress size={16} /> : undefined
                    }
                  >
                    {isHintLoading ? "Generating..." : "Hint"}
                  </Button>
                </span>
              </Tooltip>
              {toolbarActions}
            </Box>
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflow: "auto",
                p: 2,
                "&::after": {
                  content: '""',
                  display: "block",
                  height: 48,
                },
              }}
            >
              {problem ? (
                <>
                  <Typography variant="h5" gutterBottom>
                    {problem.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Difficulty: {problem.difficulty}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      mt: 2,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {problem.description}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    color="primary"
                    sx={{ mt: 3, mb: 1 }}
                  >
                    Constraints
                  </Typography>

                  <Box
                    sx={{
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      px: 2,
                      py: 1,
                      width: "fit-content",
                      maxWidth: "100%",
                    }}
                  >
                    <List
                      sx={{
                        m: 0,
                        pl: 2,
                      }}
                    >
                      {(problem.constraints ?? []).map((c, i) => (
                        <ListItem
                          key={i}
                          sx={{
                            display: "list-item",
                            listStyleType: "disc",
                            py: 0.25,
                            pl: 0,
                          }}
                        >
                          <Typography variant="body2">{c}</Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Typography
                    variant="subtitle1"
                    color="primary"
                    sx={{ mt: 3, mb: 1 }}
                  >
                    Examples
                  </Typography>

                  <List>
                    {(problem.examples ?? []).map((ex, i) => (
                      <ListItem
                        key={i}
                        sx={{
                          display: "block",
                          paddingLeft: 0,
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ mb: 1, fontWeight: 600 }}
                        >
                          Example {i + 1}
                        </Typography>
                        {ex.images.length > 0 &&
                          ex.images.map((image, imgIndex) => (
                            <Box
                              key={imgIndex}
                              component="img"
                              src={image}
                              alt={`Example ${i + 1}`}
                              sx={{
                                width: "350px",
                                maxWidth: "100%",
                                height: "auto",
                                display: "block",
                                mb: 1,
                              }}
                            />
                          ))}

                        <Typography
                          variant="body2"
                          component="pre"
                          sx={{
                            display: "inline-block",
                            whiteSpace: "pre-wrap",
                            fontFamily: "monospace",
                            backgroundColor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                            padding: 1.5,
                            mt: 1,
                          }}
                        >
                          {ex.text}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </>
              ) : null}
            </Box>
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
                  remoteCursors={remoteCursors}
                  onChange={onCodeChange}
                  onCursorChange={onCursorChange}
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
                    onSubmit={onSubmit}
                  />
                </Box>
              ) : null}
            </Panel>
          </Group>
        </Panel>
      </Group>
    </>
  );
}
