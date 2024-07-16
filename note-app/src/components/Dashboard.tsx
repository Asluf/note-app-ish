import React, { useContext, useEffect ,useState} from 'react';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import Navbar from './NavBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTokenContext } from '../contexts/TokenContext';
import { NoteContext } from '../contexts/NoteContext';
import ChatPopup from './ChatPopup';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useTokenContext();
  const [isChatOpen, setIsChatOpen] = useState(false);
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
  const toggleChatPopup = () => {
    setIsChatOpen((prev) => !prev);
  };
  return (
    <div className="w-[100%] h-[100vh]">
      <Navbar path={location.pathname} onChatButtonClick={toggleChatPopup} />
      {isChatOpen && <ChatPopup />}
      <div className="w-[100%] flex justify-center items-center">
        <div className="mt-5 bg-brown-300 bg-opacity-50 w-[450px] h-[100px] rounded-xl px-10 py-5 shadow-xl flex flex-col gap-4 ">
          <NoteForm token={token}/>
        </div>
      </div>
      <div className='w-[100%] flex justify-center items-center'>
        <div className="mt-5 overflow-y-scroll w-[60vw]  min-h-[30vh] max-h-[70vh] rounded-xl px-10 py-5 shadow-xl flex flex-col gap-4 ">
          <NoteList token={token}/>
        </div>
        {isChatOpen && <ChatPopup />}
      </div>
    </div>
  );
};

export default Dashboard;
