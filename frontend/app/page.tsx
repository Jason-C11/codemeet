"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import CodeIcon from "@mui/icons-material/Code";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PeopleIcon from "@mui/icons-material/People";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Home() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialView, setModalInitialView] = useState<"login" | "signup">(
    "login",
  );

  const openAuth = (viewType: "login" | "signup") => {
    setModalInitialView(viewType);
    setModalOpen(true);
  };
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  const showcaseImages = [
    {
      image: "/images/homepage/sample-practice.png",
      title: "Practice Problems",
      description:
        "Solve industry-standard coding problems designed to help you prepare for technical interviews.",
    },
    {
      image: "/images/homepage/sample-test-cases.png",
      title: "Test Cases",
      description: "Run your code against a set of custom test cases.",
    },
    {
      image: "/images/homepage/sample-submission.png",
      title: "Submission",
      description:
        "Submit your code and receive instant feedback on its performance.",
    },
  ];

  useEffect(() => {
    if (view === "login") {
      setModalInitialView("login");
      setModalOpen(true);
    }

    if (view === "signup") {
      setModalInitialView("signup");
      setModalOpen(true);
    }
  }, [view]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box component="main" sx={{ flexGrow: 1, py: 6 }}>
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

          {!user && (
            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
              <Button variant="outlined" onClick={() => openAuth("login")}>
                Log In
              </Button>
              <Button variant="contained" onClick={() => openAuth("signup")}>
                Sign Up
              </Button>
            </Box>
          )}
        </Container>
        <Divider sx={{ my: 4 }} />
        <Box sx={{ py: 4 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ textAlign: "center", mb: 5 }}
            >
              All The Tools You Need to Practice
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
              }}
            >
              {/* Feature 1 */}
              <Card>
                <CardContent>
                  <CodeIcon
                    sx={{
                      fontSize: 40,
                      color: "primary.main",
                      mb: 2,
                    }}
                  />

                  <Typography variant="h6" gutterBottom>
                    Practice Problems
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Solve industry-standard coding problems designed to help you
                    prepare for technical interviews.
                  </Typography>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card>
                <CardContent>
                  <PlayArrowIcon
                    sx={{
                      fontSize: 40,
                      color: "primary.main",
                      mb: 2,
                    }}
                  />

                  <Typography variant="h6" gutterBottom>
                    Run & Test Your Code
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Run your solutions against custom and hidden test cases.
                  </Typography>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card>
                <CardContent>
                  <PeopleIcon
                    sx={{
                      fontSize: 40,
                      color: "primary.main",
                      mb: 2,
                    }}
                  />

                  <Typography variant="h6" gutterBottom>
                    Live Mock Interviews
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Practice in an environment designed to simulate a real
                    coding interview.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Container>
        </Box>

        <Divider sx={{ my: 4 }} />
        <Box sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              sx={{ textAlign: "center", mb: 4 }}
            >
              Your Coding Interview Workspace
            </Typography>

            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1}
              style={{paddingBottom: "50px"}}
            >
              {showcaseImages.map((image) => (
                <SwiperSlide key={image.image}>
                  <Box
                    component="img"
                    src={image.image}
                    alt={image.title}
                    sx={{
                      width: "100%",
                      maxWidth: 1100,
                      mx: "auto",
                      display: "block",
                      borderRadius: 2,
                      borderWidth: 2,
                      borderStyle: "solid",
                      borderColor: "divider",
                    }}
                  />
                  <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Typography variant="h6">{image.title}</Typography>

                    <Typography variant="body2" color="text.secondary">
                      {image.description}
                    </Typography>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Container>
        </Box>

        <AuthModal
          open={modalOpen}
          handleClose={() => {
            setModalOpen(false);
            router.replace("/");
          }}
          initialView={modalInitialView}
          key={modalInitialView}
        />
      </Box>
    </Box>
  );
}
