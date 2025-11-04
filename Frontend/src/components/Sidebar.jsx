import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useChat } from '../contexts/ChatContext';
import { Plus, MessageSquare, Pin, Calendar, Search, Filter, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const Sidebar = () => {
  const { currentMode, modes, switchMode } = useTheme();
  const { chats, currentChat, loadChat, loadChats, deleteChat, deleteAllChats } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState(null);

  const handleModeSwitch = (modeName) => {
    switchMode(modeName);
    // Open a new chat when switching modes
    window.dispatchEvent(new CustomEvent('newChat'));
  };

  const handleChatClick = (chatId) => {
    loadChat(chatId);
  };

  const handleNewChat = () => {
    // This will be handled in ChatWindow
    window.dispatchEvent(new CustomEvent('newChat'));
  };

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    const filters = {};
    if (q && q.trim() !== '') filters.keyword = q.trim();
    if (filterMode !== 'all') filters.mode = filterMode;
    loadChats(filters);
  };

  const handleFilterChange = (mode) => {
    setFilterMode(mode);
    const filters = {};
    if (searchQuery && searchQuery.trim() !== '') filters.keyword = searchQuery.trim();
    if (mode !== 'all') filters.mode = mode;
    loadChats(filters);
  };

  const getModeIcon = (modeName) => {
    const mode = modes.find(m => m.name === modeName);
    return mode?.icon || '💬';
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    setDeletingChatId(chatId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deletingChatId) {
      await deleteChat(deletingChatId);
      setShowDeleteConfirm(false);
      setDeletingChatId(null);
    }
  };

  const handleDeleteAllHistory = async () => {
    if (window.confirm('⚠️ Delete ALL chat history?\n\nThis will permanently delete all your conversations and cannot be undone.\n\nAre you sure?')) {
      await deleteAllChats();
    }
  };

  return (
    <div 
      className="h-full flex flex-col"
      style={{ 
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Mode Switcher */}
      <div className="p-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
        <h2 
          className="text-sm font-semibold mb-3 uppercase tracking-wide"
          style={{ color: 'rgba(255, 255, 255, 0.9)' }}
        >
          Select Mode
        </h2>
        <div className="space-y-2">
          {modes.map((mode) => (
            <button
              key={mode.name}
              onClick={() => handleModeSwitch(mode.name)}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg transition-all hover-lift
                ${currentMode === mode.name ? 'scale-105' : 'hover:bg-opacity-10 hover:bg-white'}
              `}
              style={{
                background: currentMode === mode.name 
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))' 
                  : 'transparent',
                border: currentMode === mode.name 
                  ? '1px solid rgba(255, 255, 255, 0.3)' 
                  : '1px solid transparent',
                color: 'var(--color-text)',
                boxShadow: currentMode === mode.name ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'
              }}
            >
              <span className="text-2xl">{mode.icon}</span>
              <div className="flex-1 text-left">
                <div className="font-medium">{mode.displayName}</div>
                <div className="text-xs opacity-70">{mode.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-all btn-primary"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
        >
          <Plus size={20} />
          New Chat
        </button>
      </div>

      {/* Search & Filter */}
      <div className="p-4 border-b space-y-3" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
        <div className="relative">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-3 py-2 rounded-lg transition-all focus:outline-none focus:ring-2"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'var(--color-text)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['all', 'developer', 'learner', 'hr'].map((mode) => (
            <button
              key={mode}
              onClick={() => handleFilterChange(mode)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover-lift"
              style={{
                background: filterMode === mode 
                  ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: filterMode === mode ? '#fff' : 'rgba(255, 255, 255, 0.9)',
                border: filterMode === mode ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: filterMode === mode ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none'
              }}
            >
              {mode === 'all' ? 'All' : getModeIcon(mode)}
            </button>
          ))}
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="flex items-center justify-between mb-3">
          <h2 
            className="text-sm font-semibold uppercase tracking-wide"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Chat History ({chats.length})
          </h2>
          {chats.length > 0 && (
            <button
              onClick={handleDeleteAllHistory}
              className="p-1 rounded hover:bg-opacity-10 hover:bg-white transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
              title="Delete all history"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        
        {chats.length === 0 ? (
          <div 
            className="text-center py-8 text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            No chats yet. Start a new conversation!
          </div>
        ) : (
          <>
            {/* Show ALL chats in a simple list */}
            {chats.map((chat) => (
              <div
                key={chat._id}
                className="relative group chat-item"
              >
                <button
                  onClick={() => handleChatClick(chat._id)}
                  className="w-full text-left p-3 rounded-lg transition-all hover-lift"
                  style={{
                    backgroundColor: currentChat?._id === chat._id 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'transparent',
                    border: currentChat?._id === chat._id 
                      ? '1px solid rgba(255, 255, 255, 0.2)' 
                      : '1px solid transparent'
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-base">{getModeIcon(chat.mode)}</span>
                      <h3 
                        className="font-medium truncate text-sm"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {chat.title}
                      </h3>
                    </div>
                    {chat.isPinned && (
                      <Pin size={14} style={{ color: 'var(--color-accent)' }} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    <Calendar size={12} />
                    {format(new Date(chat.updatedAt), 'MMM d, yyyy')}
                  </div>
                </button>
                
                {/* Delete button - shows on hover */}
                <button
                  onClick={(e) => handleDeleteChat(chat._id, e)}
                  className="delete-btn absolute right-2 top-2 p-1.5 rounded-md transition-all"
                  style={{ 
                    backgroundColor: 'rgba(248, 113, 113, 0.2)',
                    backdropFilter: 'blur(4px)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.9)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(248, 113, 113, 0.2)'}
                  title="Delete chat"
                >
                  <Trash2 size={14} style={{ color: '#fee2e2' }} />
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in" onClick={() => setShowDeleteConfirm(false)}>
          <div 
            className="p-6 rounded-xl shadow-2xl max-w-sm mx-4 glass"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-2" style={{ color: '#1a202c' }}>
              Delete Chat?
            </h3>
            <p className="mb-4" style={{ color: '#4a5568' }}>
              This action cannot be undone. Are you sure you want to delete this chat?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-all hover-lift"
                style={{
                  backgroundColor: '#e2e8f0',
                  color: '#2d3748'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-all btn-danger"
                style={{
                  background: 'linear-gradient(135deg, #f56565, #e53e3e)',
                  color: '#fff'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
