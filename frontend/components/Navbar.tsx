"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "@/context/AuthContext";
import { logout as logoutRequest } from "@/lib/api";
import { triggerSnackbar } from "@/hooks/useSnackbar";
import { useRouter } from "next/navigation";
import { useThemeContext } from "@/context/ThemeContext";
import { useState } from "react";
import PaletteIcon from "@mui/icons-material/Palette";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { themeName, setThemeName } = useThemeContext();

  const [themeMenuAnchor, setThemeMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  const themeMenuOpen = Boolean(themeMenuAnchor);

  const handleThemeClick = (event: React.MouseEvent<HTMLElement>) => {
    setThemeMenuAnchor(event.currentTarget);
  };

  const handleThemeClose = () => {
    setThemeMenuAnchor(null);
  };

  const handleThemeChange = (
    theme: "slate-orange" | "indigo-slate" | "indigo" | "light",
  ) => {
    setThemeName(theme);
    setThemeMenuAnchor(null);
  };

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
      position="sticky"
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
              <Button color="inherit" onClick={() => router.push("/interviews")}>
                Interviews
              </Button>
            </Box>
          }
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={handleThemeClick}
            color="inherit"
            aria-label="Change appearance"
          >
            <PaletteIcon />
          </IconButton>
          <Menu
            anchorEl={themeMenuAnchor}
            open={themeMenuOpen}
            onClose={handleThemeClose}
          >
            <MenuItem
              selected={themeName === "slate-orange"}
              onClick={() => handleThemeChange("slate-orange")}
            >
              <ListItemText primary="Slate & Orange" />
            </MenuItem>

            <MenuItem
              selected={themeName === "indigo-slate"}
              onClick={() => handleThemeChange("indigo-slate")}
            >
              <ListItemText primary="Indigo & Slate" />
            </MenuItem>

            <MenuItem
              selected={themeName === "indigo"}
              onClick={() => handleThemeChange("indigo")}
            >
              <ListItemText primary="Indigo" />
            </MenuItem>

            <MenuItem
              selected={themeName === "light"}
              onClick={() => handleThemeChange("light")}
            >
              <ListItemText primary="Light" />
            </MenuItem>
          </Menu>

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
              <Button
                variant="outlined"
                color="primary"
                onClick={() => router.push("/?view=login")}
              >
                Login
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push("/?view=signup")}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
