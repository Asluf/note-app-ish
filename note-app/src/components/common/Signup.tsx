import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import Navbar from './NavBar';
import { useTokenContext } from '../../contexts/TokenContext';
import { ChatContext } from '../../contexts/ChatContext';

const Signup: React.FC = () => {

  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const { token, setToken, setUserId } = useTokenContext();
  const chatContext = useContext(ChatContext);
  if (!chatContext) {
    throw new Error("NoteList must be used within a NoteProvider");
  }
  const { showErrorToast, showSuccessToast } = chatContext;

  useEffect(() => {
    if (token || token !== '') {
      localStorage.clear();
      setToken('');
      setUserId('');
    }
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      showErrorToast('Passwords do not match!')
      return;
    }
    try {
      const response = await AuthService.signup(email, password, userName);
      if (response.data.success) {
        showSuccessToast('You have successfully signed-up');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);

      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Signup failed. Please try again.');
      showErrorToast('Sign-up failed. Please try again.');
    }
  };

  return (
    <div className="w-[100%] h-[100vh]">
      {/* Navbar */}
      <Navbar path={location.pathname} />
      <div className="w-[100%] h-[92vh] flex justify-center items-center">
        <div className="bg-brown-300 bg-opacity-50 w-[450px] h-[400px] rounded-xl px-10 py-5 shadow-xl flex flex-col gap-4 ">
          <h2 className="font-bold text-2xl flex justify-center items-center">Sign-up</h2>
          <form onSubmit={handleSignup}>
            <div className="flex w-[100%] gap-2 mt-4 mb-6 items-center">
              <label htmlFor="email" className="w-[20%]">Email</label>
              <input
                type="email"
                id="email"
                className="w-[80%] py-2 px-3 rounded-lg bg-brown-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex w-[100%] gap-2 mb-6 items-center">
              <label htmlFor="email" className="w-[20%]">Username</label>
              <input
                type="text"
                id="username"
                className="w-[80%] py-2 px-3 rounded-lg bg-brown-100"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="flex w-[100%] gap-2 mb-6 items-center">
              <label htmlFor="password" className="w-[20%]">Password</label>
              <input
                type="password"
                id="password"
                className="w-[80%] py-2 px-3 rounded-lg bg-brown-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex w-[100%] gap-2 mb-6 items-center">
              <label htmlFor="password" className="w-[20%]">Confirm Password</label>
              <input
                type="password"
                id="password"
                className="w-[80%] py-2 px-3 rounded-lg bg-brown-100"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-center items-center mt-5">
              <button type="submit" className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-900 text-white hover:bg-brown-600">
                Register
              </button>
            </div>
            <div className="text-center mt-3">
              {error && <div className="alert alert-danger mt-3">{error}</div>}
              <span>Already have an account? </span>
              <Link to="/login" className="text-blue-500 underline">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
