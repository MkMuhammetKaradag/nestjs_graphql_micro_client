import { gql } from '@apollo/client';
export const GET_MY_SHOPPING_CART = gql`
  query GetShoppingCart {
    getMyShoppingCart {
      shoppingCart {
        id
        items {
          id
          product {
            id
            description
            name
            images
            price
          }
          quantity
        }
      }
    }
  }
`;
