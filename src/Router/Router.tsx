import { Routes, Route} from "react-router-dom";
import HomePage from "../pages/HomePage";
import AuthPage from "../pages/AuthPage";
const Router = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
     
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </div>
  );
};

export default Router;
