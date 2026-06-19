"use client";

import { useState } from "react";
import {
  Alert,
  Dialog,
  DialogContent,
  Box,
  Snackbar,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { login as loginRequest, signup as signupRequest } from "@/lib/api";
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
} from "../utils/validation";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "@/hooks/useSnackbar";

export default function AuthModal({
  open,
  handleClose,
  initialView = "login",
}) {
  const [view, setView] = useState(initialView);

  const toggleView = () => {
    setView(view === "login" ? "signup" : "login");
  };

  const [showPassword, setShowPassword] = useState(false);

  const initialFormData = {
    username: "",
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalClose = () => {
    setFormData(initialFormData);
    setShowPassword(false);
    setView(initialView);
    handleClose();
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    const { email, password, username } = formData;

    // -------------------
    // Validation
    // -------------------
    if (view === "signup" && !isValidUsername(username)) {
      return showSnackbar(
        "Username must be at least 3 characters and can only contain letters, numbers, and underscores",
        "error",
      );
    }

    if (!isValidEmail(email)) {
      return showSnackbar("Invalid email", "error");
    }

    if (!isValidPassword(password)) {
      return showSnackbar("Password must be at least 6 characters", "error");
    }

    try {
      if (view === "login") {
        const res = await loginRequest(email, password);

        login(res.user);
        showSnackbar("Login successful!", "success");
        handleModalClose();
      } else {
        await signupRequest(username, email, password);
        showSnackbar("Signup successful!", "success");
        handleModalClose();
      }
    } catch (err) {
      showSnackbar(
        err?.error ||
          err?.message ||
          `${view === "login" ? "Login" : "Signup"} failed!`,
        "error",
      );
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleModalClose}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: { borderRadius: 3, p: 2 },
          },
        }}
      >
        <IconButton
          onClick={handleModalClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent>
          <Box sx={{ textAlign: "center", mb: 3, mt: 1 }}>
            <Typography variant="h5" component="h2" fontWeight="bold">
              {view === "login" ? "Welcome Back" : "Create Account"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {view === "login" ? "Log in to your account" : "Sign up here"}
            </Typography>
          </Box>

          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            onSubmit={handlesubmit}
          >
            {view === "signup" && (
              <TextField
                label="Username"
                name="username"
                variant="outlined"
                value={formData.username}
                onChange={handleInputChange}
                fullWidth
                required
              />
            )}

            <TextField
              label="Email Address"
              type="email"
              name="email"
              variant="outlined"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
            />

            <TextField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              required
              type={showPassword ? "text" : "password"}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 1, py: 1.2, fontWeight: "bold", textTransform: "none" }}
            >
              {view === "login" ? " Log In" : "Create Account"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {view === "login"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <Typography
                  component="span"
                  variant="body2"
                  color="primary"
                  fontWeight="bold"
                  onClick={toggleView}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {view === "login" ? "Sign up" : "Log in"}
                </Typography>
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
