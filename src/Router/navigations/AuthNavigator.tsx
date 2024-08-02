import { Routes, Route } from 'react-router-dom';
import HomePage from '../../pages/HomePage';
import AuthPage from '../../pages/AuthPage';
const AuthNavigator = () => {
  return (
    <Routes>
      <Route path="/*" element={<AuthPage />} />
    </Routes>
  );
};

export default AuthNavigator;
