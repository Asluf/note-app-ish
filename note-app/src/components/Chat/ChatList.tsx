import React, { useContext, useEffect } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import { Chat } from "../../models/chat";
import { Message } from "../../models/message";
import ChatMessage from "./ChatMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faEnvelope } from "@fortawesome/free-solid-svg-icons";

// const socket = io('http://localhost:8080');

interface ChatListProps {
  userId: string;
  sendMessage: (message: Message) => void;
}
const ChatList: React.FC<ChatListProps> = ({ userId, sendMessage }) => {

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
        <ChatMessage userId={userId} sendMessage={sendMessage} />
      ) : (
        <div className="absolute right-0 top-[60px] text-brown-900 w-[300px] bg-brown-200 shadow-lg p-4 z-50 rounded-lg flex flex-col">
          <div className="flex justify-between">
            <span className="text-xl font-bold mb-4">Chats</span>
            <button className="flex justify-center items-center px-4 py-1 bg-brown-500 rounded h-[26px]"
              title="New chat">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-white text-[14px]"
              /></button>
          </div>
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
