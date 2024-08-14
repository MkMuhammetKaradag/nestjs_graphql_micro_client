import { useEffect, useState } from 'react';
import './App.css';
import AuthModal from './modals/AuthModal';
import { useAppSelector } from './context/hooks';
import toast from 'react-hot-toast';

function App() {
  const [open, setOpen] = useState(true);
  const isAuth = useAppSelector((s) => s.auth.isAuth);
  // const kapama = async () => {
  //   toast.success(' kullanıcı çıkış yapmış bulunmakta');
  // };

  // useEffect(() => {
  //   const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
  //     event.preventDefault();
  //     // Tarayıcıdan çıkış yapıldığını GraphQL API'ye bildirin
  //     await kapama();
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [kapama]);

  return (
    <div className="bg-red-500 text-red-000">
      {isAuth && <AuthModal setOpen={setOpen}></AuthModal>}
    </div>
  );
}

export default App;
