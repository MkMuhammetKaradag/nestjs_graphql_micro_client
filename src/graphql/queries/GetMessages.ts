import { gql } from '@apollo/client';

export const GET_MESSAGES = gql`
  query GetMessages($chatId: Float!, $skip: Float!, $take: Float!) {
    getMessages(
      getMessageInput: { chatId: $chatId, skip: $skip, take: $take }
    ) {
      messages {
        id
        content
        createdAt
        sender {
          id
          firstName
          lastName
          profilPhoto
        }
      }
      total
    }
  }
`;
