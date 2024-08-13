import { gql } from '@apollo/client';
export const REMOVE_SHOPPING_CART_ITEM = gql`
  mutation RemoveShoppingCartItem($input: AddShoppingCartProductInput!) {
    removeShoppingCartItem(removeShoppingCartItemInput: $input) {
      shoppingCart {
        id
      }
    }
  }
`;
