import { gql } from '@apollo/client';
export const CREATE_COMMENT = gql`
  mutation addCommentProduct($input: AddCommentProductInput!) {
    addCommentProduct(addCommentProductInput: $input) {
      comment {
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
    }
  }
`;
