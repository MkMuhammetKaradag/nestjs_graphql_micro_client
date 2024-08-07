import { Routes, Route } from 'react-router-dom';
import HomePage from '../../pages/HomePage';
import AuthPage from '../../pages/AuthPage';
import ResetPassword from '../../components/auth/ResetPassword';
const AuthNavigator = () => {
  return (
    <Routes>
      <Route path="/*" element={<AuthPage />} />
    </Routes>
  );
};

export default AuthNavigator;
