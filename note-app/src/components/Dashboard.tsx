import React, { useContext, useEffect, useRef, useState } from 'react';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import Navbar from './NavBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTokenContext } from '../contexts/TokenContext';
import { NoteContext } from '../contexts/NoteContext';
import { io, Socket } from 'socket.io-client';
import { Message } from '../models/message';
import ChatList from './Chat/ChatList';
import { ChatContext } from '../contexts/ChatContext';



const Dashboard: React.FC = () => {
  const socketRef = useRef<Socket | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { token, userId } = useTokenContext();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const noteContext = useContext(NoteContext);

  if (!noteContext) {
    throw new Error('NoteForm must be used within a NoteProvider');
  }

  const { fetchProject } = noteContext;
  const chatContext = useContext(ChatContext);

  if (!chatContext) {
    throw new Error('Chat must be used within a NoteProvider');
  }

  const { setIChatPopupVisible } = chatContext;
  useEffect(() => {
    // console.log({ token: token });
    if (!token || token === '') {
      navigate('/login');
    } else {
      fetchProject(token)
    }
  }, []);
  
  useEffect(() => {
    const socket = io('http://localhost:8080');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server with userId:', userId);
      socket.emit('register', userId);
    });

    socket.on('receive_message', (msg) => {
      console.log('Message received:', msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  const sendMessage = () => {
      const msg: Message = {
        senderId: '66979275f834bd491dfc08c2',
        receiverId: '66979db416dfd8a850f0502e',
        content: 'KKKKKKK'
      }
      if (socketRef.current) {
        socketRef.current.emit('send_message', msg);
      }
      // setMessages((prevMessages) => [...prevMessages, msg]);
      // setMessage('');



      // Send message via HTTP POST to backend endpoint
      // fetch('http://localhost:8080/privateChat', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ recipient, message }),
      // })
      //   .then((response) => response.text())
      //   .then((result) => {
      //     console.log(result); // Log the server response
      //     setMessages((prevMessages) => [...prevMessages, `To ${recipient}: ${message}`]);
      //     setMessage('');
      //   })
      //   .catch((error) => {
      //     console.error('Error:', error);
      //   });
    
  };

  const toggleChatPopup = () => {
    setIsChatOpen((prev) => !prev);
    setIChatPopupVisible(false);
  };


  return (
    <div className="w-[100%] h-[100vh]">
      <Navbar path={location.pathname} onChatButtonClick={toggleChatPopup} />
      {isChatOpen && <ChatList userId={userId ?? ''} />}
      <div className="w-[100%] flex justify-center items-center">
        <div className="mt-5 bg-brown-300 bg-opacity-50 w-[450px] h-[100px] rounded-xl px-10 py-5 shadow-xl flex flex-col gap-4 ">
          <NoteForm token={token} />
        </div>
      </div>
      {/* <button onClick={sendMessage}>send</button> */}
      <div className='w-[100%] flex justify-center items-center'>
        <div className="mt-5 overflow-y-scroll w-[60vw]  min-h-[30vh] max-h-[70vh] rounded-xl px-10 py-5 shadow-xl flex flex-col gap-4 ">
          <NoteList token={token} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
