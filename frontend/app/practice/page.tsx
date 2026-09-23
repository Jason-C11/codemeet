"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useCallback } from "react";
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

export default function PracticePage() {
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

  const { user } = useAuth();

  const getCodeStorageKey = (problemId: string) => `codemeet-code-${problemId}`;

  useEffect(() => {
    if (!problem) return;

    localStorage.setItem(getCodeStorageKey(problem.problemId), code);
  }, [code, problem]);

  const loadProblem = useCallback(async (problemId: string) => {
    try {
      const problem = await getProblemById(problemId);

      setProblem(problem);
      setEvaluation(null);
      setHint(null);

      const savedCode = localStorage.getItem(getCodeStorageKey(problemId));

      setCode(savedCode ?? problem.starterCode ?? "");

      const sampleTestCases = problem.sampleTestCases || [];
      setTestCases(sampleTestCases);

      setResults(
        sampleTestCases.map((testCase: TestCase) => ({
          input: testCase.input,
          actual: "",
        })),
      );
    } catch (err) {
      console.error(`Failed to load problem: ${problemId}`, err);
    }
  }, []);

  useEffect(() => {
    const initializeProblems = async () => {
      try {
        const problems = await getAllProblems();
        setProblems(problems);

        const defaultProblem = problems[0];

        if (defaultProblem) {
          await loadProblem(defaultProblem.problemId);
        }
      } catch (err) {
        console.error("Failed to initialize problems:", err);
      }
    };

    initializeProblems();
  }, [loadProblem]);

  const handleSelectProblem = async (selected: Problem) => {
    if (problem?.problemId === selected.problemId) return;

    await loadProblem(selected.problemId);
    setModalOpen(false);
  };

  const handleResetCode = () => {
    if (!problem) return;

    setCode(problem.starterCode ?? "");
  };

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
        codeEvaluation={evaluation}
        hint={hint}
        isCodeEvalLoading={isCodeEvalLoading}
        isHintLoading={isHintLoading}
        onCodeChange={(value) => setCode(value || "")}
        onResetCode={handleResetCode}
        onRun={handleRun}
        onOpenProblemSelector={() => setModalOpen(true)}
        onSetTestCases={(updated) => setTestCases(updated)}
        onSubmit={handleSubmit}
        onCodeEval={handleCodeEval}
        onHintGen={handleHintGen}
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
}
