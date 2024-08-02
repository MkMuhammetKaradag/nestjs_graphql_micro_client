import { Routes, Route } from 'react-router-dom';
import HomePage from '../../pages/HomePage';
import AuthPage from '../../pages/AuthPage';
const AppNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
};

export default AppNavigator;
