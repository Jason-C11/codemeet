import { updateRoomState } from "./roomState.js";

const interviewHandlers = (socket) => {
  // ==================== Code changes
  socket.on("code:change", ({ roomID, code }) => {
    updateRoomState(roomID, {
      code,
    });

    socket.to(roomID).emit("code:change", {
      code,
    });
  });

  // ==================== Problem changes
  socket.on(
    "problem:change",
    ({ roomID, problemId, starterCode, testCases }) => {
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
    },
  );

  // ==================== Test case changes
  socket.on("testCases:change", ({ roomID, testCases }) => {
    updateRoomState(roomID, {
      testCases,
    });

    socket.to(roomID).emit("testCases:change", {
      testCases,
    });
  });
};

export default interviewHandlers;
