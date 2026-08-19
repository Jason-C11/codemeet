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
import CodeEditor from "@/components/CodeEditor";
import TestCaseEditor from "@/components/TestCaseEditor";
import { Problem } from "@/lib/types/Problem";
import { TestCase } from "@/lib/types/TestCase";
import { TestCaseResult } from "@/lib/types/TestCaseResult";
import RestoreIcon from "@mui/icons-material/Restore";
import { useState } from "react";

type Props = {
  problem: Problem | null;
  code: string;
  testCases: TestCase[];
  results: TestCaseResult[];
  onCodeChange: (value: string | undefined) => void;
  onResetCode: () => void;
  onRun: () => void;
  onSubmit: () => void;
  onOpenProblemSelector: () => void;
  onSetTestCases: (testCases: TestCase[]) => void;
};

export default function CodeInterface({
  problem,
  code,
  testCases,
  results,
  onCodeChange,
  onResetCode,
  onRun,
  onSubmit,
  onOpenProblemSelector,
  onSetTestCases,
}: Props) {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  return (
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
                  Your code will be discarded and the default code will be set.
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

                <Typography variant="body2" color="text.secondary" gutterBottom>
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
                  onSubmit={onSubmit}
                />
              </Box>
            ) : null}
          </Panel>
        </Group>
      </Panel>
    </Group>
  );
}
