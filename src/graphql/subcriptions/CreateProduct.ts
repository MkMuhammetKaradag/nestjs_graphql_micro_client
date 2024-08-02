import { gql } from '@apollo/client';
export const CREATED_PRODUCT_SUBSCRIPTION = gql`
  subscription CreatedProduct {
    productCreated {
      id
      description
      name
      price
      images
    }
  }
`;
