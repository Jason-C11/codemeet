"use client";

import { ReactNode } from "react";
import { useSnackbar } from "@/hooks/useSnackbar";
import { Snackbar, Alert } from "@mui/material";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/themes/theme";
import Navbar from "@/components/Navbar";

export default function AppShell({ children }: { children: ReactNode }) {
  const { snackbar, closeSnackbar } = useSnackbar();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Navbar />
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
      </AuthProvider>
    </ThemeProvider>
  );
}
