import { useState } from 'react';
import './App.css';
import AuthModal from './modals/AuthModal';
import { useAppSelector } from './context/hooks';

function App() {
  const [open, setOpen] = useState(true);
  const isAuth = useAppSelector((s) => s.auth.isAuth);


  return (
    <div className="bg-red-500 text-red-000">
      {isAuth && <AuthModal setOpen={setOpen}></AuthModal>}
    </div>
  );
}

export default App;
