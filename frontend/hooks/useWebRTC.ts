import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

interface UseWebRTCProps {
  socket: Socket;
}

const useWebRTC = ({ socket }: UseWebRTCProps) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const peerConnections = useRef(new Map<string, RTCPeerConnection>()); // Map of username to RTCPeerConnection
  const remoteStreams = useRef(new Map<string, MediaStream>()); // Map of username to remote MediaStream
  const pendingICECandidates = useRef(new Map<string, RTCIceCandidateInit[]>()); // Map of username to pending ICE candidates

  const { user } = useAuth();

  // ==================== Camera / Microphone Setup
  const getLocalStream = async (): Promise<MediaStream> => {
    if (localStreamRef.current) {
      return localStreamRef.current;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;
    setLocalStream(stream);

    return stream;
  };

  // ==================== Peer Connection

  const createPeerConnection = (username: string) => {
    if (!localStreamRef.current) {
      console.log(
        "No local stream available for peer connection with:",
        username,
      );
      return;
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    localStreamRef.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current!);
    });

    pc.ontrack = (event) => {
      console.log("Received remote track from:", username);
      console.log("Remote stream:", event.streams[0]);

      const [remoteStream] = event.streams;

      if (remoteStream) {
        remoteStreams.current.set(username, remoteStream);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate to:", username);

        socket.emit("webrtc:ice-candidate", {
          candidate: event.candidate,
          targetUsername: username,
        });
      }
    };

    peerConnections.current.set(username, pc);

    pc.onconnectionstatechange = () => {
      console.log(`WebRTC connection with ${username}:`, pc.connectionState);
    };

    return pc;
  };

  const closePeerConnection = (username: string) => {
    const pc = peerConnections.current.get(username);

    if (pc) {
      pc.close();
      peerConnections.current.delete(username);
    }

    remoteStreams.current.delete(username);
  };

  // ==================== Signaling

  const createOffer = async (targetUsername: string) => {
    console.log("Creating offer for:", targetUsername);

    const pc = createPeerConnection(targetUsername);

    if (!pc) return;

    try {
      const offer = await pc.createOffer();

      await pc.setLocalDescription(offer);

      console.log("Sending offer to:", targetUsername);

      socket.emit("webrtc:offer", {
        offer,
        targetUsername,
      });
    } catch (error) {
      console.error("Error creating offer for:", targetUsername, error);
    }
  };

  const handleOffer = async ({
    offer,
    senderSocketID,
    senderUsername,
  }: {
    offer: RTCSessionDescriptionInit;
    senderSocketID: string;
    senderUsername: string;
  }) => {
    console.log("Received offer from:", senderUsername);

    const pc = createPeerConnection(senderUsername);

    if (!pc) return;
    try {
      await pc.setRemoteDescription(offer);

      const pendingCandidates =
        pendingICECandidates.current.get(senderUsername) || [];

      for (const candidate of pendingCandidates) {
        await pc.addIceCandidate(candidate);
      }

      pendingICECandidates.current.delete(senderUsername);

      const answer = await pc.createAnswer();

      await pc.setLocalDescription(answer);

      console.log("Sending answer to:", senderUsername);

      socket.emit("webrtc:answer", {
        answer,
        targetSocketID: senderSocketID,
      });
    } catch (error) {
      console.error("Error handling offer from:", senderUsername, error);
    }
  };

  const handleAnswer = async ({
    answer,
    senderUsername,
  }: {
    answer: RTCSessionDescriptionInit;
    senderUsername: string;
  }) => {
    const pc = peerConnections.current.get(senderUsername);

    console.log("Received answer from:", senderUsername);

    if (!pc) return;
    try {
      await pc.setRemoteDescription(answer);

      console.log("Remote description set for:", senderUsername);
    } catch (error) {
      console.error("Error handling answer from:", senderUsername, error);
    }
  };

  // ==================== ICE Candidates

  const handleICECandidate = async ({
    candidate,
    senderUsername,
  }: {
    candidate: RTCIceCandidateInit;
    senderUsername: string;
  }) => {
    console.log("Received ICE candidate from:", senderUsername);

    const pc = peerConnections.current.get(senderUsername);

    if (!pc) return;

    if (!pc.remoteDescription) {
      const pending = pendingICECandidates.current.get(senderUsername) || [];
      pending.push(candidate);
      pendingICECandidates.current.set(senderUsername, pending);

      return;
    }
    try {
      await pc.addIceCandidate(candidate);
    } catch (error) {
      console.error("Error adding ICE candidate from:", senderUsername, error);
    }
  };

  //============== User left
  useEffect(() => {
    const handleRoomUserLeft = ({ username }: { username: string }) => {
      console.log("User left:", username);
      closePeerConnection(username);

      pendingICECandidates.current.delete(username);
    };

    socket.on("roomUserLeft", handleRoomUserLeft);

    return () => {
      socket.off("roomUserLeft", handleRoomUserLeft);
    };
  }, [socket]);

  // ==================== Cleanup

  const cleanupWebRTC = () => {
    // Stop camera + mic
    localStreamRef.current?.getTracks().forEach((track) => {
      console.log(
        "Stopping track:",
        track.kind,
        "readyState:",
        track.readyState,
      );

      track.stop();

      console.log("After stop:", track.kind, "readyState:", track.readyState);
    });

    localStreamRef.current = null;

    // Close all peer connections
    peerConnections.current.forEach((pc) => {
      pc.close();
    });
    peerConnections.current.clear();

    // clear remote streams and pending ICE candidates
    remoteStreams.current.clear();
    pendingICECandidates.current.clear();

    setLocalStream(null);
  };

  // ==================== Cleanup on unmount or user logout
  useEffect(() => {
    return () => {
      console.log("unmount usewebrtc");
      cleanupWebRTC();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      cleanupWebRTC();
    }
  }, [user]);

  // ==================== Socket Event Listeners

  useEffect(() => {
    socket.on("webrtc:offer", handleOffer);
    socket.on("webrtc:answer", handleAnswer);
    socket.on("webrtc:ice-candidate", handleICECandidate);

    return () => {
      socket.off("webrtc:offer", handleOffer);
      socket.off("webrtc:answer", handleAnswer);
      socket.off("webrtc:ice-candidate", handleICECandidate);
    };
  }, [socket]);

  return {
    localStream,
    remoteStreams,
    getLocalStream,
    cleanupWebRTC,
    createOffer,
  };
};

export default useWebRTC;
