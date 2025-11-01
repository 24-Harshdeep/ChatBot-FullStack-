import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User } from 'lucide-react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import Profile from './Profile';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const { getGreeting } = useTheme();
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden gradient-bg">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Chat History & Mode Switcher */}
      {sidebarOpen && (
        <aside className="w-80 fixed lg:relative inset-y-0 left-0 z-30 transition-all duration-300">
          <div className="h-full">
            <Sidebar />
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-16 border-b flex items-center justify-between px-4"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-opacity-20 hover:bg-white transition-all active:scale-95"
              style={{ color: 'var(--color-text)' }}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                Adaptive Chatbot Platform
              </h1>
              {user && (
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {getGreeting()}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-opacity-20 hover:bg-white transition-colors"
            style={{ color: 'var(--color-text)' }}
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <User size={20} />
              </div>
            )}
            <span className="hidden md:block">{user?.name}</span>
          </button>
        </header>

        {/* Chat Window */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow />
        </div>
      </main>

      {/* Profile Modal */}
      {profileOpen && (
        <Profile onClose={() => setProfileOpen(false)} />
      )}
    </div>
  );
};

export default MainLayout;
