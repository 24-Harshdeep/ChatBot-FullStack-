import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ChatContext = createContext(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // Load chats when user logs in
  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  const loadChats = async (filters = {}) => {
    if (!user) return; // Don't load if not authenticated
    
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_URL}/chats?${params}`);
      setChats(response.data);
    } catch (error) {
      // Only log if it's not a 401 error
      if (error.response?.status !== 401) {
        console.error('Failed to load chats:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const response = await axios.get(`${API_URL}/chats/${chatId}`);
      setCurrentChat(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to load chat:', error);
      return null;
    }
  };

  const createChat = async (mode, message, file = null) => {
    try {
      setSending(true);
      
      const formData = new FormData();
      formData.append('mode', mode);
      formData.append('message', message);
      if (file) {
        formData.append('file', file);
      }
      
      const response = await axios.post(`${API_URL}/chats`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const newChat = response.data;
      setChats(prev => [newChat, ...prev]);
      setCurrentChat(newChat);
      
      // Reload chats to ensure we have the full list
      await loadChats();
      
      return { success: true, chat: newChat };
    } catch (error) {
      console.error('Failed to create chat:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create chat'
      };
    } finally {
      setSending(false);
    }
  };

  const sendMessage = async (chatId, message, file = null) => {
    try {
      setSending(true);
      
      const formData = new FormData();
      formData.append('message', message);
      if (file) {
        formData.append('file', file);
      }
      
      const response = await axios.post(`${API_URL}/chats/${chatId}/message`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update current chat with new messages
      if (currentChat && currentChat._id === chatId) {
        setCurrentChat(prev => ({
          ...prev,
          messages: [...prev.messages, ...response.data.messages]
        }));
      }
      
      // Reload chats to update the chat list with latest info
      await loadChats();
      
      return { success: true, messages: response.data.messages };
    } catch (error) {
      console.error('Failed to send message:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send message'
      };
    } finally {
      setSending(false);
    }
  };

  const updateChat = async (chatId, updates) => {
    try {
      const response = await axios.put(`${API_URL}/chats/${chatId}`, updates);
      
      // Update in chats list
      setChats(prev => prev.map(chat => 
        chat._id === chatId ? { ...chat, ...updates } : chat
      ));
      
      // Update current chat if it's the one being updated
      if (currentChat && currentChat._id === chatId) {
        setCurrentChat(prev => ({ ...prev, ...updates }));
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to update chat:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update chat'
      };
    }
  };

  const deleteChat = async (chatId) => {
    try {
      await axios.delete(`${API_URL}/chats/${chatId}`);
      
      setChats(prev => prev.filter(chat => chat._id !== chatId));
      
      if (currentChat && currentChat._id === chatId) {
        setCurrentChat(null);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to delete chat:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete chat'
      };
    }
  };

  const pinChat = async (chatId, isPinned) => {
    return updateChat(chatId, { isPinned });
  };

  const renameChat = async (chatId, title) => {
    return updateChat(chatId, { title });
  };

  const deleteAllChats = async () => {
    try {
      // Delete all chats one by one
      await Promise.all(chats.map(chat => deleteChat(chat._id)));
      setChats([]);
      setCurrentChat(null);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete all chats:', error);
      return {
        success: false,
        message: 'Failed to delete all chats'
      };
    }
  };

  const value = {
    chats,
    currentChat,
    loading,
    sending,
    loadChats,
    loadChat,
    createChat,
    sendMessage,
    updateChat,
    deleteChat,
    pinChat,
    renameChat,
    deleteAllChats,
    setCurrentChat
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
