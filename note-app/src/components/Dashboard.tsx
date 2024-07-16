import React, { useContext, useEffect } from 'react';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import Navbar from './NavBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTokenContext } from '../contexts/TokenContext';
import { NoteContext } from '../contexts/NoteContext';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useTokenContext();
  const noteContext = useContext(NoteContext);

  if (!noteContext) {
    throw new Error('NoteForm must be used within a NoteProvider');
  }

  const { fetchProject } = noteContext;
  useEffect(() => {
    console.log({ token: token });
    if (!token || token === '') {
      navigate('/login');
    } else {
      fetchProject(token)
    }
  }, []);
  return (
    <div className="w-[100%] h-[100vh]">
      <Navbar path={location.pathname} />
      <div className="w-[100%] flex justify-center items-center">
        <div className="mt-5 bg-brown-300 bg-opacity-50 w-[450px] h-[100px] rounded-xl px-10 py-5 shadow-xl flex flex-col gap-4 ">
          <NoteForm token={token}/>
        </div>
      </div>
      <div className='w-[100%] flex justify-center items-center'>
        <div className="mt-5   w-[60vw] min-h-[400px] rounded-xl px-10 py-5 shadow-xl flex flex-col gap-4 ">
          <NoteList token={token}/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
