"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useCallback, useRef } from "react";
import { Box } from "@mui/material";
import {
  getAllProblems,
  getProblemById,
  executeCode,
  submitCode,
  aiCodeEvaluation,
  aiHintGeneration,
} from "@/lib/api";
import { Problem } from "@/lib/types/Problem";
import { TestCase } from "@/lib/types/TestCase";
import { CodeEvaluation } from "@/lib/types/CodeEvaluation";
import { TestCaseResult } from "@/lib/types/TestCaseResult";
import { parseParameter } from "@/utils/typeParser";
import { triggerSnackbar } from "@/hooks/useSnackbar";
import CodeInterface from "@/components/CodeInterface";
import ProblemModal from "@/components/ProblemModal";
import { SubmissionResults } from "@/lib/types/SubmissionResults";
import SubmissionViewer from "@/components/SubmissionViewer";
import useInterviewRoom, { RoomState } from "@/hooks/useInterviewRoom";
import RoomControls from "@/components/RoomControls";
import { EditorSelection, RemoteCursor } from "@/lib/types/EditorSelection";
import VideoGrid from "@/components/VideoGrid";
import useWebRTC from "@/hooks/useWebRTC";
import { useRouter } from "next/navigation";

const InterviewPage = ({ initialRoomID }: { initialRoomID?: string }) => {
  const { user } = useAuth();
  const router = useRouter();

  // ==================== State

  const [problems, setProblems] = useState<Problem[]>([]);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState<string>("");
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [results, setResults] = useState<TestCaseResult[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submissionResults, setSubmissionResults] =
    useState<SubmissionResults | null>(null);

  const [evaluation, setEvaluation] = useState<CodeEvaluation | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [isCodeEvalLoading, setIsCodeEvalLoading] = useState(false);
  const [isHintLoading, setIsHintLoading] = useState(false);

  // Local cursor/selection
  const [selection, setSelection] = useState<EditorSelection>({
    startLine: 1,
    endLine: 1,
    startColumn: 1,
    endColumn: 1,
    hasHighlight: false,
  });

  const selectionRef = useRef<EditorSelection>(selection);

  // Remote cursors
  const [remoteCursors, setRemoteCursors] = useState<RemoteCursor[]>([]);

  // ==================== Problem Loading

  const loadProblem = useCallback(async (problemId: string) => {
    try {
      const problem = await getProblemById(problemId);
      const sampleTestCases = problem.sampleTestCases ?? [];

      setProblem(problem);
      setCode(problem.starterCode ?? "");
      setTestCases(sampleTestCases);
      setEvaluation(null);
      setHint(null);

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
  // ----- Remote Cursor Changes

  const handleRemoteCursorChange = useCallback((remoteCursor: RemoteCursor) => {
    setRemoteCursors((prev) => {
      const existing = prev.find(
        (cursor) => cursor.username === remoteCursor.username,
      );

      if (existing) {
        return prev.map((cursor) =>
          cursor.username === remoteCursor.username ? remoteCursor : cursor,
        );
      }

      return [...prev, remoteCursor];
    });
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
    socket,
    roomID,
    roomEvent,
    roomError,
    roomUsers,
    stopwatch,
    createRoom,
    joinRoom,
    leaveRoom,
    emitCodeChange,
    emitProblemChange,
    emitTestCasesChange,
    emitCursorChange,
    emitMediaState,
    emitStopwatchAction,
  } = useInterviewRoom({
    onRoomState: handleRoomState,
    onCodeChange: handleRemoteCodeChange,
    onProblemChange: handleProblemChange,
    onTestCasesChange: handleRemoteTestCasesChange,
    onCursorChange: handleRemoteCursorChange,
  });

  useEffect(() => {
    const activeUsernames = new Set(roomUsers.map((user) => user.username));

    setRemoteCursors((prev) =>
      prev.filter((cursor) => activeUsernames.has(cursor.username)),
    );
  }, [roomUsers]);

  // ==================== Room Actions

  const handleCreateRoom = async () => {
    try {
      await getLocalStream();
      createRoom(problem?.problemId ?? null, code, testCases);
    } catch (error) {
      console.error("Error accessing camera/microphone:", error);
      triggerSnackbar(
        "Failed to access camera/microphone. Please check your device settings.",
        "error",
      );
    }
  };

  const handleJoinRoom = async (roomID: string) => {
    try {
      await getLocalStream();
      joinRoom(roomID);
    } catch (error) {
      console.error("Error accessing camera/microphone:", error);
      triggerSnackbar(
        "Failed to access camera/microphone. Please check your device settings.",
        "error",
      );
    }
  };

  // ==================== Initialize Problems

  useEffect(() => {
    const initializeProblems = async () => {
      try {
        const problems = await getAllProblems();

        setProblems(problems);

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

  const codeChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value ?? "";

    setCode(newCode);

    if (codeChangeTimeoutRef.current) {
      clearTimeout(codeChangeTimeoutRef.current);
    }

    codeChangeTimeoutRef.current = setTimeout(() => {
      emitCodeChange(newCode, selection);
    }, 50);
  };

  const handleResetCode = () => {
    if (!problem) return;

    const resetCode = problem.starterCode ?? "";

    setCode(resetCode);

    emitCodeChange(resetCode, selectionRef.current);
  };

  // ==================== Code Selection

  const handleCursorChange = useCallback(
    (newSelection: EditorSelection) => {
      selectionRef.current = newSelection;
      setSelection(newSelection);

      emitCursorChange(newSelection);
    },
    [emitCursorChange],
  );

  // ==================== WebRTC
  const {
    localStream,
    remoteStreamsState,
    toggleMic,
    toggleCamera,
    getLocalStream,
    cleanupWebRTC,
    createOffer,
  } = useWebRTC({ socket });

  useEffect(() => {
    const handleRoomUserJoined = ({
      socketID,
      username,
    }: {
      socketID: string;
      username: string;
    }) => {
      if (!user) return;
      // Don't create an offer to ourselves
      if (socketID === socket.id) return;

      createOffer(username);
    };

    socket.on("roomUserJoined", handleRoomUserJoined);

    return () => {
      socket.off("roomUserJoined", handleRoomUserJoined);
    };
  }, [socket, user, createOffer]);

  const handleLeaveRoom = () => {
    cleanupWebRTC();
    leaveRoom();
    router.push("/interview");
  };

  const handleToggleMic = () => {
    const micEnabled = toggleMic();
    const cameraEnabled = localStream?.getVideoTracks()[0]?.enabled ?? false;

    emitMediaState(micEnabled, cameraEnabled);
    return micEnabled;
  };

  const handleToggleCamera = () => {
    const cameraEnabled = toggleCamera();
    const micEnabled = localStream?.getAudioTracks()[0]?.enabled ?? false;

    emitMediaState(micEnabled, cameraEnabled);
    return cameraEnabled;
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

        if (index < sampleCount) {
          return testCase;
        }

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

  // ==================== Code Evaluation

  const handleCodeEval = async () => {
    if (!problem) return;

    if (!user) {
      triggerSnackbar("You must be logged in to analyze code.", "error");
      return;
    }

    setIsCodeEvalLoading(true);

    try {
      const response = await aiCodeEvaluation(problem.problemId, code);

      setEvaluation(response);
    } catch (err) {
      if (err instanceof Error) {
        triggerSnackbar(err.message, "error");
      } else {
        triggerSnackbar("Failed to analyze code.", "error");
      }
    } finally {
      setIsCodeEvalLoading(false);
    }
  };

  // ==================== Hint Generation

  const handleHintGen = async () => {
    if (!problem) return;

    if (!user) {
      triggerSnackbar("You must be logged in to receive hints.", "error");
      return;
    }

    setIsHintLoading(true);

    try {
      const response = await aiHintGeneration(problem.problemId, code);

      setHint(response.hint);
    } catch (err) {
      if (err instanceof Error) {
        triggerSnackbar(err.message, "error");
      } else {
        triggerSnackbar("Failed to generate hint.", "error");
      }
    } finally {
      setIsHintLoading(false);
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
      {localStream && (
        <VideoGrid
          localStream={localStream}
          remoteStreams={remoteStreamsState}
          username={user?.username ?? "You"}
          toggleMic={handleToggleMic}
          toggleCamera={handleToggleCamera}
          roomUsers={roomUsers}
          onLeaveRoom={handleLeaveRoom}
        />
      )}
      <CodeInterface
        problem={problem}
        code={code}
        testCases={testCases}
        results={results}
        remoteCursors={remoteCursors}
        codeEvaluation={evaluation}
        hint={hint}
        isCodeEvalLoading={isCodeEvalLoading}
        isHintLoading={isHintLoading}
        onCodeChange={handleCodeChange}
        onResetCode={handleResetCode}
        onCursorChange={handleCursorChange}
        onRun={handleRun}
        onOpenProblemSelector={() => setModalOpen(true)}
        onSetTestCases={handleTestCasesChange}
        onSubmit={handleSubmit}
        stopwatch={stopwatch}
        onStopwatchAction={emitStopwatchAction}
        stopwatchDisabled={roomID === null}
        onCodeEval={handleCodeEval}
        onHintGen={handleHintGen}
        toolbarActions={
          <RoomControls
            roomID={roomID}
            initialRoomID={initialRoomID}
            roomEvent={roomEvent}
            roomError={roomError}
            roomUsers={roomUsers}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onLeaveRoom={handleLeaveRoom}
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
