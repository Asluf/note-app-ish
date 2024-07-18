import React, { useContext, useEffect, useRef, useState } from 'react';
import NoteForm from './Note/NoteForm';
import NoteList from './Note/NoteList';
import Navbar from './common/NavBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTokenContext } from '../contexts/TokenContext';
import { NoteContext } from '../contexts/NoteContext';
import { io, Socket } from 'socket.io-client';
import { Message } from '../models/message';
import ChatList from './Chat/ChatList';
import { ChatContext } from '../contexts/ChatContext';
import alert from '../assets/alert.wav';

const Dashboard: React.FC = () => {
  const socketRef = useRef<Socket | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { token, userId } = useTokenContext();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const noteContext = useContext(NoteContext);
  const notificationSound = new Audio(alert);


  if (!noteContext) {
    throw new Error('NoteForm must be used within a NoteProvider');
  }

  const { fetchProject } = noteContext;
  const chatContext = useContext(ChatContext);

  if (!chatContext) {
    throw new Error('Chat must be used within a NoteProvider');
  }

  const { setIsChatPopupVisible, setChats, setIsNewChatVisible } = chatContext;
  useEffect(() => {
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

    socket.on('receive_message', (data) => {
      console.log('Message received:', data);
      notificationSound.play();

      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat._id === data.chatId) {
            return {
              ...chat,
              messages: [...(chat.messages || []), data.newMessage],
              timestamp:data.newMessage.timestamp
            };
          }
          return chat;
        });
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (message: Message) => {
    if (socketRef.current) {
      socketRef.current.emit('send_message', message);
    }
  };

  const toggleChatPopup = () => {
    setIsChatOpen((prev) => !prev);
    setIsChatPopupVisible(false);
    setIsNewChatVisible(false);
  };


  return (
    <div className="w-[100%] h-[100vh]">
      <Navbar path={location.pathname} onChatButtonClick={toggleChatPopup} />
      {isChatOpen && <ChatList userId={userId ?? ''} sendMessage={sendMessage} token={token}/>}
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
