import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect } from 'react'
import { ChatContext } from '../../contexts/ChatContext';
import { User } from '../../models/user';
import { Chat } from '../../models/chat';
interface NewChatProps {
    userId: string;
    token: string | undefined;
}
const NewChat: React.FC<NewChatProps> = ({ userId, token }) => {
    const chatContext = useContext(ChatContext);
    if (!chatContext) {
        throw new Error('Chat must be used within a NoteProvider');
    }
    const { setIsNewChatVisible, fetchUsers, users, setIsChatPopupVisible, createChat, chats, setCurrentChat } = chatContext;

    useEffect(() => {
        if (userId && userId !== '') {
            fetchUsers(token ?? '');
        }
    }, []);

    const handleClickChat = (user: User) => {
        const chatAlreadyExist = chats.find((chat: Chat) => chat.user1._id == user._id || chat.user2._id == user._id);
        if (chatAlreadyExist) {
            setCurrentChat(chatAlreadyExist);
        } else {
            const data = {
                user1: userId,
                user2: user._id
            }
            createChat(data, token ?? '')
        }

        setIsNewChatVisible(false);
        setIsChatPopupVisible(true);
    }
    return (
        <div className="absolute right-0 top-[60px] h-[600px] w-[300px] bg-brown-200 shadow-lg p-4 z-50 rounded-lg flex flex-col text-brown-900">
            <h2 className="text-lg font-bold mb-2">
                <button onClick={() => setIsNewChatVisible(false)}><FontAwesomeIcon
                    icon={faArrowLeft}
                    className="text-[16px] mr-3"
                /></button>
                New Chat
            </h2>
            <span className="w-[100%] bg-brown-500 h-[1px]"></span>
            <div className="flex-grow overflow-y-auto mb-4 mt-2 rounded">
                {users.length > 0 ? (
                    users.filter(user => user._id !== userId).map((user) => (
                        <div
                            key={user._id}
                            className="cursor-pointer py-2 border-b-2 text-sm font-semibold flex flex-col px-1"
                            onClick={() => handleClickChat(user)}
                        >
                            {user.username}

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
    )
}

export default NewChat