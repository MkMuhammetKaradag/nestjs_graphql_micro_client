import { gql } from '@apollo/client';
export const GET_CHAT_USER = gql`
  query GetChat($input: GetChatInput!) {
    getChat(getChatInput: $input) {
      id
      users {
        id
        firstName
        lastName
        profilPhoto
        isOnline
      }
    }
  }
`;
