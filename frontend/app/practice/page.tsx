"use client";

import { useAuth } from "@/context/AuthContext";
import CodeInterface from "@/components/CodeInterface";
import { useState, useEffect } from "react";
import ProblemModal from "@/components/ProblemModal";
import { Box } from "@mui/material";
import { getAllProblems, getProblemById } from "@/lib/api";
import { Problem } from "@/lib/types/Problem";

export default function PracticePage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [problem, setProblem] = useState<Problem | null>(null);

  const [code, setCode] = useState<string>("");

  const [modalOpen, setModalOpen] = useState(false);

  const { user } = useAuth(); // check auth before submission attempts

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllProblems();

        setProblems(res);
        const firstProb = res[0];
        if (firstProb) {
          const res = await getProblemById(firstProb.problemId);
          setProblem(res);
          setCode(res.starterCode);
        }
      } catch (err) {
        console.error("Failed to load problems:", err);
      }
    };

    load();
  }, []);

  const handleSelectProblem = async (p: Problem) => {
    try {
      const res = await getProblemById(p.problemId);
      setProblem(res);
      setCode(res.starterCode);
    } catch (err) {
      console.error(err);
    }
  };

  // To do
  const handleRandom = () => {
    const p = problems[Math.floor(Math.random() * problems.length)];

    setProblem(p);
  };

  const handleRun = async () => {};

  return (
    <Box>
      <CodeInterface
        problem={problem}
        code={code}
        onCodeChange={(value) => setCode(value || "")}
        onRun={handleRun}
        onOpenProblemSelector={() => setModalOpen(true)}
      />
      <ProblemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        problems={problems}
        onSelect={(selectedProblem: any) =>
          handleSelectProblem(selectedProblem)
        }
      />
    </Box>
  );
}
