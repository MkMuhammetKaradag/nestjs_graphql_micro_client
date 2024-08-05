import styles from '../../utils/styles';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useMutation } from '@apollo/client';
import { FORGOT_PASSWORD } from '../../graphql/mutations/ForgotPassword';

const formSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordSchema = z.infer<typeof formSchema>;

const ForgotPassword = ({
  setActiveState,
}: {
  setActiveState: (e: string) => void;
}) => {
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      await forgotPassword({
        variables: {
          input: {
            email: data.email,
          },
        },
      });
      toast.success('Please check your email to reset your password!');
      reset();
    } catch (error: any) {
      console.log('GraphQL Errors:', error.graphQLErrors[0].message);
      toast.error(`Error  ${error.graphQLErrors[0].message}`);
    }
  };

  return (
    <div>
      <h1 className={`${styles.title}`}>Forgot your password?</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className={`${styles.label}`}>Enter your Email</label>
        <input
          {...register('email')}
          type="email"
          placeholder="loginmail@gmail.com"
          className={`${styles.input}`}
        />
        {errors.email && (
          <span className="text-red-500 block mt-1">
            {`${errors.email.message}`}
          </span>
        )}
        <br />
        <br />
        <input
          type="submit"
          value="Submit"
          disabled={isSubmitting}
          className={[
            'w-full text-[17px] font-semibold text-white py-3  cursor-pointer rounded-sm',
            !watch('email') ? 'bg-gray-200' : 'bg-[#F02C56]',
          ].join(' ')}
        />
        <br />
      </form>
    </div>
  );
};

export default ForgotPassword;
