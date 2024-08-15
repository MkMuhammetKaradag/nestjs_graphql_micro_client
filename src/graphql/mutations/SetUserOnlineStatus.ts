import { gql } from '@apollo/client';

export const SET_USER_ONLINE_STATUS = gql`
  mutation SetUserOnlineStatus($input: SetUserOnlineStatusInput!) {
    setUserOnlineStatus(setUserOnlineStatusInput: $input) {
      id
      isOnline
    }
  }
`;
