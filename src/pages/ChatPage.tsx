import { useQuery } from '@apollo/client';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GET_MESSAGES } from '../graphql/queries/GetMessages';
interface Message {
  id: number;
  content: string;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
    profilPhoto: string;
  };
}

interface GetMessagesResponse {
  getMessages: {
    messages: Message[];
    total: number;
  };
}

const ChatPage = () => {
  const { id } = useParams<{ id: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [skip, setSkip] = useState(0);
  const take = 10;

  const { data, loading, fetchMore } = useQuery<GetMessagesResponse>(
    GET_MESSAGES,
    {
      variables: { chatId: Number(id), skip: 0, take },
      notifyOnNetworkStatusChange: true,
      // onCompleted: (res) => {
      //   setSkip(res.getMessages.length);
      // },
    }
  );

  const observerRef = useRef<HTMLDivElement | null>(null);

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

  const loadMoreMessages = () => {
    if (
      !loading &&
      data?.getMessages.messages.length < data?.getMessages.total
    ) {
      console.log(skip);
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
          setSkip(
            (prevSkip) => prevSkip + res.data.getMessages.messages.length
          );
        })
        .catch((err: any) =>
          console.error('Fetch more error:', err.graphQLErrors[0].message)
        );
    }
  };
  if (!data || !data.getMessages.messages) {
    return <div>Ürün bulunamadı</div>;
  }
  const myMessages: Message[] = data.getMessages.messages;
  return (
    <div>
      <div>{skip}</div>
      <div style={{ overflowY: 'auto', height: '400px', width: '500px' }}>
        {myMessages.map((message) => (
          <div key={message.id}>
            <p>{message.content}</p>
            <small>
              {message.sender.firstName} {message.sender.lastName}
            </small>
          </div>
        ))}
        {loading && <p>Loading more messages...</p>}
        <div ref={observerRef} style={{ height: '1px' }} />
      </div>
    </div>
  );
};

export default ChatPage;
