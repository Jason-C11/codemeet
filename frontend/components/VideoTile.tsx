import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";

interface VideoTileProps {
  stream: MediaStream;
  username: string;
  muted?: boolean;
}

const VideoTile = ({ stream, username, muted = false }: VideoTileProps) => {
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
          display: "block",
        }}
      />

      <Typography
        sx={{
          position: "absolute",
          bottom: 8,
          left: 8,
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          px: 1,
          py: 0.5,
          borderRadius: 1,
          fontSize: "0.8rem",
        }}
      >
        {username}
      </Typography>
    </Box>
  );
};

export default VideoTile;
