import { useMutation, useQuery } from '@apollo/client';
import React, { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GET_MESSAGES } from '../graphql/queries/GetMessages';
import { useAppSelector } from '../context/hooks';
import MessagesComponent from '../components/app/MessagesComponent';

import MessageSendForm from '../components/app/MessageSendForm';
import ChatUsersComponent from '../components/app/ChatUsersComponent';
import { MdVideoCall } from 'react-icons/md';
import { JOIN_VIDEO_ROOM_TOKEN } from '../graphql/mutations/JoinVideoRoom';

import {
  Room,
  createLocalTracks,
  Track,
  ConnectionQuality,
  LocalParticipant,
  RemoteParticipant,
  Participant,
} from 'livekit-client';
import {
  Chat,
  ControlBar,
  GridLayout,
  isTrackReference,
  LiveKitRoom,
  ParticipantName,
  ParticipantTile,
  RoomAudioRenderer,
  TrackMutedIndicator,
  TrackRefContext,
  useConnectionQualityIndicator,
  useTracks,
  VideoTrack,
  useLocalParticipant,
  useRoomContext,
  useTrackToggle,
  useParticipants,
  AudioTrack,
  TrackReferenceOrPlaceholder,
} from '@livekit/components-react';
import '@livekit/components-styles';
import Modal from '../components/app/Modal';
export interface Message {
  id: number;
  content: string;
  createdAt: string;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
    profilPhoto: string;
  };
}

interface MessageProps {
  message: Message;
}
const serverUrl = 'wss://dcclone-gh7o1vv0.livekit.cloud';
const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const [joinVideoRoom, { data }] = useMutation(JOIN_VIDEO_ROOM_TOKEN);
  // const videoRef = useRef<HTMLVideoElement>(null);
  // const roomRef = useRef<Room | null>(null); // Oda referansını tutmak için
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [connect, setConnect] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleDisconnect = () => {
    setConnect(false);
    setIsConnected(false);
  };
  const handleJoinVideoRoom = async () => {
    const { data } = await joinVideoRoom({
      variables: { chatId: Number(id) },
    });
    openModal();
    console.log(data);
  };

  return (
    <div className="container max-h-[75vh]   md:grid-cols-3 grid  lg:grid-cols-4   ">
      <div className="col-span-1 shadow-md bg-white border lg:block hidden">
        <div>
          <MdVideoCall
            onClick={handleJoinVideoRoom}
            className={'cursor-pointer'}
            size={35}
          />
        </div>
        <ChatUsersComponent id={Number(id)}></ChatUsersComponent>
      </div>
      <div className=" col-span-3  w-full flex flex-col overflow-y-auto shadow-md ">
        <MessagesComponent id={Number(id)}></MessagesComponent>
        <MessageSendForm id={Number(id)}></MessageSendForm>
      </div>

      <Modal show={isModalOpen} onClose={closeModal}>
        {!isConnected && (
          <button
            className="bg-red-500 p-2"
            onClick={() => setConnect(!connect)}
          >
            {connect ? 'Disconnect' : 'Connect'}
          </button>
        )}
        {data?.joinVideoRoom && (
          <LiveKitRoom
            video={true}
            audio={true}
            token={data?.joinVideoRoom}
            serverUrl={serverUrl}
            className="h-full overflow-y-auto relative"
            style={{ height: '100dvh' }}
            connect={connect}
            onConnected={() => setIsConnected(true)}
            onDisconnected={handleDisconnect}
          >
            {isConnected && <Stage />}

            <CustomControlBar></CustomControlBar>

            <RoomAudioRenderer />
          </LiveKitRoom>
        )}
      </Modal>
    </div>
  );
};
export function Stage() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      // { source: Track.Source.ScreenShare, withPlaceholder: false },
      { source: Track.Source.Microphone, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  console.log(tracks);
  return (
    <>
      <div className={'overflow-y-auto  h-full '}>
        <GridLayout tracks={tracks} className="space-x-3">
          <TrackRefContext.Consumer>
            {(trackRef) =>
              trackRef && (
                <div className="flex flex-col ">
                  {isTrackReference(trackRef) ? (
                    <>
                      {/* <VideoTrack trackRef={trackRef} /> */}
                      <ParticipantTile  />
                      <AudiControl trackRef={trackRef}></AudiControl>
                    </>
                  ) : (
                    <p>Camera placeholder</p>
                  )}
                  {/* <AudiControl trackRef={trackRef}></AudiControl> */}
                  {trackRef.source !== Track.Source.Microphone && (
                    <div className={'flex gap-3 items-center'}>
                      <div style={{ display: 'flex gap-1' }}>
                        <TrackMutedIndicator
                          trackRef={{
                            participant: trackRef.participant,
                            source: Track.Source.Microphone,
                          }}
                        />
                        {/* {isTrackReference(trackRef) &&
                        trackRef.source === Track.Source.Microphone && (
                          <AudioTrack
                            trackRef={trackRef}
                            volume={0.5}
                            muted={false}
                          />
                        )} */}

                        <TrackMutedIndicator trackRef={trackRef} />
                      </div>

                      {/* Overwrite styles: By passing class names, we can easily overwrite/extend the existing styles. */}
                      {/* In addition, we can still specify a style attribute and further customize the styles. */}
                      <ParticipantName
                        className={'text-red-700'}
                        // style={{ color: 'blue' }}
                      />
                      {/* Custom components: Here we replace the provided <ConnectionQualityIndicator />  with our own implementation. */}
                      <UserDefinedConnectionQualityIndicator />
                    </div>
                  )}
                </div>
              )
            }
          </TrackRefContext.Consumer>
        </GridLayout>
      </div>
    </>
  );
}

