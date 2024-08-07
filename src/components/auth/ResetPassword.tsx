'use client';
import styles from '../../utils/styles';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import { useState } from 'react';
// import { LOGIN_USER } from '@/src/graphql/actions/login.action';
// import { useMutation } from '@apollo/client';
// import { RESET_PASSWORD } from '@/src/graphql/actions/reset-password.action';
import toast from 'react-hot-toast';
import { RESET_PASSWORD } from '../../graphql/mutations/ResetPassword';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
// import { signIn } from 'next-auth/react';

const formSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8characters long!'),
    confirmPassword: z.string(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: 'Password does not match',
      path: ['confirmPassword'],
    }
  );

type ResetPasswordSchema = z.infer<typeof formSchema>;

const ResetPassword = ({
  activationToken,
  setActiveState,
}: {
  activationToken: string | string[];
  setActiveState: (e: string) => void;
}) => {
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(formSchema),
  });
  const [show, setShow] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      const response = await resetPassword({
        variables: {
          input: {
            activationToken: activationToken,
            password: data.password,
          },
        },
      });
      toast.success('password updated successfully');
      setActiveState("Login")
      navigate('/');
    } catch (error: any) {
      console.log('GraphQL Errors:', error.graphQLErrors[0].message);
      toast.error(`Error  ${error.graphQLErrors[0].message}`);
    }
  };

  return (
    <div>
      <h1 className={`${styles.title}`}>reset your password</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="password" className={`${styles.label}`}>
            Enter your password
          </label>
          <input
            {...register('password')}
            type={!show ? 'password' : 'text'}
            placeholder="password!@%"
            className={`${styles.input}`}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
        </div>
        {errors.password && (
          <span className="text-red-500">{`${errors.password.message}`}</span>
        )}
        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="password" className={`${styles.label}`}>
            Enter your confirm password
          </label>
          <input
            {...register('confirmPassword')}
            type={!confirmPasswordShow ? 'password' : 'text'}
            placeholder="password!@%"
            className={`${styles.input}`}
          />
          {!confirmPasswordShow ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setConfirmPasswordShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setConfirmPasswordShow(false)}
            />
          )}
        </div>
        {errors.confirmPassword && (
          <span className="text-red-500">{`${errors.confirmPassword.message}`}</span>
        )}
        <input
          type="submit"
          value="Submit"
          disabled={isSubmitting}
          className={[
            'w-full text-[17px] font-semibold text-white py-3  cursor-pointer rounded-sm',
            !watch('confirmPassword') || !watch('password')
              ? 'bg-gray-200'
              : 'bg-[#F02C56]',
          ].join(' ')}
        />

        <br />
      </form>
    </div>
  );
};

export default ResetPassword;
