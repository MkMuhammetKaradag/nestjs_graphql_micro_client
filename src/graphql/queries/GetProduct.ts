import { gql } from '@apollo/client';
export const GET_PRODUCT = gql`
  query GetProduct($input: GetProductDto!) {
    getProduct(getProductDto: $input) {
      product {
        id
        description
        price
        quantity
        images
        name
        vendor {
          id
          firstName
          lastName
          email
        }
      }
    }
  }
`;
