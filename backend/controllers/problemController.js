import Problem from "../models/Problem.js";

export const getProblemById = async (req, res) => {
  try {
    
    const problem = await Problem.findOne( { problemId: req.params.id });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find({}, "problemId title difficulty");
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};
