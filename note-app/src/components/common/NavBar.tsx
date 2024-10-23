import React from 'react';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { useTokenContext } from '../../contexts/TokenContext';
interface NavbarProps {
  path: string;
  onChatButtonClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ path, onChatButtonClick }) => {
  const navigate = useNavigate();
  const { setToken, setUserId } = useTokenContext();

  const handleLogout = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    });

    if (isConfirmed) {
      try {
        setToken('');
        setUserId('');
        localStorage.clear();
        navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  };

  return (
    <div className="flex w-[100%] px-4  items-center justify-between h-[60px] bg-brown-300">
      <div className="text-2xl text-brown-900 font-bold">QuickNotes</div>
      <div className="flex justify-between gap-2">
        {path === '/' ? (
          <>
            <Link
              to="/login"
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-900 text-white hover:bg-brown-600"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-900 text-white hover:bg-brown-600"
            >
              Signup
            </Link>
          </>
        ) : path === '/login' ? (
          <>
            <Link
              to="/"
              className="py-2 px-5 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-900 text-white hover:bg-brown-600"
            >
              Home
            </Link>
            <Link
              to="/signup"
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-900 text-white hover:bg-brown-600"
            >
              Signup
            </Link>
          </>
        ) : path === '/signup' ? (
          <>
            <Link
              to="/"
              className="py-2 px-5 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-900 text-white hover:bg-brown-600"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-900 text-white hover:bg-brown-600"
            >
              Login
            </Link>
          </>
        ) : path === '/dashboard' ? (
          <>
             <button
              onClick={onChatButtonClick}
              className="py-2 px-5 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-900 text-white hover:bg-brown-600"
            >
              Chat
            </button>
            <button
              onClick={handleLogout}
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-900 text-white hover:bg-brown-600"
            >
              Logout
            </button>
          </>
        ) : null}

      </div>
    </div>
  );
};

export default Navbar;