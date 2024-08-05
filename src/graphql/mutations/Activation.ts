import { gql } from '@apollo/client';
export const ACTIVATION_USER = gql`
  mutation ActivateUser($input: ActivationInput!) {
    activateUser(activationInput: $input) {
      user {
        email
      }
    }
  }
`;
