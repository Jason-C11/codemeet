"use client";

import { ReactNode } from "react";
import { useSnackbar } from "@/hooks/useSnackbar";
import { Snackbar, Alert } from "@mui/material";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import { ThemeContextProvider, useThemeContext } from "@/context/ThemeContext";
import CssBaseline from "@mui/material/CssBaseline";
import { themes } from "@/themes/theme";
import Navbar from "@/components/Navbar";

function AppContent({ children }: { children: ReactNode }) {
  const { themeName } = useThemeContext();
  const { snackbar, closeSnackbar } = useSnackbar();

  return (
    <ThemeProvider theme={themes[themeName]}>
      <CssBaseline />
      <AuthProvider>
        <Navbar />
        {children}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={snackbar.severity === "error" ? 6000 : 3000}
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

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <ThemeContextProvider>
      <AppContent>{children}</AppContent>
    </ThemeContextProvider>
  );
}
