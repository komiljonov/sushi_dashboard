import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { AuthProvider, useAuth } from '@/lib/context/Auth';
import { LoadingProvider } from '@/lib/context/Loading';
import { Toaster } from "@/components/ui/Toaster";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { queryClient } from '@/lib/query';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import "leaflet/dist/leaflet.css";


// Extend the AppProps type to include the authRequired flag
type MyAppProps = AppProps & {
  Component: AppProps['Component'] & { authRequired?: boolean };
};



function MainApp({ Component, pageProps }: MyAppProps) {
  const { isAuthenticated } = useAuth();
  const { push } = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the page requires authentication
    if (Component.authRequired === false) {
      setLoading(false);
      return;
    }

    // If the authentication status is not yet determined, return
    if (isAuthenticated == null) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      push("/login");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, push, Component]);

  if (loading) {
    return null;
  }

  return <Component {...pageProps} />;
}

function MyApp(props: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        <LoadingProvider>
          <MainApp {...props} />
          <Toaster />
        </LoadingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default MyApp;