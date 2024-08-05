import React, { useState } from 'react';
import { ImCross } from 'react-icons/im';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import ForgotPassword from '../components/auth/ForgotPassword';
import { useAppDispatch } from '../context/hooks';
import { setIsAuth } from '../context/slices/AuthSlice';
import Verification from '../components/auth/Verification';

function AuthModal({ setOpen }: { setOpen: (e: boolean) => void }) {
  const dispatch = useAppDispatch();
  const [activeState, setActiveState] = useState('Login');
  //   const setLoginIsOpen = useGeneralStore((state) => state.setLoginIsOpen);
  //   const isLoginOpen = useGeneralStore((state) => state.isLoginOpen);
  return (
    <div
      id="AuthModal"
      className="fixed flex items-center justify-center z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50"
    >
      <div className="relative bg-white w-full max-w-[470px] h-[70%] p-4 rounded-lg">
        <div className="w-full flex justify-end">
          <button
            onClick={() => dispatch(setIsAuth(false))}
            className="p-1.5 rounded-full bg-gray-100"
          >
            <ImCross color="#000000" size="26" />
          </button>
        </div>
        {activeState === 'Login' && <Login setActiveState={setActiveState} />}
        {activeState === 'Register' && (
          <Register setActiveState={setActiveState} />
        )}
        {activeState === 'Forgot-Password' && (
          <ForgotPassword setActiveState={setActiveState} />
        )}

        {activeState === 'Verification' && (
          <Verification setActiveState={setActiveState} />
        )}

        <div className="absolute flex items-center justify-center py-5 left-0 bottom-0 border-t w-full">
          <span className="text-[14px] text-gray-600">
            Don't have an account?
          </span>
          <button
            onClick={() =>
              activeState === 'Login'
                ? setActiveState('Register')
                : setActiveState('Login')
            }
            className="text-[14px] text-[#d44b69e1] font-semibold pl-1"
          >
            {activeState === 'Login' ? (
              <span>Sign up</span>
            ) : (
              <span>Log in </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
