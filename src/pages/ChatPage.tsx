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

  return (
    <div className="container max-h-[75vh]   md:grid-cols-3 grid  lg:grid-cols-4   ">
      <div className="col-span-1 shadow-md bg-white border lg:block hidden">
        <ChatUsersComponent id={Number(id)}></ChatUsersComponent>
      </div>
      <div className=" col-span-3  w-full flex flex-col overflow-y-auto shadow-md ">
        <MessagesComponent id={Number(id)}></MessagesComponent>
        <MessageSendForm id={Number(id)}></MessageSendForm>
      </div>
    </div>
  );
};

export default ChatPage;
