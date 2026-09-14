import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

interface VideoTileProps {
  stream: MediaStream;
  username: string;
  muted?: boolean;
  micEnabled?: boolean;
  cameraEnabled?: boolean;
  isSpeaking?: boolean;
}

const VideoTile = ({
  stream,
  username,
  muted = false,
  micEnabled = true,
  cameraEnabled = true,
  isSpeaking = false,
}: VideoTileProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.srcObject = stream;

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        backgroundColor: "black",
        borderRadius: 1.5,
        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: cameraEnabled ? "block" : "none",
          border: isSpeaking ? "4px solid #4caf50" : "2px solid transparent",
          transition: "border-color 0.15s ease",
        }}
      />

      {!cameraEnabled && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <VideocamOffIcon
            sx={{
              color: "error.main",
              fontSize: "2rem",
            }}
          />
        </Box>
      )}

      <Box
        sx={{
          position: "absolute",
          bottom: 8,
          left: 8,
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          px: 1,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontSize: "0.8rem",
          }}
        >
          {username}
        </Typography>

        {micEnabled ? (
          <MicIcon sx={{ color: "white", fontSize: "1rem" }} />
        ) : (
          <MicOffIcon sx={{ color: "error.main", fontSize: "1rem" }} />
        )}
      </Box>
    </Box>
  );
};

export default VideoTile;
