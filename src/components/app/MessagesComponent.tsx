import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import MessageComponent, { Message } from './MessageComponent';
import { useQuery } from '@apollo/client';
import { GET_MESSAGES } from '../../graphql/queries/GetMessages';
import { MESSAGE_SENT } from '../../graphql/subcriptions/SendMessage';
import { useAppSelector } from '../../context/hooks';
interface GetMessagesResponse {
  getMessages: {
    messages: Message[];
    total: number;
  };
}

interface GetSubcriptionMessagesResponse {
  data: {
    messageSent: Message;
  };
}
interface MessagesProps {
  id: number;
}
const MessagesComponent: React.FC<MessagesProps> = ({ id }) => {
  const user = useAppSelector((s) => s.auth.user);
  const take = 10;

  const { data, loading, fetchMore, subscribeToMore } =
    useQuery<GetMessagesResponse>(GET_MESSAGES, {
      variables: { chatId: Number(id), skip: 0, take },
      notifyOnNetworkStatusChange: true,
    });

  const observerRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [scrollHeight, setscrollHeight] = useState(0);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight - scrollHeight;
      setscrollHeight(chatContainerRef.current.scrollHeight);
      console.log('naber');
    }
  }, [loading]); // Mesajlar her güncellendiğinde tetiklenir
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreMessages();
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [observerRef.current, loading]);
  useEffect(() => {
    // Yeni ürünler eklendiğinde listeyi güncellemek için subscribeToMore'u kullanın
    const unsubscribe = subscribeToMore({
      document: MESSAGE_SENT,
      variables: {
        chatId: Number(id),
      },
      updateQuery: (
        prev: GetMessagesResponse,
        {
          subscriptionData,
        }: { subscriptionData: GetSubcriptionMessagesResponse }
      ): GetMessagesResponse => {
        if (!subscriptionData.data) return prev;

        const newMessage = subscriptionData.data.messageSent;
        console.log(newMessage);
        if (chatContainerRef.current && newMessage.sender.id == user?.id) {
          const chatContainer = chatContainerRef.current;
          // Ensure the chat container has been updated with new content
          setTimeout(() => {
            chatContainer.scrollTop =
              chatContainer.scrollHeight - chatContainer.clientHeight;
          }, 0);
        }
        return {
          ...prev,
          getMessages: {
            ...prev.getMessages,
            messages: [newMessage, ...prev.getMessages.messages],
            total: prev.getMessages.total + 1,
          },
        };
      },
      onError: (err) => {
        // console.log('GraphQL Errors:', err.graphQLErrors[0].message);
        console.log(err);
      },
    });

    // Aboneliği bileşen temizlenirken iptal edin
    return () => unsubscribe();
  }, [subscribeToMore]);

  if (!data || !data.getMessages.messages) {
    return <div>Ürün bulunamadı</div>;
  }
  const loadMoreMessages = () => {
    const dataLength = data?.getMessages.messages.length | 0;
    const dataTotal = data?.getMessages?.total | 0;
    if (!loading && dataLength < dataTotal) {
      fetchMore({
        variables: {
          chatId: Number(id),
          skip: data?.getMessages.messages.length,
          take,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;

          return {
            ...previousResult,
            getMessages: {
              ...previousResult.getMessages,
              messages: [
                ...previousResult.getMessages.messages,
                ...fetchMoreResult.getMessages.messages,
              ],
              total: fetchMoreResult.getMessages.total,
            },
          };
        },
      })
        .then((res) => {
          console.log('sds');
        })
        .catch((err: any) =>
          console.error('Fetch more error:', err.graphQLErrors[0].message)
        );
    }
  };

  const myMessages: Message[] = [...data.getMessages.messages].reverse();

  return (
    <div
      id="chat-container"
      ref={chatContainerRef}
      className="p-6  w-full h-full bg-white rounded-sm  space-y-4 overflow-y-auto flex flex-col"
    >
      <div ref={observerRef} style={{ height: '1px' }} />
      {loading && <p>Loading more messages...</p>}
      {myMessages.map((message) => (
        <MessageComponent key={message.id} message={message} />
      ))}
    </div>
  );
};

export default MessagesComponent;
