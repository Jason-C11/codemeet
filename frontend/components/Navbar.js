"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "@/context/AuthContext";
import { logout as logoutRequest } from "@/lib/api";
import { triggerSnackbar } from "@/hooks/useSnackbar";

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutRequest();
      logout();
      triggerSnackbar("Logout successful!", "success");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            CodeMeet.io
          </Typography>

          {user && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button color="inherit">Practice</Button>
              <Button color="inherit">Interviews</Button>
              <Button color="inherit">Rooms</Button>
            </Box>
          )}
        </Box>

        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2">
              {user.username || user.email}
            </Typography>

            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
