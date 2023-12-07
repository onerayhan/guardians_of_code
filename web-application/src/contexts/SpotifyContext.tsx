import React, { createContext, useState, useContext, ReactNode } from 'react';

type SpotifyContextType = {
    accessToken: string | null;
    isAuthenticated: boolean; // New state to track authentication status
    updateAccessToken: (newToken: string) => void;
    setAuthenticationStatus: (status: boolean) => void; // New function to update the authentication status
};

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export const useSpotify = () => {
    const context = useContext(SpotifyContext);
    if (!context) {
        throw new Error('useSpotify must be used within a SpotifyProvider');
    }
    return context;
};

export const SpotifyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // New state

    const updateAccessToken = (newToken: string) => {
        setAccessToken(newToken);
        setIsAuthenticated(true); // Set authentication status to true when token is updated
    };

    const setAuthenticationStatus = (status: boolean) => {
        setIsAuthenticated(status);
    };

    return (
        <SpotifyContext.Provider value={{ accessToken, isAuthenticated, updateAccessToken, setAuthenticationStatus }}>
            {children}
        </SpotifyContext.Provider>
    );
};