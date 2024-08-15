import { useQuery } from '@apollo/client';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GET_MESSAGES } from '../graphql/queries/GetMessages';
import { useAppSelector } from '../context/hooks';
import MessagesComponent from '../components/app/MessagesComponent';
import styles from '../utils/styles';
import MessageSendForm from '../components/app/MessageSendForm';
import ChatUsersComponent from '../components/app/ChatUsersComponent';
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
const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  // const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  //   const user = useAppSelector((s) => s.auth.user);
  //   const isMyMessage = message.sender.id == user?.id; // Kendi mesajlarınızı belirlemek için
  //   const formattedDate = new Date(message.createdAt).toLocaleString();

  //   return (
  //     <div
  //       className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-4`}
  //     >
  //       {!isMyMessage && (
  //         <img
  //           src={message.sender.profilPhoto}
  //           alt={`${message.sender.firstName} ${message.sender.lastName}`}
  //           className="w-10 h-10 rounded-full mr-3"
  //         />
  //       )}
  //       <div>
  //         <div
  //           className={`p-4 rounded-lg ${
  //             isMyMessage ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
  //           }`}
  //         >
  //           <p>{message.content}</p>
  //         </div>
  //         <span className="text-xs text-gray-500">{formattedDate}</span>
  //       </div>

  //       {isMyMessage && (
  //         <img
  //           src={message.sender.profilPhoto}
  //           alt={`${message.sender.firstName} ${message.sender.lastName}`}
  //           className="w-10 h-10 rounded-full ml-3"
  //         />
  //       )}
  //     </div>
  //   );
  // };
  return (
    <div className="container bg-red-300 md:grid-cols-3 grid  lg:grid-cols-4   ">
      <div className="col-span-1 shadow-md bg-white border- md:block hidden">
        <ChatUsersComponent id={Number(id)}></ChatUsersComponent>
      </div>
      <div className="col-span-3 w-full  flex flex-col overflow-y-auto shadow-md ">
        <MessagesComponent id={Number(id)}></MessagesComponent>
        <MessageSendForm id={Number(id)}></MessageSendForm>
      </div>
    </div>
  );
};

export default ChatPage;
