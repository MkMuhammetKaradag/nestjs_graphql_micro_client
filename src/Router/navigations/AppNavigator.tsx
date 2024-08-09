import { Routes, Route } from 'react-router-dom';
import HomePage from '../../pages/HomePage';
import AuthPage from '../../pages/AuthPage';
import ProductPage from '../../pages/ProductPage';
import ProfilePage from '../../pages/ProfilePage';
import MyProfilePage from '../../pages/MyProfilePage';
import AdminRoute from '../AdminRoute';
import NotAuthorized from '../../components/app/NotAuthorized';
import ProductCreationPage from '../../pages/ProductCreationPage';

interface AppNavigatorProps {
  userRoles: string[];
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ userRoles }) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/product/:id" element={<ProductPage />}></Route>
      <Route path="profile" element={<MyProfilePage />}></Route>
      <Route path="profile/:id" element={<ProfilePage />}></Route>
      <Route
        path="/create-product"
        element={
          <AdminRoute userRoles={userRoles} element={<ProductCreationPage />} />
        }
      ></Route>

      <Route path="/not-authorized" element={<NotAuthorized />} />
    </Routes>
  );
};

export default AppNavigator;
