import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { triggerSnackbar } from "@/hooks/useSnackbar";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

interface RoomControlsProps {
  roomID: string | null;
  initialRoomID?: string;
  roomEvent: "created" | "joined" | "left" | null;
  roomError: string | null;
  onCreateRoom: () => void;
  onJoinRoom: (roomID: string) => void;
  onLeaveRoom: () => void;
}

const RoomControls = ({
  roomID,
  initialRoomID,
  roomEvent,
  roomError,
  onCreateRoom,
  onJoinRoom,
  onLeaveRoom,
}: RoomControlsProps) => {
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [inputRoomID, setInputRoomID] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (initialRoomID && !user) {
      triggerSnackbar(
        "You must be logged in to join a room. Please log in and try again.",
        "error",
      );
      return;
    }

    if (!initialRoomID || !user) return;

    onJoinRoom(initialRoomID);
  }, [initialRoomID, user, loading]);

  useEffect(() => {
    if (roomEvent === "created") {
      setShareDialogOpen(true);
      triggerSnackbar("Room created", "success");
    }

    if (roomEvent === "joined") {
      triggerSnackbar("Joined room", "success");
    }

    if (roomEvent === "left") {
      setShareDialogOpen(false);
      triggerSnackbar("Left room", "info");
    }

    if (roomError) {
      triggerSnackbar(roomError, "error");
    }
  }, [roomEvent, roomError]);

  const handleCreateRoom = () => {
    if (!user) {
      triggerSnackbar("You must be logged in to create a room", "error");
      return;
    }
    onCreateRoom();
  };

  const handleOpenJoinDialog = () => {
    if (!user) {
      triggerSnackbar("You must be logged in to join a room", "error");
      return;
    }

    setJoinDialogOpen(true);
  };

  const handleJoinRoom = () => {
    const trimmedRoomID = inputRoomID.trim();

    if (!trimmedRoomID) return;

    onJoinRoom(trimmedRoomID);

    setInputRoomID("");
    setJoinDialogOpen(false);
  };

  const getRoomLink = () => {
    if (!roomID) return "";

    return `${window.location.origin}/interview/${roomID}`;
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    triggerSnackbar("Copied to clipboard", "success");
  };

  const handleOnLeaveRoom = () => {
    onLeaveRoom();
    router.push("/interview");
  };

  return (
    <>
      <Stack direction="row" spacing={1}>
        {!roomID ? (
          <>
            <Button variant="outlined" onClick={handleCreateRoom}>
              Create Room
            </Button>

            <Button variant="outlined" onClick={handleOpenJoinDialog}>
              Join Room
            </Button>
          </>
        ) : (
          <>
            <Button variant="outlined" onClick={() => setShareDialogOpen(true)}>
              Share Room
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={handleOnLeaveRoom}
            >
              Leave Room
            </Button>
          </>
        )}
      </Stack>

      {/* Join Room Dialog */}
      <Dialog
        open={joinDialogOpen}
        onClose={() => setJoinDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Join Room</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Room ID"
            value={inputRoomID}
            onChange={(event) => setInputRoomID(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleJoinRoom();
              }
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setJoinDialogOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            onClick={handleJoinRoom}
            disabled={!inputRoomID.trim()}
          >
            Join
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Room Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Share Room</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {/* Room ID */}
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <TextField
                fullWidth
                label="Room ID"
                value={roomID ?? ""}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />

              <Tooltip title="Copy room ID">
                <IconButton
                  onClick={() => handleCopy(roomID ?? "")}
                  disabled={!roomID}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Stack>

            {/* Full Link */}
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <TextField
                fullWidth
                label="Invite Link"
                value={getRoomLink()}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />

              <Tooltip title="Copy invite link">
                <IconButton
                  onClick={() => handleCopy(getRoomLink())}
                  disabled={!roomID}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoomControls;
