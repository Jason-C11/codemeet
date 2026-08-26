const roomState = new Map();

const createRoomState = (roomID, { problemId, code, testCases }) => {
  roomState.set(roomID, {
    problemId,
    code,
    testCases,
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
