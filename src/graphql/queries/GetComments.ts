import { gql } from '@apollo/client';
export const GET_COMMENTS = gql`
  query GetComments($input: GetCommentsInput!) {
    getComments(getCommentsInput: $input) {
      comments {
        id
        text
        createdAt
        user {
          firstName
          id
          lastName
          profilPhoto
        }
      }
      total
    }
  }
`;
