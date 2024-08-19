import React from 'react';
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { useMutation } from '@apollo/client';
import { CREATE_PAYMENT } from '../../graphql/mutations/CreatePaymnet';
import toast from 'react-hot-toast';
import { CREATE_PAYMENT_INTENT } from '../../graphql/mutations/CreatePaymentIntent';
import { useAppDispatch } from '../../context/hooks';
import { clearCart } from '../../context/slices/ShoppingCartSlice';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  amount: number;
  cartId: number;
}
interface PaymentFormProps {
  amount: number;
  cartId: number;
  onClose: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  cartId,
  onClose,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [createPaymentIntent] = useMutation(CREATE_PAYMENT_INTENT);
  const [createPayment, { loading }] = useMutation(CREATE_PAYMENT);
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (loading) {
      return <div>loading</div>;
    }

    const { data } = await createPaymentIntent({
      variables: { input: { amount, cartId } }, // Örnek değerler
    });

    if (!data || !data.createPaymentIntent) {
      throw new Error('Payment Intent oluşturulurken bir hata oluştu.');
    }
    const clientSecret = data.createPaymentIntent;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      }
    );

    if (error) {
      console.error('Ödeme sırasında bir hata oluştu:', error);
    } else if (paymentIntent?.status === 'succeeded') {
      await createPayment({
        variables: {
          input: { amount, cartId, source: paymentIntent.id },
        },
      }).
      toast.success('Ödeme başarılı!');
      dispatch(clearCart());
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="p-2 border border-gray-300 rounded" />
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-sm hover:bg-blue-600"
        disabled={!stripe}
      >
        Ödemeyi Tamamla
      </button>
    </form>
  );
};

const PaymentModal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  cartId,
  amount,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 w-1/3">
        <h2 className="text-xl mb-4">Ödeme Bilgilerinizi Girin</h2>
        <PaymentForm cartId={cartId} amount={amount} onClose={onClose} />
        <button
          className="mt-4 ml-4 bg-gray-500 text-white py-2 px-4 rounded-sm hover:bg-gray-600"
          onClick={onClose}
        >
          İptal
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
