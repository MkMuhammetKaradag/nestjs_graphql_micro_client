import React, { useEffect } from 'react';
import { GET_CHAT_USER } from '../../graphql/queries/GetChatUsers';
import { useQuery } from '@apollo/client';
import { User } from '../../context/slices/AuthSlice';
import { USER_STATUS_CHANGED } from '../../graphql/subcriptions/UserStatusChanged';
interface ChatUsersComponentProps {
  id: number;
}
interface ChatUser {
  id: number;
  users: User[];
}

export interface UserStatusChangedResponse {
  userStatusChanged: User;
}
const ChatUsersComponent: React.FC<ChatUsersComponentProps> = ({ id }) => {
  const {
    data: dataChatUser,
    loading: loadingChatUser,
    error,
    subscribeToMore,
  } = useQuery<{ getChat: ChatUser }>(GET_CHAT_USER, {
    variables: {
      input: {
        chatId: Number(id),
      },
    },
  });

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: USER_STATUS_CHANGED,
      variables: { chatId: id }, // Burada chatId'yi subscription'a ekliyoruz
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: { subscriptionData: { data: UserStatusChangedResponse } }
      ) => {
        if (!subscriptionData.data) return prev;

        const updatedUser = subscriptionData.data.userStatusChanged;

        return {
          ...prev,
          getChat: {
            ...prev.getChat,
            users: prev.getChat.users.map((user) =>
              user.id === updatedUser.id
                ? { ...user, isOnline: updatedUser.isOnline }
                : user
            ),
          },
        };
      },
      onError: (err: any) => {
        console.error('Subscription error:', err.graphQLErrors[0].message);
      },
    });

    return () => unsubscribe();
  }, [subscribeToMore, id]);

  if (!dataChatUser || !dataChatUser.getChat) {
    return <div>Chats Not Found</div>;
  }

  const chatUser: ChatUser = dataChatUser.getChat;
  return (
    <div className="flex flex-col">
      {chatUser.users &&
        chatUser.users.map((user, index) => (
          <div
            className={
              'ml-2 flex  border-b-2 p-2 items-center  justify-between'
            }
            key={index}
          >
            <div className="flex items-center">
              {user.profilPhoto ? (
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={user.profilPhoto}
                />
              ) : (
                <div className="rounded-full flex h-8 w-8 items-center justify-center bg-gray-200">
                  <span className="text-gray-500">N</span>
                </div>
              )}
              <span className="ml-2">
                {user.firstName}-{user.lastName}
              </span>
            </div>

            <span>{user.isOnline ? 'online' : 'ofline'}</span>
          </div>
        ))}
    </div>
  );
};

export default ChatUsersComponent;
