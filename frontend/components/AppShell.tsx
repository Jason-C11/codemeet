"use client";

import { ReactNode } from "react";
import { useSnackbar } from "@/hooks/useSnackbar";
import { Snackbar, Alert } from "@mui/material";
import Navbar from "@/components/Navbar";

export default function AppShell({ children }: { children: ReactNode }) {
  const { snackbar, closeSnackbar } = useSnackbar();

  return (
    <>
    <Navbar/>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
