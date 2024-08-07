import { gql } from '@apollo/client';
export const CREATE_COMMENT_PRODUCT_SUBSCRIPTION = gql`
  subscription createCommentProduct($productId: Float!) {
    createCommentProduct(productId: $productId) {
      id
      text
      createdAt
      user {
        id
        firstName
        lastName
      }
    }
  }
`;
