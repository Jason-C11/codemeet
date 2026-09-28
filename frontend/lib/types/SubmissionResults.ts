export type SubmissionResults = {
  status: "ACCEPTED" | "WRONG_ANSWER" | "RUNTIME_ERROR" | "TIMEOUT_ERROR";
  passed: number;
  total: number;
};