import { gql } from '@apollo/client';
export const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent($input: CreatePaymentIntentInput!) {
    createPaymentIntent(createPaymentIntentInput: $input) {
      clientSecret
      paymentId
    }
  }
`;
