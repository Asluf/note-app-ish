import React, { useContext, useState } from "react";
import io from 'socket.io-client';
import { ChatContext } from "../../contexts/ChatContext";

interface ChatMessageProps {
  userId: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ userId }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const chatContext = useContext(ChatContext);

  if (!chatContext) {
    throw new Error('Chat must be used within a NoteProvider');
  }

  const { currentChat } = chatContext;

  const handleSendMessage = () => {
    if (message.trim()) {
      const msg = {
        // senderId: username,
        // recipientId: recipient,
        // timestamp: Date.now,
        // content: message,
        readStatus: false
      }
      // socket.emit('send_message', msg);
      setMessages([...messages, message]);
      setMessage("");
    }
  };

  return (
    <div className="absolute right-0 top-[60px] h-[600px] w-[300px] bg-brown-200 shadow-lg p-4 z-50 rounded-lg flex flex-col">
      <h2 className="text-lg font-bold mb-2">{currentChat?.user1._id == userId ? currentChat?.user2.username : currentChat?.user1.username}</h2>
      <span className="w-[100%] bg-brown-500 h-[1px]"></span>
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div className="p-2 bg-white mb-2 rounded">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-grow p-2 border rounded-l mr-2 bg-brown-100"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="w-[30%] py-2 px-2 inline-flex items-center justify-center text-sm font-semibold rounded-lg border border-transparent bg-brown-900 text-white hover:bg-brown-600r"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatMessage;
