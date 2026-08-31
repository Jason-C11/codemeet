import { updateRoomState } from "./roomState.js";

const interviewHandlers = (socket) => {
  // ==================== Code changes
  socket.on("code:change", ({ code, selection }) => {
    const { roomID, username } = socket.data;
    updateRoomState(roomID, {
      code,
    });

    socket.to(roomID).emit("code:change", {
      code,
      username,
      selection,
    });
  });
  // ==================== Cursor changes

  socket.on("cursor:change", ({ selection }) => {
    const { roomID, username } = socket.data;
    socket.to(roomID).emit("cursor:change", {
      username,
      selection,
    });
  });

  // ==================== Problem changes
  socket.on("problem:change", ({ problemId, starterCode, testCases }) => {
    const { roomID } = socket.data;
    updateRoomState(roomID, {
      problemId,
      code: starterCode,
      testCases,
    });

    socket.to(roomID).emit("problem:change", {
      problemId,
      starterCode,
      testCases,
    });
  });

  // ==================== Test case changes
  socket.on("testCases:change", ({ testCases }) => {
    const { roomID } = socket.data;
    updateRoomState(roomID, {
      testCases,
    });

    socket.to(roomID).emit("testCases:change", {
      testCases,
    });
  });
};

export default interviewHandlers;
