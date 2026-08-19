export type SubmissionResults = {
  status: "ACCEPTED" | "WRONG_ANSWER" | "RUNTIME_ERROR";
  passed: number;
  total: number;
};