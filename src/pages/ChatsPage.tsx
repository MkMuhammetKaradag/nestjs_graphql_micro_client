import { useQuery } from '@apollo/client';
import React from 'react';
import { GET_USER_CHATS } from '../graphql/queries/GetChats';
import { useNavigate, useNavigation } from 'react-router-dom';
interface User {
  id: number;
  profilPhoto: string | null;
}
interface Chat {
  id: number;
  users: User[] | null;
}
interface UserChats {
  id: number;
  chats: Chat[] | null;
}
const ChatsPage = () => {
  const { data, loading, error } = useQuery(GET_USER_CHATS);
  const navigate = useNavigate();
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  if (!data || !data.getUserChats.chats) {
    return <div>Chats Not Found</div>;
  }
  const userChats: UserChats = data.getUserChats;
  return (
    <div className="container">
      {userChats.chats &&
        userChats.chats.map((chat, index) => (
          <div
            className="bg-whit border-b-2 border-gray-80000 cursor-pointer  flex p-3"
            onClick={() => navigate(`/chat/${chat.id}`)} // navigate(`chat/${chat.id}`) `/ if you don't use chats/chate will disappear
            key={index}
          >
            {chat.users &&
              chat.users.length < 4 &&
              chat.users.map((user, index) => (
                <div className={'ml-2'} key={index}>
                  {user.profilPhoto ? (
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={user.profilPhoto}
                    />
                  ) : (
                    <div className="rounded-full flex min-h-8 min-w-8 items-center justify-center bg-gray-200">
                      <span className="text-gray-500">N</span>
                    </div>
                  )}
                </div>
              ))}
            {chat.users && chat.users.length > 3 && (
              <div className="ml-2 text-gray-500 flex  ">
                +{chat.users.length - 3}
                {chat.users.slice(0, 3).map((user, index) => (
                  <div className={'ml-2'} key={index}>
                    {user.profilPhoto ? (
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={user.profilPhoto}
                      />
                    ) : (
                      <div className="rounded-full flex min-h-8 min-w-8 items-center justify-center bg-gray-200">
                        <span className="text-gray-500">N</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default ChatsPage;
