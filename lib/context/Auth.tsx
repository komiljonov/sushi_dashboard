'use client';

// lib/context/Auth.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

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
    authenticate: ((username: string, password: string) => Promise<boolean>);
}


interface IAuthenticateResponse {
    access: string;
    refresh: string;
    defail: string;
}



export const AuthContext = createContext<IAuthProvider>({
    accessToken: null,
    refreshToken: null,
    isAuthenticated: null,
    userInfo: null,

    setAccessToken: () => { },
    setRefreshToken: () => { },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    authenticate: async (username, password) => false
});

export const useAuth = () => useContext(AuthContext);

interface IAuthProviderProps {
    children: React.ReactNode;
}

interface IUserInfo {
    name: string;
    status: string;
}

interface IDecodedToken {
    exp: number;
    [key: string]: string | number;
}

export const AuthProvider = ({ children }: IAuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);

    const isBrowser = typeof window !== 'undefined';


    const [accessToken, setAccessToken] = useState<string | null>(() => {
        return isBrowser ? localStorage.getItem('access_token') : null;
    });
    const [refreshToken, setRefreshToken] = useState<string | null>(() => {
        return isBrowser ? localStorage.getItem('refresh_token') : null;
    });

    useEffect(() => {
        if (accessToken) {
            localStorage.setItem('access_token', accessToken);

            try {
                const decodedToken = jwtDecode<IDecodedToken>(accessToken);
                const isTokenExpired = decodedToken.exp * 1000 < Date.now();

                if (!isTokenExpired) {
                    setIsAuthenticated(true);
                    // Optionally, you can set user info based on the token payload
                    setUserInfo({
                        name: decodedToken.name as string || 'Unknown',
                        status: 'Active' // You can adjust this based on your token's payload
                    });
                } else {
                    setIsAuthenticated(false);
                    setUserInfo(null);
                }
            } catch (error) {
                console.error('Token decoding failed:', error);
                setIsAuthenticated(false);
                setUserInfo(null);
            }
        } else {
            localStorage.removeItem('access_token');
            setIsAuthenticated(false);
            setUserInfo(null);
        }
    }, [accessToken]);

    useEffect(() => {
        if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
        } else {
            localStorage.removeItem('refresh_token');
        }
    }, [refreshToken]);




    const authenticate = async (username: string, password: string) => {

        try {


            const res = await authAxios.post<IAuthenticateResponse>(
                'token',
                {
                    username,
                    password
                }
            );

            if (res.status == 200) {
                setAccessToken(res.data.access);
                setRefreshToken(res.data.refresh);
                return true;
            }

            return false;



        } catch (e) {
            return false;
        }


    }

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, refreshToken, setRefreshToken, isAuthenticated, userInfo, authenticate }}>
            {children}
        </AuthContext.Provider>
    );
};