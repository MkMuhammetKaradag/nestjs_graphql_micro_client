import { gql } from '@apollo/client';
export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(forgotPasswordInput: $input) {
    message
    }
  }
`;
