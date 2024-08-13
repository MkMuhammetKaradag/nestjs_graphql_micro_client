import { gql } from '@apollo/client';
export const REMOVE_SHOPPING_CART_PRODUCT = gql`
  mutation RemoveShoppingCartProduct($input: AddShoppingCartProductInput!) {
    removeShoppingCartItemProduct(removeShoppingCartProductInput: $input) {
      shoppingCart {
        id
      }
    }
  }
`;
