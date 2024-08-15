import { gql } from '@apollo/client';
export const MESSAGE_SENT = gql`
  subscription MessageSent($chatId: Float!) {
    messageSent(chatId: $chatId) {
      id
      content
      createdAt
      sender {
        id
        firstName
        lastName
        isOnline
        profilPhoto
      }
    }
  }
`;
