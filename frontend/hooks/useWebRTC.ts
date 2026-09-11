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
  const [remoteStreamsState, setRemoteStreamsState] = useState<
    Map<string, MediaStream>
  >(new Map());

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
  // ==================== Camera / Microphone Toggle
  const toggleMic = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];

    if (!audioTrack) return false;

    audioTrack.enabled = !audioTrack.enabled;

    return audioTrack.enabled;
  };

  const toggleCamera = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];

    if (!videoTrack) return false;

    videoTrack.enabled = !videoTrack.enabled;

    return videoTrack.enabled;
  };

  // ==================== Peer Connection

  const createPeerConnection = (username: string) => {
    if (!localStreamRef.current) {
      return;
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    localStreamRef.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current!);
    });

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;

      if (remoteStream) {
        remoteStreams.current.set(username, remoteStream);
        setRemoteStreamsState(new Map(remoteStreams.current));
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc:ice-candidate", {
          candidate: event.candidate,
          targetUsername: username,
        });
      }
    };

    peerConnections.current.set(username, pc);

    return pc;
  };

  const closePeerConnection = (username: string) => {
    const pc = peerConnections.current.get(username);

    if (pc) {
      pc.close();
      peerConnections.current.delete(username);
    }

    remoteStreams.current.delete(username);
    setRemoteStreamsState(new Map(remoteStreams.current));
  };

  // ==================== Signaling

  const createOffer = async (targetUsername: string) => {
    const pc = createPeerConnection(targetUsername);

    if (!pc) return;

    try {
      const offer = await pc.createOffer();

      await pc.setLocalDescription(offer);

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

    if (!pc) return;
    try {
      await pc.setRemoteDescription(answer);
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
      track.stop();
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
    setRemoteStreamsState(new Map(remoteStreams.current));

    setLocalStream(null);
  };

  // ==================== Cleanup on unmount or user logout
  useEffect(() => {
    return () => {
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
    remoteStreamsState,
    toggleMic,
    toggleCamera,
    getLocalStream,
    cleanupWebRTC,
    createOffer,
  };
};

export default useWebRTC;
