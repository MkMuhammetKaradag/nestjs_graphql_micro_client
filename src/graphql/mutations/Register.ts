import { gql } from '@apollo/client';
export const REGISTER_USER = gql`
  mutation RegisterUser($input: UserRegisterInput!) {
    register(userRegisterInput: $input) {
      activation_token
    }
  }
`;
