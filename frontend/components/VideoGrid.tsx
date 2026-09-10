import { useEffect, useMemo, useRef, useState } from "react";
import { Box, IconButton, Paper, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import VideoTile from "./VideoTile";

interface VideoGridProps {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  username: string;
}

const MIN_WIDTH = 280;
const MIN_HEIGHT = 180;

const DEFAULT_WIDTH = 420;
const DEFAULT_HEIGHT = 280;

const VideoGrid = ({
  localStream,
  remoteStreams,
  username,
}: VideoGridProps) => {
  const [position, setPosition] = useState({
    x: 16,
    y: 16,
  });

  const [size, setSize] = useState({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });

  const [minimized, setMinimized] = useState(false);

  const dragging = useRef(false);
  const resizing = useRef(false);

  const dragOffset = useRef({
    x: 0,
    y: 0,
  });

  const resizeStart = useRef({
    x: 0,
    y: 0,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });

  const participants = useMemo(() => {
    return [
      ...(localStream
        ? [
            {
              username,
              stream: localStream,
              muted: true,
            },
          ]
        : []),
      ...Array.from(remoteStreams.entries()).map(([username, stream]) => ({
        username,
        stream,
        muted: false,
      })),
    ];
  }, [localStream, remoteStreams, username]);

  const participantCount = participants.length;

  const gridTemplate = useMemo(() => {
    switch (participantCount) {
      case 1:
        return {
          columns: "1fr",
          rows: "1fr",
        };

      case 2:
        return {
          columns: "repeat(2, 1fr)",
          rows: "1fr",
        };

      case 3:
      case 4:
        return {
          columns: "repeat(2, 1fr)",
          rows: "repeat(2, 1fr)",
        };

      case 5:
        return {
          columns: "repeat(2, 1fr)",
          rows: "repeat(3, 1fr)",
        };

      default:
        return {
          columns: "repeat(2, 1fr)",
          rows: "repeat(2, 1fr)",
        };
    }
  }, [participantCount]);

  const handleDragStart = (event: React.MouseEvent) => {
    if (event.button !== 0) return;

    dragging.current = true;

    dragOffset.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };

    event.preventDefault();
  };

  const handleResizeStart = (event: React.MouseEvent) => {
    if (event.button !== 0) return;

    resizing.current = true;

    resizeStart.current = {
      x: event.clientX,
      y: event.clientY,
      width: size.width,
      height: size.height,
    };

    event.preventDefault();
    event.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (dragging.current) {
        setPosition({
          x: event.clientX - dragOffset.current.x,
          y: event.clientY - dragOffset.current.y,
        });
      }

      if (resizing.current) {
        const deltaX = event.clientX - resizeStart.current.x;

        const deltaY = event.clientY - resizeStart.current.y;

        setSize({
          width: Math.max(MIN_WIDTH, resizeStart.current.width + deltaX),
          height: Math.max(MIN_HEIGHT, resizeStart.current.height + deltaY),
        });
      }
    };

    const handleMouseUp = () => {
      dragging.current = false;
      resizing.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  if (participantCount === 0) {
    return null;
  }

  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        left: position.x,
        top: position.y,
        width: minimized ? 180 : size.width,
        height: minimized ? 40 : size.height,
        zIndex: 2000,
        overflow: "hidden",
        borderRadius: 2,
        userSelect: "none",
      }}
    >
      {/* Drag handle */}
      <Box
        onMouseDown={handleDragStart}
        sx={{
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: 0.5,
          backgroundColor: "rgba(20, 20, 20, 0.95)",
          cursor: "grab",
        }}
      >
        <Tooltip title={minimized ? "Restore" : "Minimize"}>
          <IconButton
            size="small"
            onClick={() => setMinimized((prev) => !prev)}
            sx={{
              color: "white",
              cursor: "pointer",
            }}
          >
            {minimized ? (
              <OpenInFullIcon fontSize="small" />
            ) : (
              <RemoveIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {!minimized && (
        <Box
          sx={{
            width: "100%",
            height: "calc(100% - 40px)",
            display: "grid",
            gridTemplateColumns: gridTemplate.columns,
            gridTemplateRows: gridTemplate.rows,
            gap: 0.5,
            p: 0.5,
            backgroundColor: "black",
          }}
        >
          {participants.map((participant, index) => {
            const isLast = index === participants.length - 1;

            const spanLast =
              (participantCount === 3 || participantCount === 5) && isLast;

            return (
              <Box
                key={participant.username}
                sx={{
                  minWidth: 0,
                  minHeight: 0,
                  ...(spanLast && {
                    gridColumn: "1 / -1",
                  }),
                }}
              >
                <VideoTile
                  stream={participant.stream}
                  username={participant.username}
                  muted={participant.muted}
                />
              </Box>
            );
          })}
        </Box>
      )}

      {!minimized && (
        <Box
          onMouseDown={handleResizeStart}
          sx={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 18,
            height: 18,
            cursor: "nwse-resize",
            zIndex: 10,
          }}
        />
      )}
    </Paper>
  );
};

export default VideoGrid;
