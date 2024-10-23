import { createContext, useState, ReactNode, SetStateAction, Dispatch } from "react";
import { Chat } from "../models/chat";
import { ChatService } from "../services/chatService";
import { User } from "../models/user";
import { Bounce, toast, ToastContainer } from "react-toastify";

interface ChatContextType {
  chats: Chat[];
  setChats: Dispatch<SetStateAction<Chat[]>>;
  users: User[];
  setUsers: Dispatch<SetStateAction<User[]>>;
  fetchChats: (userId: string, token: string) => void;
  fetchUsers: (token: string) => void;
  createChat: (data: any, token: string) => void;
  currentChat: Chat | undefined;
  setCurrentChat: (chat: Chat | undefined) => void;
  isChatPopupVisible: boolean;
  setIsChatPopupVisible: Dispatch<SetStateAction<boolean>>;
  isNewChatVisible: boolean;
  setIsNewChatVisible: Dispatch<SetStateAction<boolean>>;
  showSuccessToast: (body: string) => void;
  showErrorToast: (body: string) => void;
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
  setIsNewChatVisible: () => { },
  showSuccessToast: () => { },
  showErrorToast: () => { }
};

const ChatContext = createContext<ChatContextType>(defaultChatContext);

const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | undefined>(undefined);
  const [isChatPopupVisible, setIsChatPopupVisible] = useState<boolean>(false);
  const [isNewChatVisible, setIsNewChatVisible] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);

  const showSuccessToast = (body: string) => {
    toast.success(body, {
      position: "bottom-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };
  const showErrorToast = (body: string) => {
    toast.error(body, {
      position: "bottom-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

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
      showErrorToast('Failed to fetch chats!');
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
      showErrorToast('Failed to fetch users!');
    }
  };
  const createChat = async (data: any, token: string) => {
    try {
      const response = await ChatService.createChat(data, token);
      if (response.data.success) {
        setCurrentChat(response.data.chat as Chat);
        setChats(prevChats => [...prevChats, response.data.chat]);
        setIsNewChatVisible(false);
        setIsChatPopupVisible(true);
      } else {
        throw new Error("Failed to fetch chats");
      }
    } catch (error) {
      console.log(error);
      showErrorToast('Failed to create chat!');
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
        setIsNewChatVisible,
        showSuccessToast,
        showErrorToast
      }}
    >
      {children}
      <ToastContainer />
    </ChatContext.Provider>
  );
};

export { ChatProvider, ChatContext };
