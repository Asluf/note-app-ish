import { createContext, useState, ReactNode, SetStateAction, Dispatch } from "react";
import Swal from "sweetalert2";
import { Chat } from "../models/chat";
import { ChatService } from "../services/chatService";
import { User } from "../models/user";

interface ChatContextType {
  chats: Chat[];
  setChats: Dispatch<SetStateAction<Chat[]>>;
  users: User[];
  setUsers: Dispatch<SetStateAction<User[]>>;
  fetchChats: (userId: string, token: string) => void;
  fetchUsers: (token: string) => void;
  createChat: (data:any,token: string) => void;
  currentChat: Chat | undefined;
  setCurrentChat: (chat: Chat | undefined) => void;
  isChatPopupVisible: boolean;
  setIsChatPopupVisible: Dispatch<SetStateAction<boolean>>;
  isNewChatVisible: boolean;
  setIsNewChatVisible: Dispatch<SetStateAction<boolean>>;
}
const defaultChatContext: ChatContextType = {
  chats: [],
  setChats: () => { },
  users: [],
  setUsers: () => { },
  fetchChats: () => { },
  fetchUsers: () => { },
  createChat: () => { },
  currentChat: undefined,
  setCurrentChat: () => { },
  isChatPopupVisible: false,
  setIsChatPopupVisible: () => { },
  isNewChatVisible: false,
  setIsNewChatVisible: () => { }
};

const ChatContext = createContext<ChatContextType>(defaultChatContext);

const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | undefined>(undefined);
  const [isChatPopupVisible, setIsChatPopupVisible] = useState<boolean>(false);
  const [isNewChatVisible, setIsNewChatVisible] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);

  const fetchChats = async (userId: string, token: string) => {
    try {
      const response = await ChatService.fetchChats(userId, token);
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

  const fetchUsers = async (token: string) => {
    try {
      const response = await ChatService.fetchUsers(token);
      if (response.success) {
        setUsers(response.users);
      } else {
        throw new Error("Failed to fetch chats");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Failed to fetch users", "error");
    }
  };
  const createChat = async (data: any, token: string) => {
    try {
      const response = await ChatService.createChat(data, token);
      if (response.data.success) {
        setCurrentChat(response.data.chat as Chat);
        setChats(prevChats => [...prevChats, response.data.chat]);
      } else {
        throw new Error("Failed to fetch chats");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Failed to create chat", "error");
    }
  };


  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        users,
        setUsers,
        fetchChats,
        fetchUsers,
        createChat,
        currentChat,
        setCurrentChat,
        isChatPopupVisible,
        setIsChatPopupVisible,
        isNewChatVisible,
        setIsNewChatVisible
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider, ChatContext };
