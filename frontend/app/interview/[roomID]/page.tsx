import InterviewPage from "../InterviewPage";

interface InterviewRoomPageProps {
  params: Promise<{
    roomID: string;
  }>;
}

const InterviewRoomPage = async ({ params }: InterviewRoomPageProps) => {
  const { roomID } = await params;

  return <InterviewPage initialRoomID={roomID} />;
};

export default InterviewRoomPage;
