import { gql } from '@apollo/client';
export const CREATE_MESSAGE = gql`
  mutation MessageSend($input: SendMessageInput!) {
    sendMessage(sendMessageInput: $input) {
      id
    }
  }
`;
