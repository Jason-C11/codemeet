import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

interface VideoTileProps {
  stream: MediaStream;
  username: string;
  muted?: boolean;
}

const VideoTile = ({ stream, username, muted = false }: VideoTileProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({
    x: 16,
    y: 16,
  });

  const dragging = useRef(false);
  const dragOffset = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.srcObject = stream;
  }, [stream]);

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!tileRef.current) return;

    dragging.current = true;

    const rect = tileRef.current.getBoundingClientRect();

    dragOffset.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!dragging.current) return;

      setPosition({
        x: event.clientX - dragOffset.current.x,
        y: event.clientY - dragOffset.current.y,
      });
    };

    const handleMouseUp = () => {
      dragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <Box
      ref={tileRef}
      onMouseDown={handleMouseDown}
      sx={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: 280,
        aspectRatio: "16 / 9",
        backgroundColor: "black",
        borderRadius: 2,
        overflow: "hidden",
        zIndex: 10,
        cursor: dragging.current ? "grabbing" : "grab",
        userSelect: "none",
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
          pointerEvents: "none",
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
        }}
      >
        {username}
      </Typography>
    </Box>
  );
};

export default VideoTile;
