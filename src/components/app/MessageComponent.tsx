import React from 'react';
import { useAppSelector } from '../../context/hooks';
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
const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  const user = useAppSelector((s) => s.auth.user);
  const isMyMessage = message.sender.id == user?.id; // Kendi mesajlarınızı belirlemek için
  const formattedDate = new Date(message.createdAt).toLocaleString();

  return (
    <div
      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isMyMessage && (
        <img
          src={message.sender.profilPhoto}
          alt={`${message.sender.firstName} ${message.sender.lastName}`}
          className="w-10 h-10 rounded-full mr-3"
        />
      )}
      <div>
        <div
          className={`p-4 rounded-lg ${
            isMyMessage ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
          }`}
        >
          <p>{message.content}</p>
        </div>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>

      {isMyMessage && (
        <img
          src={message.sender.profilPhoto}
          alt={`${message.sender.firstName} ${message.sender.lastName}`}
          className="w-10 h-10 rounded-full ml-3"
        />
      )}
    </div>
  );
};

export default MessageComponent;
