"use client";

import {
  Alert,
  AlertTitle,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import { SubmissionResults } from "@/lib/types/SubmissionResults";
import CloseIcon from "@mui/icons-material/Close";

interface SubmissionViewerProps {
  result: SubmissionResults | null;
  open: boolean;
  onClose: () => void;
}

export default function SubmissionViewer({
  result,
  open,
  onClose,
}: SubmissionViewerProps) {
  if (!result) {
    return null;
  }

  const severity =
    result.status === "ACCEPTED"
      ? "success"
      : result.status === "WRONG_ANSWER"
        ? "error"
        : "warning";

  const title =
    result.status === "ACCEPTED"
      ? "Accepted"
      : result.status === "WRONG_ANSWER"
        ? "Wrong Answer"
        : result.status === "TIMEOUT_ERROR"
          ? "Time Limit Exceeded"
          : "Runtime Error";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <IconButton
        onClick={onClose}
        aria-label="close"
        sx={{
          position: "absolute",
          right: 2,
          top: 2,
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 5 }}>
        <Alert severity={severity}>
          <AlertTitle>{title}</AlertTitle>

          {result.status === "RUNTIME_ERROR"
            ? "Your code encountered a runtime error."
            : result.status === "TIMEOUT_ERROR"
              ? "Your code exceeded the time limit."
              : `${result.passed} / ${result.total} test cases passed`}
        </Alert>
      </DialogContent>
    </Dialog>
  );
}
