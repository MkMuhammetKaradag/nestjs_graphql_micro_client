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
      comments{
        id
        text
        createdAt
        user{
          id
          firstName
          lastName
        }
      }
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
