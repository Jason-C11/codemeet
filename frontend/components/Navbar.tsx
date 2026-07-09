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
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
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
    <AppBar
      position="static"
      elevation={1}
      sx={{ borderBottom: "1px solid", borderColor: "divider", boxShadow: 1 }}
    >
      <Toolbar
        variant="dense"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button color="inherit" onClick={() => router.push("/")}>
            CodeMeet.io
          </Button>

          {
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button color="inherit" onClick={() => router.push("/practice")}>
                Practice
              </Button>
              <Button color="inherit">Interviews</Button>
              <Button color="inherit">Rooms</Button>
            </Box>
          }
        </Box>

        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2">
              {user.username || user.email}
            </Typography>

            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit" onClick={() => router.push("/?view=login")}>
              Login
            </Button>

            <Button
              variant="contained"
              disableElevation
              sx={{
                boxShadow: "none",
              }}
              onClick={() => router.push("/?view=signup")}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
