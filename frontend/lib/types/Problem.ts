import { TestCase } from "./TestCase";
export type Difficulty = "Easy" | "Medium" | "Hard";

export type DBTypes =
  | "int"
  | "float"
  | "string"
  | "boolean"
  | "int[]"
  | "float[]"
  | "string[]"
  | "boolean[]"
  | "int[][]"
  | "float[][]"
  | "string[][]"
  | "boolean[][]"
  | "void";

export type Param = {
  name: string;
  type: DBTypes;
};

export type Example = {
  text: string;
  images: string[];
};

export type Problem = {
  problemId: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  params: Param[];
  returnType: DBTypes;
  examples: Example[];
  constraints: string[];
  starterCode: string;
  sampleTestCases: TestCase[];
};
