import { gql } from '@apollo/client';
export const GET_USER_CHATS = gql`
  query GetUserChats {
    getUserChats {
      id
      chats {
        id
        users {
          id
          profilPhoto
        }
      }
    }
  }
`;
