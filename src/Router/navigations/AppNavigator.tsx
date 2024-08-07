import { Routes, Route } from 'react-router-dom';
import HomePage from '../../pages/HomePage';
import AuthPage from '../../pages/AuthPage';
import ProductPage from '../../pages/ProductPage';
import ProfilePage from '../../pages/ProfilePage';
import MyProfilePage from '../../pages/MyProfilePage';
const AppNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/product/:id" element={<ProductPage />}></Route>
      <Route path="profile" element={<MyProfilePage />}></Route>
      <Route path="profile/:id" element={<ProfilePage />}></Route>
    </Routes>
  );
};

export default AppNavigator;
