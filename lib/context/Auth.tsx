'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { request } from '@/lib/api';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authAxios = axios.create({
    baseURL: `${apiUrl}/auth/`,
});

interface IAuthProvider {
    accessToken?: string | null;
    refreshToken?: string | null;
    isAuthenticated?: boolean | null;
    userInfo?: IUserInfo | null;

    setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
    setRefreshToken: React.Dispatch<React.SetStateAction<string | null>>;
    authenticate: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

interface IAuthenticateResponse {
    access: string;
    refresh: string;
}

interface IUserInfo {
    name: string;
    status: string;
}

interface IDecodedToken {
    exp: number;
    [key: string]: string | number;
}

const getUserdata = async (): Promise<IUserInfo> => {
    const { data } = await request.get('auth/me');
    return data;
};

export const AuthContext = createContext<IAuthProvider>({
    accessToken: null,
    refreshToken: null,
    isAuthenticated: null,
    userInfo: null,
    setAccessToken: () => { },
    setRefreshToken: () => { },
    authenticate: async () => false,
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

interface IAuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: IAuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(() => {
        return typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    });
    const [refreshToken, setRefreshToken] = useState<string | null>(() => {
        return typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
    });

    const me_mutation = useMutation({
        mutationFn: getUserdata,
        onSuccess: (data) => {
            setUserInfo(data);
            setIsAuthenticated(true);
        },
        onError: (error) => {
            console.log(error);
            setUserInfo(null);
            setIsAuthenticated(false);
        }
    });

    const fetchUserData = useCallback(() => {
        me_mutation.mutate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refreshAccessToken = useCallback(async () => {
        if (refreshToken) {
            try {
                const { data } = await authAxios.post<IAuthenticateResponse>('token/refresh', { refresh: refreshToken });
                setAccessToken(data.access);
                setRefreshToken(data.refresh);
                return true;
            } catch (error) {
                console.error('Refresh token failed:', error);
                handleLogout();
            }
        } else {
            handleLogout();
        }
        return false;
    }, [refreshToken]);

    const handleTokenExpiration = useCallback(() => {
        if (!accessToken) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const decodedToken = jwtDecode<IDecodedToken>(accessToken);
            const isTokenExpired = decodedToken.exp * 1000 < Date.now();

            if (!isTokenExpired) {
                localStorage.setItem('access_token', accessToken);

                // setIsAuthenticated(true);

                fetchUserData();

            } else {
                refreshAccessToken();
            }
        } catch (error) {
            console.error('Token decoding failed:', error);
            handleLogout();
        }
    }, [accessToken, refreshAccessToken, fetchUserData]);

    useEffect(() => {
        handleTokenExpiration();
    }, [handleTokenExpiration]);

    useEffect(() => {
        if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
        } else {
            localStorage.removeItem('refresh_token');
        }
    }, [refreshToken]);

    const authenticate = async (username: string, password: string) => {
        try {
            const { data } = await authAxios.post<IAuthenticateResponse>('token', { username, password });
            setAccessToken(data.access);
            setRefreshToken(data.refresh);
            return true;
        } catch (error) {
            console.error('Authentication failed:', error);
            return false;
        }
    };

    const logout = () => handleLogout();

    const handleLogout = () => {
        localStorage.clear();
        setAccessToken(null);
        setRefreshToken(null);
        setIsAuthenticated(false);
        setUserInfo(null);
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                setAccessToken,
                refreshToken,
                setRefreshToken,
                isAuthenticated,
                userInfo,
                authenticate,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};