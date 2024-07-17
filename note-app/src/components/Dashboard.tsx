import React, { useContext, useEffect, useState } from 'react';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import Navbar from './NavBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTokenContext } from '../contexts/TokenContext';
import { NoteContext } from '../contexts/NoteContext';
import ChatPopup from './ChatPopup';
import { io } from 'socket.io-client';



const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, userId } = useTokenContext();
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
  
  useEffect(() => {
    const socket = io('http://localhost:8080');
    console.log({ userId });

    socket.on('connect', () => {
      console.log('Connected to server with userId:', userId);
      // socket.emit('register', userId);
    });

    socket.on('receive_message', (msg) => {
      console.log('Message received:', msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // const sendMessage = () => {
  //   if (recipient.trim() && message.trim()) {
  //     const msg = {
  //       senderId: username,
  //       recipientId: recipient,
  //       timestamp: Date.now,
  //       content: message,
  //       readStatus: false
  //     }
  //     socket.emit('send_message', msg);
  //     setMessages((prevMessages) => [...prevMessages, msg]);
  //     setMessage('');



  //     // Send message via HTTP POST to backend endpoint
  //     // fetch('http://localhost:8080/privateChat', {
  //     //   method: 'POST',
  //     //   headers: {
  //     //     'Content-Type': 'application/json',
  //     //   },
  //     //   body: JSON.stringify({ recipient, message }),
  //     // })
  //     //   .then((response) => response.text())
  //     //   .then((result) => {
  //     //     console.log(result); // Log the server response
  //     //     setMessages((prevMessages) => [...prevMessages, `To ${recipient}: ${message}`]);
  //     //     setMessage('');
  //     //   })
  //     //   .catch((error) => {
  //     //     console.error('Error:', error);
  //     //   });
  //   }
  // };

  const toggleChatPopup = () => {
    setIsChatOpen((prev) => !prev);
  };


  return (
    <div className="w-[100%] h-[100vh]">
      <Navbar path={location.pathname} onChatButtonClick={toggleChatPopup} />
      {isChatOpen && <ChatPopup />}
      <div className="w-[100%] flex justify-center items-center">
        <div className="mt-5 bg-brown-300 bg-opacity-50 w-[450px] h-[100px] rounded-xl px-10 py-5 shadow-xl flex flex-col gap-4 ">
          <NoteForm token={token} />
        </div>
      </div>
      <div className='w-[100%] flex justify-center items-center'>
        <div className="mt-5 overflow-y-scroll w-[60vw]  min-h-[30vh] max-h-[70vh] rounded-xl px-10 py-5 shadow-xl flex flex-col gap-4 ">
          <NoteList token={token} />
        </div>
        {isChatOpen && <ChatPopup />}
      </div>
    </div>
  );
};

export default Dashboard;
