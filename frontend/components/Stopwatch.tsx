import { useState, useEffect } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { StopwatchState } from "@/lib/types/StopwatchState";
import { triggerSnackbar } from "@/hooks/useSnackbar";

interface StopwatchProps {
  stopwatch?: StopwatchState;
  onStopwatchAction?: (action: "start" | "pause" | "reset") => void;
  isDisabled?: boolean;
}

const Stopwatch = ({
  stopwatch,
  onStopwatchAction,
  isDisabled,
}: StopwatchProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [running, setRunning] = useState(false);

  const isControlled = stopwatch !== undefined;

  const currentRunning = isControlled ? stopwatch.running : running;

  useEffect(() => {
    if (isControlled) return;

    if (!running) return;

    const startTime = Date.now() - elapsedTime;

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [running, elapsedTime, isControlled]);

  useEffect(() => {
    if (!isControlled) return;

    const startedAt = stopwatch.startedAt;

    if (!stopwatch.running || startedAt === null) {
      setElapsedTime(stopwatch.elapsed);
      return;
    }

    const updateElapsedTime = () => {
      setElapsedTime(stopwatch.elapsed + (Date.now() - startedAt));
    };

    updateElapsedTime();

    const interval = setInterval(updateElapsedTime, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [stopwatch, isControlled]);

  const formatTime = (time: number) => {
    const totalSeconds = Math.floor(time / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0",
      )}:${String(seconds).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  };

  const handleStopwatchAction = (action: "start" | "pause" | "reset") => {
    if (isDisabled) {
      triggerSnackbar(
        "Join or create a room before using the stopwatch.",
        "error",
      );
      return;
    }

    if (isControlled) {
      onStopwatchAction?.(action);
      return;
    }

    if (action === "start") {
      setRunning(true);
    } else if (action === "pause") {
      setRunning(false);
    } else {
      setRunning(false);
      setElapsedTime(0);
    }
  };

  const handleDisabledClick = () => {
    if (isDisabled) {
      triggerSnackbar(
        "Join or create a room before using the stopwatch.",
        "error",
      );
    }
  };

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        px: 0.5,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          pl: 1,
          minWidth: 65,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {formatTime(elapsedTime)}
      </Typography>

      <Tooltip title={currentRunning ? "Pause" : "Start"}>
        <span onClick={handleDisabledClick}>
          <IconButton
            onClick={() =>
              handleStopwatchAction(currentRunning ? "pause" : "start")
            }
          >
            {currentRunning ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Reset">
        <span onClick={handleDisabledClick}>
          <IconButton onClick={() => handleStopwatchAction("reset")}>
            <RestartAltIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

export default Stopwatch;
