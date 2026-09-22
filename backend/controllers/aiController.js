import { evaluateCode, generateHint } from "../services/ai/aiService.js";
import Problem from "../models/Problem.js";

export const aiCodeEvaluation = async (req, res) => {
  try {
    const { code } = req.body;
    const problem = await Problem.findOne(
      { problemId: req.params.id },
      { hiddenTestCases: 0 },
    );

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const evalResult = await evaluateCode(
      problem.description,
      problem.constraints,
      code,
    );
    return res.status(200).json(evalResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const aiHintGeneration = async (req, res) => {
  try {
    const { code } = req.body;
    const problem = await Problem.findOne(
      { problemId: req.params.id },
      { hiddenTestCases: 0 },
    );

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const hint = await generateHint(
      problem.description,
      problem.constraints,
      code,
    );
    return res.status(200).json(hint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
