import { executeCode } from "../services/execution/sandbox.js";

export const exec = async (req, res) => {
  try {
    const { code } = req.body;
    const execResult = await executeCode(code);
    res.status(200).json(execResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
