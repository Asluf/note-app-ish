import React, { createContext, useContext, useState } from 'react';

type TokenContextType = {
    token: string | undefined;
    setToken: (token: string) => void;
    userId: string | undefined;
    setUserId: (token: string) => void;
};

export const TokenContext = createContext<TokenContextType>({} as TokenContextType);

export const useTokenContext = () => {
    const context = useContext(TokenContext);
    if (!context) {
        throw new Error('useTokenContext must be used within a TokenProvider');
    }
    return context;
};

type TokenProviderProps = {
    children: React.ReactNode;
};

export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | undefined>(localStorage.getItem('token') ?? undefined);
    const [userId, setUserId] = useState<string | undefined>(localStorage.getItem('userId') ?? undefined);

    const contextValue: TokenContextType = {
        token,
        setToken,
        userId,
        setUserId
    };

    return <TokenContext.Provider value={contextValue}>{children}</TokenContext.Provider>;
};
