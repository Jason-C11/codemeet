export type Difficulty = "Easy" | "Medium" | "Hard";

export type TestCase = {
  input: string;
  output: string;
};

export type Problem = {
  problemId: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  examples: string[];
  constraints: string[];
  starterCode: string;
  testCases: TestCase[];
};
