import { gql } from '@apollo/client';
export const CREATE_PAYMENT = gql`
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(createPaymentInput: $input) {
      id
    }
  }
`;
