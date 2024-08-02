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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8characters long!'),
});
type LoginSchema = z.infer<typeof formSchema>;

function Login({
  setActiveState,
  setOpen,
}: {
  setActiveState: (e: string) => void;
  setOpen: (e: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    watch,
  } = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
  });
  const [show, setShow] = useState(false);
  const [Login, { loading, error }] = useMutation(LOGIN_USER);
  // if (error) {
  //   // const graphQLErrors = error.graphQLErrors
  //   //   .map((err) => err.message)
  //   //   .join(', ');
  //   const networkError = error.networkError
  //     ? error.networkError.message
  //     : 'No network error';

  //   console.log('GraphQL Errors:', error.graphQLErrors[0].message);
  //   console.log('Network Error:', networkError);
  // }
  const handleLogin = async (data: LoginSchema) => {
    const loginData = {
      email: data.email,
      password: data.password,
    };

    const response = await Login({
      variables: loginData,
    })
      .then((res) => {
        if (res.data.login.token) {
          toast.success("login")
          Cookies.set('mk_session', res.data.login.token);
          reset(); //
          window.location.reload(); //
        } else {
          
        }
      })
      .catch((error) => {
        console.log('GraphQL Errors:', error.graphQLErrors[0].message);
        toast.error(`hata  ${error.graphQLErrors[0].message}` );
      });
  };

  return (
    <>
      <div className="text-center text-[28px] mb-4 font-bold">Login</div>
      <form onSubmit={handleSubmit(handleLogin)}>
        <label className={`${styles.label}`}>Enter your Email</label>
        <input
          {...register('email')}
          type="email"
          placeholder="loginmail@mail.com"
          className={`${styles.input}`}
        />
        {errors.email && (
          <span className="text-red-500 block mt-1">
            {`${errors.email.message}`}
          </span>
        )}
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
        <div className="w-full mt-5">
          <span
            className={`${styles.label} text-[#F02C56] block text-right cursor-pointer`}
            onClick={() => setActiveState('Forgot-Password')}
          >
            Forgot your password?
          </span>
          <input
            type="submit"
            value="Login"
            // disabled={isSubmitting}
            disabled={isSubmitting || loading}
            className={[
              'w-full text-[17px] font-semibold text-white py-3  cursor-pointer rounded-sm',
              !watch('email') || !watch('password')
                ? 'bg-gray-200'
                : 'bg-[#F02C56]',
            ].join(' ')}
          />
        </div>
      </form>
    </>
  );
}

export default Login;
