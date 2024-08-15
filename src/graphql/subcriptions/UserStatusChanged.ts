import { gql } from '@apollo/client';

export const USER_STATUS_CHANGED = gql`
  subscription UserStatusChanged($chatId: Float!) {
    userStatusChanged(chatId: $chatId) {
      id
      isOnline
    }
  }
`;
