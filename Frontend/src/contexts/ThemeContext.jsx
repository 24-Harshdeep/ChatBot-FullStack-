import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentMode, setCurrentMode] = useState('developer');
  const [modes, setModes] = useState([]);
  const [currentTheme, setCurrentTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load modes from backend
  useEffect(() => {
    loadModes();
  }, []);

  // Update current mode and theme based on user preferences
  useEffect(() => {
    if (user && modes.length > 0) {
      const userMode = user.preferences?.defaultMode || 'developer';
      setCurrentMode(userMode);
      
      const mode = modes.find(m => m.name === userMode);
      if (mode) {
        const themeName = user.preferences?.themes?.[userMode] || mode.themes[0].name;
        const theme = mode.themes.find(t => t.name === themeName);
        if (theme) {
          setCurrentTheme(theme);
          applyTheme(theme);
        }
      }
    }
  }, [user, modes]);

  const loadModes = async () => {
    try {
      const response = await axios.get(`${API_URL}/modes`);
      setModes(response.data);
    } catch (error) {
      console.error('Failed to load modes:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = (theme) => {
    if (!theme) return;

    const root = document.documentElement;
    const { colors } = theme;

    // Apply CSS variables
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-user-bubble', colors.userBubble);
    root.style.setProperty('--color-ai-bubble', colors.aiBubble);
    root.style.setProperty('--color-border', colors.border);

    // Apply gradient
    if (colors.backgroundGradient && colors.backgroundGradient.length >= 3) {
      root.style.setProperty('--bg-start', colors.backgroundGradient[0]);
      root.style.setProperty('--bg-middle', colors.backgroundGradient[1]);
      root.style.setProperty('--bg-end', colors.backgroundGradient[2]);
    }
  };

  const switchMode = (modeName) => {
    const mode = modes.find(m => m.name === modeName);
    if (!mode) return;

    setCurrentMode(modeName);
    
    // Get user's preferred theme for this mode
    const themeName = user?.preferences?.themes?.[modeName] || mode.themes[0].name;
    const theme = mode.themes.find(t => t.name === themeName);
    
    if (theme) {
      setCurrentTheme(theme);
      applyTheme(theme);
    }
  };

  const switchTheme = (themeName) => {
    const mode = modes.find(m => m.name === currentMode);
    if (!mode) return;

    const theme = mode.themes.find(t => t.name === themeName);
    if (theme) {
      setCurrentTheme(theme);
      applyTheme(theme);
    }
  };

  const getCurrentMode = () => {
    return modes.find(m => m.name === currentMode);
  };

  const getGreeting = () => {
    const mode = getCurrentMode();
    if (!mode || !user) return 'Welcome!';
    
    return mode.greeting.replace('{name}', user.name);
  };

  const value = {
    currentMode,
    currentTheme,
    modes,
    loading,
    switchMode,
    switchTheme,
    getCurrentMode,
    getGreeting,
    applyTheme
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