export function UserDefinedConnectionQualityIndicator(
  props: HTMLAttributes<HTMLSpanElement>
) {
  /**
   *  We use the same React hook that is used internally to build our own component.
   *  By using this hook, we inherit all the state management and logic and can focus on our implementation.
   */
  const { quality } = useConnectionQualityIndicator();

  function qualityToText(quality: ConnectionQuality): string {
    switch (quality) {
      case ConnectionQuality.Poor:
        return 'Poor';
      case ConnectionQuality.Good:
        return 'Good';
      case ConnectionQuality.Excellent:
        return 'Excellent';
      case ConnectionQuality.Lost:
        return 'Reconnecting';
      default:
        return 'No idea';
    }
  }

  return <span {...props}> {qualityToText(quality)} </span>;
}
const CustomControlBar: React.FC = () => {
  const { localParticipant } = useLocalParticipant();
  const toggleAudio = () => {
    if (localParticipant.isMicrophoneEnabled) {
      localParticipant.setMicrophoneEnabled(false);
    } else {
      localParticipant.setMicrophoneEnabled(true);
    }
  };

  const toggleVideo = () => {
    if (localParticipant.isCameraEnabled) {
      localParticipant.setCameraEnabled(false);
    } else {
      localParticipant.setCameraEnabled(true);
    }
  };

  return (
    <div className="flex justify-center space-x-4 p-4 bg-gray-800 text-white">
      <button onClick={toggleAudio} className="bg-blue-500 px-4 py-2 rounded">
        {localParticipant.isMicrophoneEnabled
          ? 'Mikrofonu Kapat'
          : 'Mikrofonu Aç'}
      </button>
      <button onClick={toggleVideo} className="bg-blue-500 px-4 py-2 rounded">
        {localParticipant.isCameraEnabled ? 'Kamerayı Kapat' : 'Kamerayı Aç'}
      </button>
    </div>
  );
};

interface AudiControlProps {
  trackRef: TrackReferenceOrPlaceholder;
}
const AudiControl: React.FC<AudiControlProps> = ({ trackRef }) => {
  const [volume, setVolume] = useState(0.9);
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
  };
  return (
    <div>
      {isTrackReference(trackRef) ? (
        <>
          {trackRef.source === Track.Source.Microphone ? (
            <div>
              <AudioTrack trackRef={trackRef} volume={volume} muted={false} />
              <input
                id="volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>
          ) : (
            <div>
              {/* <VideoTrack trackRef={trackRef} /> */}
              as
            </div>

            // <div>dd</div>
          )}
        </>
      ) : (
        <p>Camera placeholder</p>
      )}
    </div>
  );
};
export default ChatPage;
