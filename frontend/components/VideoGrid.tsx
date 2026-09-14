import { useEffect, useMemo, useRef, useState } from "react";
import { Box, IconButton, Paper, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import VideoTile from "./VideoTile";

interface VideoGridProps {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  username: string;
  toggleMic: () => boolean;
  toggleCamera: () => boolean;
  onLeaveRoom: () => void;
  roomUsers: {
    socketID: string;
    username: string;
    micEnabled: boolean;
    cameraEnabled: boolean;
  }[];
}

const MIN_WIDTH = 280;
const MIN_HEIGHT = 180;

const DEFAULT_WIDTH = 420;
const DEFAULT_HEIGHT = 280;

const SPEAKING_THRESHOLD = 0.012;

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const VideoGrid = ({
  localStream,
  remoteStreams,
  username,
  toggleMic,
  toggleCamera,
  onLeaveRoom,
  roomUsers,
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

  const positionRef = useRef(position);
  const sizeRef = useRef(size);
  const minimizedRef = useRef(minimized);

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

  const [localMicEnabled, setLocalMicEnabled] = useState(false);
  const [localCameraEnabled, setLocalCameraEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioNodes = useRef(
    new Map<
      string,
      {
        stream: MediaStream;
        source: MediaStreamAudioSourceNode;
        analyser: AnalyserNode;
      }
    >(),
  );
  const [activeSpeakers, setActiveSpeakers] = useState<Set<string>>(new Set());

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    minimizedRef.current = minimized;
  }, [minimized]);

  useEffect(() => {
    if (!localStream) return;

    setLocalMicEnabled(localStream.getAudioTracks()[0]?.enabled ?? false);

    setLocalCameraEnabled(localStream.getVideoTracks()[0]?.enabled ?? false);
  }, [localStream]);

  const handleToggleMic = () => {
    const enabled = toggleMic();
    setLocalMicEnabled(enabled);
  };

  const handleToggleCamera = () => {
    const enabled = toggleCamera();
    setLocalCameraEnabled(enabled);
  };

  const participants = useMemo(() => {
    return [
      ...(localStream
        ? [
            {
              username,
              stream: localStream,
              muted: true,
              micEnabled: localMicEnabled,
              cameraEnabled: localCameraEnabled,
            },
          ]
        : []),
      ...Array.from(remoteStreams.entries()).map(([username, stream]) => {
        const roomUser = roomUsers.find((user) => user.username === username);

        return {
          username,
          stream,
          muted: false,
          micEnabled: roomUser?.micEnabled ?? true,
          cameraEnabled: roomUser?.cameraEnabled ?? true,
        };
      }),
    ];
  }, [
    localStream,
    remoteStreams,
    username,
    roomUsers,
    localMicEnabled,
    localCameraEnabled,
  ]);

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
      x: event.clientX - positionRef.current.x,
      y: event.clientY - positionRef.current.y,
    };

    event.preventDefault();
  };

  const handleResizeStart = (event: React.MouseEvent) => {
    if (event.button !== 0) return;

    resizing.current = true;

    resizeStart.current = {
      x: event.clientX,
      y: event.clientY,
      width: sizeRef.current.width,
      height: sizeRef.current.height,
    };

    event.preventDefault();
    event.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (dragging.current) {
        const newX = event.clientX - dragOffset.current.x;
        const newY = event.clientY - dragOffset.current.y;

        const width = minimizedRef.current ? 180 : sizeRef.current.width;
        const height = minimizedRef.current ? 48 : sizeRef.current.height;

        setPosition({
          x: clamp(newX, 0, window.innerWidth - width),
          y: clamp(newY, 0, window.innerHeight - height),
        });
      }

      if (resizing.current) {
        const deltaX = event.clientX - resizeStart.current.x;
        const deltaY = event.clientY - resizeStart.current.y;

        const maxWidth = window.innerWidth - positionRef.current.x;
        const maxHeight = window.innerHeight - positionRef.current.y;

        setSize({
          width: Math.min(
            maxWidth,
            Math.max(MIN_WIDTH, resizeStart.current.width + deltaX),
          ),
          height: Math.min(
            maxHeight,
            Math.max(MIN_HEIGHT, resizeStart.current.height + deltaY),
          ),
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

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const activeParticipants = new Set(
      participants.map((participant) => participant.username),
    );

    for (const [username, nodes] of audioNodes.current) {
      if (!activeParticipants.has(username)) {
        nodes.source.disconnect();
        nodes.analyser.disconnect();
        audioNodes.current.delete(username);
      }
    }

    for (const participant of participants) {
      const existing = audioNodes.current.get(participant.username);

      if (existing?.stream === participant.stream) {
        continue;
      }

      if (existing) {
        existing.source.disconnect();
        existing.analyser.disconnect();
      }

      const source = audioContextRef.current.createMediaStreamSource(
        participant.stream,
      );
      const analyser = audioContextRef.current.createAnalyser();

      source.connect(analyser);

      audioNodes.current.set(participant.username, {
        stream: participant.stream,
        source,
        analyser,
      });
    }
  }, [participants]);

  useEffect(() => {
    let animationFrameId: number;
    let lastCheck = 0;

    const detectSpeakers = (timestamp: number) => {
      // 20 checks/second
      if (timestamp - lastCheck >= 50) {
        lastCheck = timestamp;

        const speakingUsers = new Set<string>();

        for (const participant of participants) {
          const nodes = audioNodes.current.get(participant.username);

          if (!nodes) continue;

          const data = new Uint8Array(nodes.analyser.fftSize);
          nodes.analyser.getByteTimeDomainData(data);

          let sum = 0;

          for (const value of data) {
            const normalized = (value - 128) / 128;
            sum += normalized * normalized;
          }

          const volume = Math.sqrt(sum / data.length);

          if (volume > SPEAKING_THRESHOLD) {
            speakingUsers.add(participant.username);
          }
        }

        setActiveSpeakers(speakingUsers);
      }

      animationFrameId = requestAnimationFrame(detectSpeakers);
    };

    animationFrameId = requestAnimationFrame(detectSpeakers);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [participants]);

  useEffect(() => {
    return () => {
      for (const nodes of audioNodes.current.values()) {
        nodes.source.disconnect();
        nodes.analyser.disconnect();
      }

      audioNodes.current.clear();
      audioContextRef.current?.close();
      audioContextRef.current = null;
    };
  }, []);

  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        left: position.x,
        top: position.y,
        width: minimized ? 180 : size.width,
        height: minimized ? 48 : size.height,
        zIndex: 2000,
        overflow: "hidden",
        borderRadius: 2,
        userSelect: "none",
      }}
    >
      <Box
        onMouseDown={handleDragStart}
        sx={{
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 0.5,
          backgroundColor: "rgba(20, 20, 20, 0.95)",
          cursor: "grab",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip
            title={localMicEnabled ? "Mute microphone" : "Unmute microphone"}
            slotProps={{
              popper: {
                sx: {
                  zIndex: 9999,
                },
              },
            }}
          >
            <IconButton
              size="small"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={handleToggleMic}
              sx={{
                color: "white",
                cursor: "pointer",
              }}
            >
              {localMicEnabled ? (
                <MicIcon fontSize="small" />
              ) : (
                <MicOffIcon sx={{ color: "error.main" }} fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip
            title={localCameraEnabled ? "Turn camera off" : "Turn camera on"}
            slotProps={{
              popper: {
                sx: {
                  zIndex: 9999,
                },
              },
            }}
          >
            <IconButton
              size="small"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={handleToggleCamera}
              sx={{
                color: "white",
                cursor: "pointer",
              }}
            >
              {localCameraEnabled ? (
                <VideocamIcon fontSize="small" />
              ) : (
                <VideocamOffIcon
                  sx={{ color: "error.main" }}
                  fontSize="small"
                />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip
            title={"Leave Room"}
            slotProps={{
              popper: {
                sx: {
                  zIndex: 9999,
                },
              },
            }}
          >
            <IconButton
              size="small"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={onLeaveRoom}
              sx={{
                color: "white",
                cursor: "pointer",
              }}
            >
              <CallEndIcon sx={{ color: "error.main" }} fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Tooltip
          title={minimized ? "Restore" : "Minimize"}
          slotProps={{
            popper: {
              sx: {
                zIndex: 9999,
              },
            },
          }}
        >
          <IconButton
            size="small"
            onMouseDown={(event) => event.stopPropagation()}
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
            height: "calc(100% - 48px)",
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
                  micEnabled={participant.micEnabled}
                  cameraEnabled={participant.cameraEnabled}
                  isSpeaking={activeSpeakers.has(participant.username)}
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
