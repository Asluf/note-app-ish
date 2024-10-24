import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import { Message } from "../../models/message";
import { Chat } from "../../models/chat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons/faCheckDouble";

interface ChatMessageProps {
  userId: string;
  sendMessage: (message: Message) => void;
  markAsRead: (chatId: string, receiverId: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ userId, sendMessage, markAsRead }) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState("");
  const [filteredChat, setFilteredChat] = useState<Chat | undefined>(undefined);

  const chatContext = useContext(ChatContext);
  if (!chatContext) {
    throw new Error('Chat must be used within a NoteProvider');
  }
  const { chats, setChats, currentChat, setIsChatPopupVisible } = chatContext;

  useEffect(() => {
    const chat = chats.find((chat: Chat) => chat._id === currentChat?._id);
    setFilteredChat(chat);

    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    // read receipt
    const unreadMessageCount = chat?.messages?.filter(message => message.receiverId.toString() === userId && !message.readReceipt).length;
    if (chat && chat._id && unreadMessageCount && unreadMessageCount > 0) {
      handleReadReceipt(chat._id);
    }
  }, [chats]);

  // scroll bar to the down
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [filteredChat]);

  const handleSendMessage = () => {
    if (content.trim()) {
      const msg: Message = {
        senderId: userId,
        receiverId: filteredChat?.user1._id == userId ? filteredChat?.user2._id : filteredChat?.user1._id ?? '',
        content: content,
        readReceipt: false
      }
      sendMessage(msg);
      setContent('');
      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat._id === filteredChat?._id) {
            return {
              ...chat,
              messages: [...(chat.messages || []), msg],
              timestamp: new Date(),
            };
          }
          return chat;
        });
      });
    }
  };

  const handleReadReceipt = (chatId: string) => {
    markAsRead(chatId, userId);

    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat._id === chatId) {
          return {
            ...chat,
            messages: chat.messages?.map(message => {
              if (message.receiverId === userId && !message.readReceipt) {
                return {
                  ...message,
                  readReceipt: true
                };
              }
              return message;
            })
          };
        }
        return chat;
      });
    });
  };



  return (
    <div className="absolute right-0 top-[60px] h-[600px] w-[300px] bg-brown-200 shadow-lg p-4 z-50 rounded-lg flex flex-col text-brown-900">
      <h2 className="text-lg font-bold mb-2">
        <button onClick={() => setIsChatPopupVisible(false)}><FontAwesomeIcon
          icon={faArrowLeft}
          className="text-[16px] mr-3"
        /></button>
        {filteredChat?.user1._id == userId ? filteredChat?.user2.username : filteredChat?.user1.username}
      </h2>
      <span className="w-[100%] bg-brown-500 h-[1px]"></span>
      <div className="flex-grow overflow-y-scroll mb-4 mt-2 hide-scrollbar" ref={chatContainerRef}>
        {filteredChat?.messages?.map((msg: Message, index: number) => (
          msg.senderId === userId ? (
            <div key={index} className="flex justify-end mb-2 ">
              <span className="relative bg-brown-100 rounded-bl-lg px-2 max-w-[250px] flex-wrap">
                <span className="mr-2">{msg.content}</span>
                <FontAwesomeIcon icon={msg.readReceipt ? faCheckDouble : faCheck} className="absolute bottom-0 right-0 mb-1 mr-1 text-[10px]" />
              </span>
            </div>
          ) : (
            <div key={index} className="flex justify-start mb-2">
              <span className="bg-brown-100 shadow-xl rounded-br-lg px-2 max-w-[250px] flex-wrap"> {msg.content} </span>
            </div>
          )
        )) || null}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-grow px-2 focus:outline-none rounded-l mr-2 bg-brown-100"
          placeholder="Type a message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          className="px-3 py-2 inline-flex items-center justify-center font-semibold rounded-lg border border-transparent bg-brown-900 text-white hover:bg-brown-600r"
          onClick={handleSendMessage}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="text-[12px]"
          />
        </button>
      </div>
    </div>
  );
};

export default ChatMessage;
