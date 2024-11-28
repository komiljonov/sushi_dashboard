// lib/context/Auth.js
import React, { createContext, useContext, useEffect, useState } from 'react';

import { Loading } from '@/components/Loading';

interface ILoadingProvider {
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setInfo: React.Dispatch<React.SetStateAction<ILoadingInfo>>
}



export const LoadingContext = createContext<ILoadingProvider>({
    loading: false,
    setLoading: () => { },
    setInfo: () => { },
});

export const useLoading = () => useContext(LoadingContext);

interface ILoadingProviderProps {
    children: React.ReactNode;
}

interface ILoadingInfo {
    title: string;
    description: string;
}

export const LoadingProvider = ({ children }: ILoadingProviderProps) => {
    const [loading, setLoading] = useState<boolean>(false);

    const [info, setInfo] = useState<ILoadingInfo>({
        title: "Yuklanmoqda...",
        description: "Yuklanmoqda"
    });



    useEffect(() => {
        if (!loading) {
            setInfo({
                title: "Yuklanmoqda...",
                description: "Iltimos biroz kuting"
            });
        }
    }, [loading]);



    return (
        <LoadingContext.Provider value={{ loading, setLoading, setInfo }} >
            {loading && <Loading {...info} />}
            {children}
        </LoadingContext.Provider>
    );
};