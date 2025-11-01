import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatProvider } from './contexts/ChatContext';
import AuthPage from './components/AuthPage';
import MainLayout from './components/MainLayout';
import './index.css';

function AppContent() {
  const { user, loading } = useAuth();

  // Apply animations preference to body
  useEffect(() => {
    if (user?.preferences?.animationsEnabled === false) {
      document.body.classList.add('no-animations');
    } else {
      document.body.classList.remove('no-animations');
    }
  }, [user?.preferences?.animationsEnabled]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%)' }}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <ThemeProvider>
      <ChatProvider>
        <MainLayout />
      </ChatProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
