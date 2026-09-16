import {
  createRoomState,
  getRoomState,
  deleteRoomState,
  updateRoomState,
} from "./roomState.js";

const handleJoinRoom = (
  io,
  socket,
  { roomID, create, problemId, code, testCases },
) => {
  const roomExists = io.sockets.adapter.rooms.has(roomID);
  const username = socket.data.user.username;

  // User is trying to join an existing room
  if (!create && !roomExists) {
    socket.emit("roomError", {
      message: "Room does not exist.",
    });

    return;
  }

  // User is trying to create an existing room
  if (create && roomExists) {
    socket.emit("roomError", {
      message: "Unable to create room.",
    });

    return;
  }

  socket.data.username = username;
  socket.data.roomID = roomID;
  socket.data.micEnabled = true;
  socket.data.cameraEnabled = true;

  socket.join(roomID);

  // Create state for a new room using creator's current state
  if (create) {
    createRoomState(roomID, {
      problemId,
      code,
      testCases,
    });
  }

  const users = getRoomUsers(io, roomID);

  socket.to(roomID).emit("roomUserJoined", {
    socketID: socket.id,
    username,
  });

  io.to(roomID).emit("roomUsers", users);

  socket.emit("roomJoined", {
    roomID,
    username,
    created: create,
  });

  // Send the current state to the user
  socket.emit("roomState", getRoomState(roomID));
};

const getRoomUsers = (io, roomID) => {
  const sockets = io.sockets.adapter.rooms.get(roomID);

  if (!sockets) return [];

  return [...sockets].map((socketID) => {
    const socket = io.sockets.sockets.get(socketID);

    return {
      socketID,
      username: socket.data.username,
      micEnabled: socket.data.micEnabled,
      cameraEnabled: socket.data.cameraEnabled,
    };
  });
};

const handleMediaState = (socket, { micEnabled, cameraEnabled }) => {
  const { roomID, username } = socket.data;

  if (!roomID) return;

  socket.data.micEnabled = micEnabled;
  socket.data.cameraEnabled = cameraEnabled;

  socket.to(roomID).emit("mediaState", {
    username,
    micEnabled,
    cameraEnabled,
  });
};

const handleStopwatch = (io, socket, { action }) => {
  const { roomID } = socket.data;

  if (!roomID) return;

  const state = getRoomState(roomID);

  if (!state) return;

  switch (action) {
    case "start":
      if (state.stopwatch.running) return;

      updateRoomState(roomID, {
        stopwatch: {
          running: true,
          startedAt: Date.now(),
          elapsed: state.stopwatch.elapsed,
        },
      });
      break;

    case "pause":
      if (!state.stopwatch.running || state.stopwatch.startedAt === null) {
        return;
      }

      updateRoomState(roomID, {
        stopwatch: {
          running: false,
          startedAt: null,
          elapsed:
            state.stopwatch.elapsed + (Date.now() - state.stopwatch.startedAt),
        },
      });
      break;

    case "reset":
      updateRoomState(roomID, {
        stopwatch: {
          running: false,
          startedAt: null,
          elapsed: 0,
        },
      });
      break;

    default:
      return;
  }

  io.to(roomID).emit("roomState", getRoomState(roomID));
};

const handleLeaveRoom = (io, socket) => {
  const { roomID, username } = socket.data;

  socket.leave(roomID);
  socket.data.roomID = null;
  socket.data.username = null;

  // Tell remaining users who left
  io.to(roomID).emit("roomUserLeft", {
    username,
  });

  const users = getRoomUsers(io, roomID);

  io.to(roomID).emit("roomUsers", users);

  // Delete room state when nobody is left
  if (users.length === 0) {
    deleteRoomState(roomID);
  }
};

const handleDisconnect = (io, socket) => {
  const { roomID, username } = socket.data;

  if (!roomID) return;

  const users = getRoomUsers(io, roomID).filter(
    (user) => user.socketID !== socket.id,
  );

  // Tell remaining users who left
  io.to(roomID).emit("roomUserLeft", {
    username,
  });

  io.to(roomID).emit("roomUsers", users);

  // Delete room state when nobody is left
  if (users.length === 0) {
    deleteRoomState(roomID);
  }
};

const roomHandlers = (io, socket) => {
  socket.on("joinRoom", (data) => {
    handleJoinRoom(io, socket, data);
  });

  socket.on("leaveRoom", () => {
    handleLeaveRoom(io, socket);
  });

  socket.on("mediaState", (data) => {
    handleMediaState(socket, data);
  });

  socket.on("stopwatch", (data) => {
    handleStopwatch(io, socket, data);
  });

  socket.on("disconnect", () => {
    handleDisconnect(io, socket);
  });
};

export default roomHandlers;
