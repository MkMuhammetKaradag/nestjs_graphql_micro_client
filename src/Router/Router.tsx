import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AuthPage from '../pages/AuthPage';
import { Toaster } from 'react-hot-toast';
import TopNav from '../components/app/TopNav';
import { useAppSelector } from '../context/hooks';
import AppNavigator from './navigations/AppNavigator';
import AuthNavigator from './navigations/AuthNavigator';
const Router = () => {
  const isAuth = useAppSelector((s) => s.auth.isAuth);
  const user = useAppSelector((s) => s.auth.user);
  return (
    <div className="flex relative items-center h-screen flex-col">
      <header>
        <TopNav />
      </header>

      <div className="flex py-[80px]  container    justify-center ">
        {!isAuth && user ? (
          <AppNavigator></AppNavigator>
        ) : (
          <AuthNavigator></AuthNavigator>
        )}
      </div>
      <footer className="flex fixed bottom-0 left-0 w-full bg-gray-100 text-black p-4">
        <div>sdsdasdasdlnasjdh</div>
      </footer>
    </div>
  );
};

export default Router;
