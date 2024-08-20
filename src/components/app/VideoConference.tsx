// VideoConference.tsx
import React, { useEffect, useState } from 'react';
import { Room, LocalVideoTrack, RemoteVideoTrack } from 'livekit-client';

interface VideoConferenceProps {
  token: string; // LiveKit token
  roomName: string; // Odaya özel isim
}

const VideoConference: React.FC<VideoConferenceProps> = ({
  token,
  roomName,
}) => {
  const [client, setClient] = useState<Room | null>(null);

  useEffect(() => {
    // LiveKit ile bağlantı kurma
    const connectToRoom = async () => {
      const room = new Room();
      await room.connect('wss://dcclone-gh7o1vv0.livekit.cloud', token);
      setClient(room);
    };

    connectToRoom();

    // Temizlik
    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, [token, roomName]);

  if (!client) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md mb-4">
          <h2 className="text-xl font-bold mb-2">Your Video</h2>
          <LocalVideoTrack />
        </div>
        <div className="w-full max-w-md">
          <h2 className="text-xl font-bold mb-2">Participants</h2>
          {client.participants.map((participant) => (
            <div key={participant.identity} className="mb-4">
              <h3 className="text-lg font-semibold">{participant.identity}</h3>
              <RemoteVideoTrack participant={participant} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoConference;
