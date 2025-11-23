import { GlobalPortal, GlobalStyles } from 'tosslib';
import { Routes } from './pages/Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const client = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={client}>
      <GlobalStyles />
      <GlobalPortal.Provider>
        <Routes />
      </GlobalPortal.Provider>
    </QueryClientProvider>
  );
}
