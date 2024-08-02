import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AuthPage from '../pages/AuthPage';
import { Toaster } from 'react-hot-toast';
const Router = () => {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </div>
  );
};

export default Router;
