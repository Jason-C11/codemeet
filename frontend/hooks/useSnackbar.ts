import { useState } from "react";
import type { AlertColor } from "@mui/material/Alert";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: AlertColor;
};

let setGlobalSnackbar: ((state: SnackbarState) => void) | null = null;

export function useSnackbar() {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  setGlobalSnackbar = setSnackbar;

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return { snackbar, closeSnackbar };
}

export function triggerSnackbar(
  message: string,
  severity: AlertColor = "success",
) {
  if (setGlobalSnackbar) {
    setGlobalSnackbar({
      open: true,
      message,
      severity,
    });
  }
}