import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/common/Header';
import { JourneyDashboard } from './pages/Journey/JourneyDashboard';
import { HomePage } from './pages/Home/HomePage';
import { BottomNav } from './components/layout/BottomNav';
import { useAppStore } from './stores/useAppStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  const selectedTrainNumber = useAppStore((s) => s.selectedTrainNumber);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
        <Header />
        <main>
          {selectedTrainNumber ? <JourneyDashboard /> : <HomePage />}
        </main>
        <BottomNav />
      </div>
    </QueryClientProvider>
  );
};

export default App;
