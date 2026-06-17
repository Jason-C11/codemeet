"use client";

import { useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialView, setModalInitialView] = useState<"login" | "signup">(
    "login",
  );

  const openAuth = (viewType: "login" | "signup") => {
    setModalInitialView(viewType);
    setModalOpen(true);
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth="lg">

       <Typography variant="h1" component="h1" gutterBottom>
          CodeMeet.io
        </Typography>
       <Typography variant="h4" component="h3" gutterBottom>
          Your All-in-One Mock Coding Interview Platform
        </Typography>

        <Typography variant="body1">
          CodeMeet.io is a mock coding interview platform designed to help you
          practice and develop your data structures and algorithms skills by
          simulating a real coding interview environment. With low-friction
          setup you can start practicing with peers in seconds.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
          <Button variant="outlined" onClick={() => openAuth("login")}>
            Log In
          </Button>
          <Button variant="contained" onClick={() => openAuth("signup")}>
            Sign Up
          </Button>
        </Box>

      </Container>

      <AuthModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        initialView={modalInitialView}
        key={modalInitialView}
      />
    </Box>
  );
}
