"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import {
  getAllProblems,
  getProblemById,
  executeCode,
  submitCode,
} from "@/lib/api";
import { Problem } from "@/lib/types/Problem";
import { TestCase } from "@/lib/types/TestCase";
import { TestCaseResult } from "@/lib/types/TestCaseResult";
import { parseParameter } from "@/utils/typeParser";
import { triggerSnackbar } from "@/hooks/useSnackbar";
import CodeInterface from "@/components/CodeInterface";
import ProblemModal from "@/components/ProblemModal";
import { SubmissionResults } from "@/lib/types/SubmissionResults";
import SubmissionViewer from "@/components/SubmissionViewer";
import useInterviewRoom, { RoomState } from "@/hooks/useInterviewRoom";
import RoomControls from "@/components/RoomControls";

const InterviewPage = ({ initialRoomID }: { initialRoomID?: string }) => {
  const { user } = useAuth();

  // ==================== State

  const [problems, setProblems] = useState<Problem[]>([]);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState<string>("");
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [results, setResults] = useState<TestCaseResult[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submissionResults, setSubmissionResults] =
    useState<SubmissionResults | null>(null);

  // ==================== Problem Loading

  const loadProblem = useCallback(async (problemId: string) => {
    try {
      const problem = await getProblemById(problemId);
      const sampleTestCases = problem.sampleTestCases ?? [];

      setProblem(problem);
      setCode(problem.starterCode ?? "");
      setTestCases(sampleTestCases);

      setResults(
        sampleTestCases.map(
          (testCase: TestCase): TestCaseResult => ({
            input: testCase.input,
            actual: "",
          }),
        ),
      );

      return problem;
    } catch (err) {
      console.error(`Failed to load problem: ${problemId}`, err);

      return null;
    }
  }, []);

  // ==================== Socket Synchronization

  // ----- Remote Code Changes

  const handleRemoteCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  // ----- Remote Room State

  const handleRoomState = useCallback(
    async (state: RoomState) => {
      if (state.problemId) {
        await loadProblem(state.problemId);
      }

      setCode(state.code);
      setTestCases(state.testCases);
    },
    [loadProblem],
  );

  // ----- Remote Problem Changes

  const handleProblemChange = useCallback(
    async (problemId: string) => {
      setProblem(null);
      setTestCases([]);
      setResults([]);

      await loadProblem(problemId);
    },
    [loadProblem],
  );

  // ----- Remote Test Case Changes

  const handleRemoteTestCasesChange = useCallback(
    (updatedTestCases: TestCase[]) => {
      setTestCases(updatedTestCases);

      setResults(
        updatedTestCases.map((testCase) => ({
          input: testCase.input,
          actual: "",
        })),
      );
    },
    [],
  );

  const {
    roomID,
    roomEvent,
    roomError,
    roomUsers,
    createRoom,
    joinRoom,
    leaveRoom,
    emitCodeChange,
    emitProblemChange,
    emitTestCasesChange,
  } = useInterviewRoom({
    onRoomState: handleRoomState,
    onCodeChange: handleRemoteCodeChange,
    onProblemChange: handleProblemChange,
    onTestCasesChange: handleRemoteTestCasesChange,
  });

  // ==================== Room Actions

  const handleCreateRoom = () => {
    createRoom(problem?.problemId ?? null, code, testCases);
  };

  // ==================== Initialize Problems

  useEffect(() => {
    const initializeProblems = async () => {
      try {
        const problems = await getAllProblems();

        setProblems(problems);

        // When joining an existing room, the room state
        // determines the problem instead.
        if (!initialRoomID) {
          const defaultProblem = problems[0];

          if (defaultProblem) {
            await loadProblem(defaultProblem.problemId);
          }
        }
      } catch (err) {
        console.error("Failed to initialize problems:", err);
      }
    };

    initializeProblems();
  }, [loadProblem, initialRoomID]);

  // ==================== Problem Actions

  const handleSelectProblem = async (selected: Problem) => {
    if (problem?.problemId === selected.problemId) {
      return;
    }

    const loadedProblem = await loadProblem(selected.problemId);

    if (!loadedProblem) return;

    emitProblemChange(
      loadedProblem.problemId,
      loadedProblem.starterCode ?? "",
      loadedProblem.sampleTestCases ?? [],
    );

    setModalOpen(false);
  };

  // ==================== Code Actions

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value ?? "";

    setCode(newCode);
    emitCodeChange(newCode);
  };

  const handleResetCode = () => {
    if (!problem) return;

    const resetCode = problem.starterCode ?? "";

    setCode(resetCode);
    emitCodeChange(resetCode);
  };

  // ==================== Test Case Actions

  const handleTestCasesChange = useCallback(
    (updated: TestCase[]) => {
      setTestCases(updated);
      emitTestCasesChange(updated);
    },
    [emitTestCasesChange],
  );

  // ==================== Run

  const handleRun = async () => {
    if (!problem) return;

    if (!user) {
      triggerSnackbar("You must be logged in to run code.", "error");
      return;
    }

    try {
      setResults([]);

      const formattedTestCases = testCases.map((testCase, index) => {
        const sampleCount = problem.sampleTestCases?.length ?? 0;

        // Sample test cases already match backend format
        if (index < sampleCount) {
          return testCase;
        }

        // Convert custom test case inputs from strings
        return {
          input: testCase.input.map((value, paramIndex) => {
            try {
              return parseParameter(value, problem.params[paramIndex].type);
            } catch (err) {
              const paramName = problem.params[paramIndex].name;

              throw new Error(
                `Custom Test Case ${
                  index + 1 - sampleCount
                }: Invalid input for "${paramName}": ${
                  err instanceof Error ? err.message : "Invalid value"
                }`,
              );
            }
          }),
          expected: testCase.expected,
        };
      });

      const response = await executeCode(
        problem.problemId,
        code,
        formattedTestCases,
      );

      if (response.status.includes("ERROR")) {
        triggerSnackbar(response.status, "error");
        return;
      }

      setResults(response.result?.results || []);
    } catch (err) {
      if (err instanceof Error) {
        triggerSnackbar(err.message, "error");
      } else {
        triggerSnackbar("Failed to run code.", "error");
      }
    }
  };

  // ==================== Submit

  const handleSubmit = async () => {
    if (!problem) return;

    if (!user) {
      triggerSnackbar("You must be logged in to submit code.", "error");
      return;
    }

    try {
      const response = await submitCode(problem.problemId, code);

      setSubmissionResults(response.result);
    } catch (err) {
      if (err instanceof Error) {
        triggerSnackbar(err.message, "error");
      } else {
        triggerSnackbar("Failed to submit code.", "error");
      }
    }
  };

  // ==================== Render

  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 50px)",
        overflow: "hidden",
      }}
    >
      <CodeInterface
        problem={problem}
        code={code}
        testCases={testCases}
        results={results}
        onCodeChange={handleCodeChange}
        onResetCode={handleResetCode}
        onRun={handleRun}
        onOpenProblemSelector={() => setModalOpen(true)}
        onSetTestCases={handleTestCasesChange}
        onSubmit={handleSubmit}
        toolbarActions={
          <RoomControls
            roomID={roomID}
            initialRoomID={initialRoomID}
            roomEvent={roomEvent}
            roomError={roomError}
            roomUsers={roomUsers}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={joinRoom}
            onLeaveRoom={leaveRoom}
          />
        }
      />

      <ProblemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        problems={problems}
        onSelect={handleSelectProblem}
      />

      <SubmissionViewer
        result={submissionResults}
        open={submissionResults !== null}
        onClose={() => setSubmissionResults(null)}
      />
    </Box>
  );
};

export default InterviewPage;
