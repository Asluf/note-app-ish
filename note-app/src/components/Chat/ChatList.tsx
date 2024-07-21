import React, { forwardRef, useContext, useEffect, useState } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import { Chat } from "../../models/chat";
import { Message } from "../../models/message";
import ChatMessage from "./ChatMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import NewChat from "./NewChat";
import { format, isToday, isYesterday } from 'date-fns';

// const socket = io('http://localhost:8080');

interface ChatListProps {
  userId: string;
  token: string | undefined;
  sendMessage: (message: Message) => void;
  markAsRead: (chatId:string, receiverId: string) => void;
}
const ChatList: React.FC<ChatListProps> = ({ userId, token, sendMessage, markAsRead }) => {
  const [sortedChats, setSortedChats] = useState<Chat[]>([]);

  const chatContext = useContext(ChatContext);

  if (!chatContext) {
    throw new Error('Chat must be used within a NoteProvider');
  }

  const { fetchChats, chats, setCurrentChat, isChatPopupVisible, setIsChatPopupVisible, isNewChatVisible, setIsNewChatVisible } = chatContext;

  useEffect(() => {
    if (userId && userId !== '') {
      fetchChats(userId, token ?? '');
    }
  }, []);

  useEffect(() => {
    const sortedChats = chats
      .map(chat => ({
        ...chat,
        timestamp: typeof chat.timestamp === 'string' ? new Date(chat.timestamp) : chat.timestamp
      }))
      .sort((a, b) => {
        const dateA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
        const dateB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
        return dateB.getTime() - dateA.getTime();
      });
    setSortedChats(sortedChats);
  }, [chats]);

  const renderLastMessage = (messages: Message[] | undefined): string => {
    if (messages) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage) return latestMessage.content
      return '';
    }
    return '';
  }
  const handleClickChat = (chat: Chat) => {
    setCurrentChat(chat);
    setIsChatPopupVisible(true);
  }
  const renderUnreadCount = (messages: Message[] | undefined): JSX.Element => {
    if (messages) {
      const unreadMessages = messages.filter(message => message.receiverId.toString() === userId && !message.readReceipt);
      if (unreadMessages.length > 0) {
        return <span className="w-[20px] h-[20px] bg-brown-900 text-white rounded-full flex items-center justify-center text-[10px]">
          {unreadMessages.length > 9 ? '9+' : unreadMessages.length}
        </span>;
      }
      return <span></span>;
    }
    return <span></span>;
  }
  const renderTimeStamp = (timestamp: Date | null) => {
    if (!timestamp) {
      return '';
    }
    const date = new Date(timestamp);

    if (isToday(date)) {
      return format(date, 'hh:mm a'); // Display time if the message is from today
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MM/dd/yyyy'); // Display date for older messages
    }
  };

  return (
    <>
      {isChatPopupVisible &&
        <ChatMessage userId={userId} sendMessage={sendMessage} markAsRead={markAsRead} />
      }
      {isNewChatVisible &&
        <NewChat userId={userId} token={token} />
      }
      {!isChatPopupVisible && !isNewChatVisible &&
        <div className="absolute right-0 top-[60px] text-brown-900 w-[300px] bg-brown-200 shadow-lg p-4 z-50 rounded-lg flex flex-col">
          <div className="flex justify-between">
            <span className="text-xl font-bold mb-1">Chats</span>
            <button className="flex justify-center items-center px-4 py-1 bg-brown-500 rounded h-[26px]"
              title="New chat"
              onClick={() => setIsNewChatVisible(true)}
            >
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-white text-[14px]"
              /></button>
          </div>
          <span className="w-[100%] bg-brown-500 h-[1px]"></span>
          <div className="flex-grow overflow-y-auto mb-4 mt-2 rounded">
            {chats.length > 0 ? (
              sortedChats.map((chat) => (
                <div
                  key={chat._id}
                  className="cursor-pointer py-2 border-b-2 text-sm font-normal flex flex-col"
                  onClick={() => handleClickChat(chat)}
                >
                  <span className="flex justify-between">
                    <span className="text-[13px] font-semibold">
                      {chat.user1._id === userId ? chat.user2.username : chat.user1.username}
                    </span>
                    <span>{renderUnreadCount(chat.messages)}</span>
                  </span>
                  <span className="flex justify-between">
                    <span className="text-[12px]">{renderLastMessage(chat.messages)}</span>
                    <span className="text-[10px]">{renderTimeStamp(chat.timestamp ?? null)}</span>
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col justify-center text-sm">
                <p className="text-center font-normal text-gray-500">No chats available!</p>
                <button onClick={() => setIsNewChatVisible(true)} className="text-blue-500 underline">Start a new conversation</button>
              </div>
            )}
          </div>
        </div>
      }




    </>
  );
};

export default ChatList;
