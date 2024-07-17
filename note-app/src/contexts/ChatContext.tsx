import { createContext, useState, ReactNode, SetStateAction, Dispatch } from "react";
import Swal from "sweetalert2";
import { Chat } from "../models/chat";
import { ChatService } from "../services/chatService";

interface ChatContextType {
  chats: Chat[];
  setChats: Dispatch<SetStateAction<Chat[]>>;
  fetchChats: (userId: string) => void;
  currentChat: Chat | undefined;
  setCurrentChat: (chat: Chat | undefined) => void;
  isChatPopupVisible: boolean;
  setIChatPopupVisible: Dispatch<SetStateAction<boolean>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | undefined>(undefined);
  const [isChatPopupVisible, setIChatPopupVisible] = useState<boolean>(false);

  const fetchChats = async (userId: string) => {
    try {
      const response = await ChatService.fetchChats(userId);
      if (response.success) {
        setChats(response.chats);
      } else {
        throw new Error("Failed to fetch chats");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Failed to fetch chats", "error");
    }
  };

  
  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        fetchChats,
        currentChat,
        setCurrentChat,
        isChatPopupVisible,
        setIChatPopupVisible
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider, ChatContext };
