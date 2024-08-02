import { useState } from 'react';
import './App.css';
import AuthModal from './modals/AuthModal';
import { useAppSelector } from './context/hooks';

function App() {
  const [open, setOpen] = useState(true);
  const isAuthLoading = useAppSelector((s) => s.auth.isAuthLoading);
  console.log('app.tsx dosyası', isAuthLoading);

  return (
    <div className="bg-red-500 text-red-000">
      {isAuthLoading && <AuthModal setOpen={setOpen}></AuthModal>}
    </div>
  );
}

export default App;
