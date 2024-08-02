import { gql } from '@apollo/client';
export const GET_PRODUCTS = gql`
  query GetProducts($input: GetProductsDto!) {
    getProducts(getProductsDto: $input) {
      products {
        id
        description
        name
        price
        images
      }
      total
    }
  }
`;
