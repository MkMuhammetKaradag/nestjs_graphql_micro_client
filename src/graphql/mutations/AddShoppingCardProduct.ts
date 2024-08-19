import { gql } from '@apollo/client';
export const ADD_SHOPPING_CART_PRODUCT = gql`
  mutation AddShoppingCartProduct($input: AddShoppingCartProductInput!) {
    addShoppingCartProduct(addShoppingCartProductInput: $input) {
      id
      product {
        id
      }
    }
  }
`;
