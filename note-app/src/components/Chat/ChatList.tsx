import React, { useContext, useEffect, useState } from "react";
import io from 'socket.io-client';
import { ChatContext } from "../../contexts/ChatContext";
import { Chat } from "../../models/chat";
import { Message } from "../../models/message";
import ChatMessage from "./ChatMessage";

// const socket = io('http://localhost:8080');

interface ChatListProps {
  userId: string;
}
const ChatList: React.FC<ChatListProps> = ({ userId }) => {
  
  const chatContext = useContext(ChatContext);

  if (!chatContext) {
    throw new Error('Chat must be used within a NoteProvider');
  }

  const { fetchChats, chats, setCurrentChat, isChatPopupVisible, setIChatPopupVisible } = chatContext;

  useEffect(() => {
    if (userId && userId !== '') {
      fetchChats(userId);
    }
  }, []);

  const renderLastMessage = (messages: Message[] | undefined): string => {
    if (messages) {
      const latestMessage = messages[messages.length - 1];
      return latestMessage.content;
    }
    return '';
  }
  const handleClickChat = (chat: Chat) => {
    setCurrentChat(chat);
    setIChatPopupVisible(true);
  }

  return (
    <>
      {isChatPopupVisible ? (
        <ChatMessage userId={userId}/>
      ): (
      <div className="absolute right-0 top-[60px]  w-[300px] bg-brown-200 shadow-lg p-4 z-50 rounded-lg flex flex-col">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        <div className="flex-grow overflow-y-auto mb-4 rounded">
          {chats.map((chat: Chat) => (
            <div key={chat._id} className="cursor-pointer py-2 border-b-2 text-sm font-normal flex flex-col" onClick={() => handleClickChat(chat)}>
              <span className="text-[13px] font-semibold">{chat.user1._id == userId ? chat.user2.username : chat.user1.username}</span>
              <span className="flex justify-between">
                <span className="text-[12px]">{renderLastMessage(chat.messages)}</span>
                <span className="text-[10px]">Jun 3</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    )}

    </>
  );
};

export default ChatList;
