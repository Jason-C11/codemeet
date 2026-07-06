import { executeCode } from "../services/execution/sandbox.js";
import Problem from "../models/Problem.js";
export const exec = async (req, res) => {
  try {
    const { code, testCases } = req.body;
    const problem = await Problem.findOne({ problemId: req.params.id });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const metaData = {
      mode: "exec",
      problemId: problem.problemId,
      entry: { className: "Solution", methodNames: problem.methodNames },
      testCases: testCases,
      timeoutMs: 3000,
    };

    const execResult = await executeCode(code, metaData);
    res.status(200).json(execResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
