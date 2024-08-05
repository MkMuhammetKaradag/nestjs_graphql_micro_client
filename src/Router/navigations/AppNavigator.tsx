import { Routes, Route } from 'react-router-dom';
import HomePage from '../../pages/HomePage';
import AuthPage from '../../pages/AuthPage';
import ProductPage from '../../pages/ProductPage';
const AppNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/auth" element={<AuthPage />} />
      <Route path="/product/:id" element={<ProductPage />}></Route>
    </Routes>
  );
};

export default AppNavigator;
