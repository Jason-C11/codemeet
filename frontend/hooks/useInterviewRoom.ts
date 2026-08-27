import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import socket from "../sockets/socket";
import { TestCase } from "@/lib/types/TestCase";
import { EditorSelection, RemoteCursor } from "@/lib/types/EditorSelection";

// ==================== Types

type RoomEvent = "created" | "joined" | "left" | null;

type RoomUser = {
  socketID: string;
  username: string;
};

export type RoomState = {
  problemId: string | null;
  code: string;
  testCases: TestCase[];
};

interface UseInterviewRoomProps {
  onRoomState: (state: RoomState) => void;
  onCodeChange: (code: string) => void;
  onProblemChange: (problemId: string) => void;
  onTestCasesChange: (testCases: TestCase[]) => void;
  onCursorChange: (cursor: RemoteCursor) => void;
}

// ==================== Hook

const useInterviewRoom = ({
  onRoomState,
  onCodeChange,
  onProblemChange,
  onTestCasesChange,
  onCursorChange,
}: UseInterviewRoomProps) => {
  const { user } = useAuth();

  // ==================== State

  const [roomID, setRoomID] = useState<string | null>(null);
  const [roomEvent, setRoomEvent] = useState<RoomEvent>(null);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);

  // ==================== Helpers

  const resetRoomState = () => {
    setRoomID(null);
    setRoomEvent(null);
    setRoomError(null);
    setRoomUsers([]);
  };

  const disconnectSocket = () => {
    if (socket.connected) {
      socket.disconnect();
    }
  };

  // ==================== Room Events

  useEffect(() => {
    const handleRoomJoined = ({
      roomID,
      created,
    }: {
      roomID: string;
      created: boolean;
    }) => {
      setRoomID(roomID);
      setRoomEvent(created ? "created" : "joined");
      setRoomError(null);
    };

    const handleRoomError = ({ message }: { message: string }) => {
      setRoomError(message);
    };

    socket.on("roomJoined", handleRoomJoined);
    socket.on("roomError", handleRoomError);

    return () => {
      socket.off("roomJoined", handleRoomJoined);
      socket.off("roomError", handleRoomError);
    };
  }, []);

  // ==================== Initial Room State

  useEffect(() => {
    const handleRoomState = (state: RoomState) => {
      onRoomState(state);
    };

    socket.on("roomState", handleRoomState);

    return () => {
      socket.off("roomState", handleRoomState);
    };
  }, [onRoomState]);

  // ==================== Room Users

  useEffect(() => {
    const handleRoomUsers = (users: RoomUser[]) => {
      setRoomUsers(users);
    };

    socket.on("roomUsers", handleRoomUsers);

    return () => {
      socket.off("roomUsers", handleRoomUsers);
    };
  }, []);

  // ==================== Code Synchronization

  useEffect(() => {
    const handleCodeChange = ({ code }: { code: string }) => {
      onCodeChange(code);
    };

    socket.on("code:change", handleCodeChange);

    return () => {
      socket.off("code:change", handleCodeChange);
    };
  }, [onCodeChange]);

  const emitCodeChange = useCallback(
    (code: string) => {
      if (!roomID) return;

      socket.emit("code:change", {
        roomID,
        code,
      });
    },
    [roomID],
  );

  // ==================== Code Editor Position

  useEffect(() => {
    const handleCursorChange = ({ username, selection }: RemoteCursor) => {
      onCursorChange({
        username,
        selection,
      });
    };

    socket.on("cursor:change", handleCursorChange);

    return () => {
      socket.off("cursor:change", handleCursorChange);
    };
  }, [onCursorChange]);

  const emitCursorChange = useCallback(
    (selection: EditorSelection) => {
      if (!roomID || !user) return;
      socket.emit("cursor:change", {
        roomID,
        selection,
        username: user.username,
      });
    },
    [roomID, user],
  );

  // ==================== Problem Synchronization

  useEffect(() => {
    const handleProblemChange = ({ problemId }: { problemId: string }) => {
      onProblemChange(problemId);
    };

    socket.on("problem:change", handleProblemChange);

    return () => {
      socket.off("problem:change", handleProblemChange);
    };
  }, [onProblemChange]);

  const emitProblemChange = useCallback(
    (problemId: string, starterCode: string, testCases: TestCase[]) => {
      if (!roomID) return;

      socket.emit("problem:change", {
        roomID,
        problemId,
        starterCode,
        testCases,
      });
    },
    [roomID],
  );

  // ==================== Test Case Synchronization

  useEffect(() => {
    const handleTestCasesChange = ({
      testCases,
    }: {
      testCases: TestCase[];
    }) => {
      onTestCasesChange(testCases);
    };

    socket.on("testCases:change", handleTestCasesChange);

    return () => {
      socket.off("testCases:change", handleTestCasesChange);
    };
  }, [onTestCasesChange]);

  const emitTestCasesChange = useCallback(
    (testCases: TestCase[]) => {
      if (!roomID) return;

      socket.emit("testCases:change", {
        roomID,
        testCases,
      });
    },
    [roomID],
  );

  // ==================== Authentication / Cleanup

  useEffect(() => {
    if (!user) {
      resetRoomState();
      disconnectSocket();
    }
  }, [user]);

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  // ==================== Room Actions

  const createRoom = (
    problemId: string | null,
    code: string,
    testCases: TestCase[],
  ) => {
    if (!user) return;

    setRoomError(null);

    const roomID = crypto.randomUUID();

    const create = () => {
      socket.emit("joinRoom", {
        roomID,
        username: user.username,
        create: true,
        problemId,
        code,
        testCases,
      });
    };

    if (socket.connected) {
      create();
    } else {
      socket.once("connect", create);
      socket.connect();
    }
  };

  const joinRoom = (roomID: string) => {
    if (!user) return;

    setRoomError(null);

    const join = () => {
      socket.emit("joinRoom", {
        roomID,
        username: user.username,
        create: false,
      });
    };

    if (socket.connected) {
      join();
    } else {
      socket.once("connect", join);
      socket.connect();
    }
  };

  const leaveRoom = () => {
    if (!roomID || !user) return;

    setRoomError(null);

    socket.emit("leaveRoom", {
      roomID,
      username: user.username,
    });

    disconnectSocket();
    resetRoomState();
    setRoomEvent("left");
  };

  // ==================== Return

  return {
    roomID,
    roomEvent,
    roomError,
    roomUsers,

    createRoom,
    joinRoom,
    leaveRoom,

    emitCodeChange,
    emitProblemChange,
    emitTestCasesChange,
    emitCursorChange,
  };
};

export default useInterviewRoom;
