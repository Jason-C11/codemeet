"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })

    const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
        slotProps={{
            paper: {
            sx: { borderRadius: 3, p: 2 }
            }
  }}
    >
      <IconButton
        onClick={handleClose}
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
            {view === "login"
              ? "Log in to your account"
              : "Sign up here"}
          </Typography>
        </Box>

        <Box
          component="form"
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {view === "signup" && (
            <TextField label="Username" variant="outlined" fullWidth required />
          )}

          <TextField
            label="Email Address"
            type="email"
            variant="outlined"
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
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
  );
}
