import React, { useState} from "react";
import io from 'socket.io-client';

// const socket = io('http://localhost:8080');

const ChatPopup: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  
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
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 bg-white mb-2 rounded">
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

export default ChatPopup;
