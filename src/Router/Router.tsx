import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AuthPage from '../pages/AuthPage';
import { Toaster } from 'react-hot-toast';
import TopNav from '../components/app/TopNav';
import { useAppSelector } from '../context/hooks';
import AppNavigator from './navigations/AppNavigator';
import AuthNavigator from './navigations/AuthNavigator';
import useOnlineStatus from '../hooks/useOnlineStatus';
import { useMutation } from '@apollo/client';
import { SET_USER_ONLINE_STATUS } from '../graphql/mutations/SetUserOnlineStatus';
import { useEffect } from 'react';
const Router = () => {
  const isAuth = useAppSelector((s) => s.auth.isAuth);
  const user = useAppSelector((s) => s.auth.user);
  const [setUserOnlineStatus] = useMutation(SET_USER_ONLINE_STATUS);

  useEffect(() => {
    const handleOnline = () => {
      setUserOnlineStatus({ variables: { input: { isOnline: true } } });
    };

    const handleOffline = () => {
      setUserOnlineStatus({ variables: { input: { isOnline: false } } });
    };

    // Kullanıcı online olduğunda çalışır
    window.addEventListener('load', handleOnline);

    // Kullanıcı sayfadan çıktığında çalışır
    window.addEventListener('beforeunload', handleOffline);

    // Temizleme işlemi
    return () => {
      window.removeEventListener('load', handleOnline);
      window.removeEventListener('beforeunload', handleOffline);
    };
  }, [setUserOnlineStatus, user?.id]);
  return (
    <div className="flex flex-col min-h-screen items-center ">
      <header>
        <TopNav />
      </header>

      <div className="flex-grow   flex py-[80px] container justify-center ">
        {!isAuth && user ? (
          <AppNavigator userRoles={user.roles}></AppNavigator>
        ) : (
          <AuthNavigator></AuthNavigator>
        )}
      </div>
      <footer className="mt-auto flex bottom-0 left-0 w-full bg-gray-100 text-black p-4">
        <div>sdsdasdasdlnasjdh</div>
      </footer>
    </div>
  );
};

export default Router;
