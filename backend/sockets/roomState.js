const roomState = new Map();

const createRoomState = (roomID, { problemId, code, testCases }) => {
  roomState.set(roomID, {
    problemId,
    code,
    testCases,
    stopwatch: {
      running: false,
      startedAt: null,
      elapsed: 0,
    },
  });
};

const getRoomState = (roomID) => {
  return roomState.get(roomID);
};

const updateRoomState = (roomID, updates) => {
  const state = roomState.get(roomID);

  if (!state) return;

  Object.assign(state, updates);
};

const deleteRoomState = (roomID) => {
  roomState.delete(roomID);
};

export { createRoomState, getRoomState, updateRoomState, deleteRoomState };
