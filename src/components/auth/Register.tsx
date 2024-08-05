import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { GraphQLErrorExtensions } from 'graphql';
import Input from '../app/Input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import styles from '../../utils/styles';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { LOGIN_USER } from '../../graphql/mutations/Login';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../../context/hooks';
import { setIsAuth, setUser } from '../../context/slices/AuthSlice';
import { REGISTER_USER } from '../../graphql/mutations/Register';

const formSchema = z
  .object({
    email: z.string().email(),
    firstName: z.string().min(2, 'firsName must be at least 2 chracters long!'),
    lastName: z.string().min(2, 'lastName must be at least 2 chracters long!'),
    password: z.string().min(8, 'Password must be at least 8 characters long!'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long!'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'], // hata confirmPassword alanına atanacak
    message: "Passwords don't match!", // hata mesajı
  });
type RegisterSchema = z.infer<typeof formSchema>;

function Register({ setActiveState }: { setActiveState: (e: string) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    watch,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(formSchema),
  });

  const [show, setShow] = useState(false);
  const [UserRegister, { loading, error }] = useMutation(REGISTER_USER);
  const dispatch = useAppDispatch();
  const handleRegister = async (data: RegisterSchema) => {
    const { confirmPassword, ...restData } = data;
    await UserRegister({
      variables: {
        input: {
          ...restData,
        },
      },
    })
      .then((res) => {
        if (res.data.register.activation_token) {
          localStorage.setItem(
            'activation_token',
            res.data.register.activation_token
          );

          toast.success('Please check your email to activate your account!');
          reset();
          setActiveState('Verification');
        } else {
        }
      })
      .catch((error) => {
        console.log('GraphQL Errors:', error.graphQLErrors[0].message);
        toast.error(`Error  ${error.graphQLErrors[0].message}`);
      });
  };

  return (
    <>
      <div className="text-center text-[28px] mb-4 font-bold">Register</div>
      <form onSubmit={handleSubmit(handleRegister)}>
        <label className={`${styles.label}`}>Register Form </label>
        <input
          {...register('email')}
          type="email"
          placeholder="loginmail@mail.com"
          className={`${styles.input} mt-3 mb-1`}
        />
        {errors.email && (
          <span className="text-red-500 block mt-1">
            {`${errors.email.message}`}
          </span>
        )}

        <input
          {...register('firstName')}
          type="text"
          placeholder="First Name"
          className={`${styles.input} mt-3 mb-1`}
        />
        {errors.firstName && (
          <span className="text-red-500 block mt-1">
            {`${errors.firstName.message}`}
          </span>
        )}

        <input
          {...register('lastName')}
          type="text"
          placeholder="Last Name"
          className={`${styles.input} mt-3 mb-1`}
        />
        {errors.lastName && (
          <span className="text-red-500 block mt-1">
            {`${errors.lastName.message}`}
          </span>
        )}

        <div className="w-full mt-3 relative mb-1">
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
        <div className="w-full mt-3 relative mb-1">
          <input
            {...register('confirmPassword')}
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
        {errors.confirmPassword && (
          <span className="text-red-500">{`${errors.confirmPassword.message}`}</span>
        )}
        <div className="w-full mt-5">
          <span
            className={`${styles.label} text-[#F02C56] block text-right cursor-pointer`}
            onClick={() => setActiveState('Forgot-Password')}
          >
            Forgot your password?
          </span>
          <input
            type="submit"
            value="Register"
            // disabled={isSubmitting}
            disabled={isSubmitting || loading}
            className={[
              'w-full text-[17px] font-semibold text-white py-3  cursor-pointer rounded-sm',
              !watch('email') ||
              !watch('password') ||
              !watch('confirmPassword') ||
              !watch('firstName') ||
              !watch('lastName')
                ? 'bg-gray-200'
                : 'bg-[#F02C56]',
            ].join(' ')}
          />
        </div>
      </form>
    </>
  );
}

export default Register;
