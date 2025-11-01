import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { X, User, Settings, Link as LinkIcon, Camera, Save } from 'lucide-react';
import { format } from 'date-fns';

const Profile = ({ onClose }) => {
  const { user, updateProfile, updatePreferences, logout } = useAuth();
  const { modes, currentMode, switchTheme, applyTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [previewTheme, setPreviewTheme] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = async () => {
    const result = await updateProfile(formData);
    if (result.success) {
      alert('Profile updated successfully!');
    } else {
      alert(result.message);
    }
  };

  const handleThemeChange = async (modeName, themeName) => {
    const result = await updatePreferences({
      themes: {
        ...user.preferences.themes,
        [modeName]: themeName
      }
    });

    if (result.success) {
      // Apply theme immediately if it's for the current mode
      if (modeName === currentMode) {
        switchTheme(themeName);
      }
    }
  };

  const handleThemeClick = (mode, theme) => {
    // Apply theme change on click
    handleThemeChange(mode.name, theme.name);
  };

  const handleThemeHover = (theme) => {
    // Preview theme on hover
    applyTheme(theme);
    setPreviewTheme(theme);
  };

  const handleThemeLeave = () => {
    // Restore original theme when mouse leaves
    if (previewTheme) {
      applyTheme(null);
      setPreviewTheme(null);
    }
  };

  const handlePreferenceToggle = async (key, value) => {
    await updatePreferences({ [key]: value });
  };

  const handleDefaultModeChange = async (modeName) => {
    await updatePreferences({ defaultMode: modeName });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        {/* Header */}
        <div 
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Profile Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-opacity-20 hover:bg-white transition-colors"
            style={{ color: 'var(--color-text)' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div 
          className="flex border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          {[
            { id: 'general', label: 'General Info', icon: User },
            { id: 'preferences', label: 'Preferences', icon: Settings },
            { id: 'integrations', label: 'Integrations', icon: LinkIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all"
              style={{
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent'
              }}
            >
              <tab.icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'general' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-24 h-24 rounded-full"
                    />
                  ) : (
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      <User size={40} style={{ color: '#fff' }} />
                    </div>
                  )}
                  <button
                    className="absolute bottom-0 right-0 p-2 rounded-full shadow-lg"
                    style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
                  >
                    <Camera size={16} />
                  </button>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Click to upload a new profile picture
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: 'var(--color-ai-bubble)',
                      color: 'var(--color-text)',
                      border: '1px solid var(--color-border)'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: 'var(--color-ai-bubble)',
                      color: 'var(--color-text)',
                      border: '1px solid var(--color-border)'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                    Account Created
                  </label>
                  <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--color-ai-bubble)', color: 'var(--color-text-secondary)' }}>
                    {format(new Date(user?.createdAt), 'MMMM d, yyyy')}
                  </div>
                </div>

                <button
                  onClick={handleProfileUpdate}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                  style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Default Mode */}
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                  Default Mode
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {modes.map((mode) => (
                    <button
                      key={mode.name}
                      onClick={() => handleDefaultModeChange(mode.name)}
                      className="p-4 rounded-lg border-2 transition-all hover:scale-105"
                      style={{
                        borderColor: user?.preferences?.defaultMode === mode.name ? 'var(--color-primary)' : 'var(--color-border)',
                        backgroundColor: user?.preferences?.defaultMode === mode.name ? 'var(--color-primary)' : 'var(--color-ai-bubble)',
                        color: user?.preferences?.defaultMode === mode.name ? '#fff' : 'var(--color-text)'
                      }}
                    >
                      <div className="text-3xl mb-2">{mode.icon}</div>
                      <div className="font-medium">{mode.displayName}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Customization */}
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                  Theme Customization
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  Click a theme to apply it. Hover to preview.
                </p>
                {modes.map((mode) => (
                  <div key={mode.name} className="mb-6">
                    <h4 className="text-md font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                      <span className="text-xl">{mode.icon}</span>
                      {mode.displayName}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {mode.themes.map((theme) => {
                        const isSelected = user?.preferences?.themes?.[mode.name] === theme.name;
                        return (
                          <button
                            key={theme.name}
                            onClick={() => handleThemeClick(mode, theme)}
                            onMouseEnter={() => handleThemeHover(theme)}
                            onMouseLeave={handleThemeLeave}
                            className="p-3 rounded-lg border-2 transition-all hover:scale-105 relative"
                            style={{
                              borderColor: isSelected ? theme.colors.primary : 'var(--color-border)',
                              backgroundColor: 'var(--color-ai-bubble)',
                              boxShadow: isSelected ? `0 0 12px ${theme.colors.primary}40` : 'none'
                            }}
                          >
                            {isSelected && (
                              <div 
                                className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                                style={{ backgroundColor: theme.colors.primary }}
                              >
                                ✓
                              </div>
                            )}
                            <div className="flex gap-1 mb-2">
                              <div className="w-6 h-6 rounded shadow-sm" style={{ backgroundColor: theme.colors.primary }}></div>
                              <div className="w-6 h-6 rounded shadow-sm" style={{ backgroundColor: theme.colors.secondary }}></div>
                              <div className="w-6 h-6 rounded shadow-sm" style={{ backgroundColor: theme.colors.accent }}></div>
                            </div>
                            <div className="text-xs font-medium text-left" style={{ color: 'var(--color-text)' }}>
                              {theme.displayName}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--color-ai-bubble)' }}>
                  <div>
                    <div className="font-medium" style={{ color: 'var(--color-text)' }}>Animations</div>
                    <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Enable chat animations and effects</div>
                  </div>
                  <label className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      checked={user?.preferences?.animationsEnabled}
                      onChange={(e) => handlePreferenceToggle('animationsEnabled', e.target.checked)}
                      className="opacity-0 w-0 h-0"
                    />
                    <span
                      className="absolute cursor-pointer inset-0 rounded-full transition-all"
                      style={{
                        backgroundColor: user?.preferences?.animationsEnabled ? 'var(--color-primary)' : 'var(--color-border)'
                      }}
                    >
                      <span
                        className="absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-all"
                        style={{
                          transform: user?.preferences?.animationsEnabled ? 'translateX(24px)' : 'translateX(0)'
                        }}
                      ></span>
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--color-ai-bubble)' }}>
                  <div>
                    <div className="font-medium" style={{ color: 'var(--color-text)' }}>XP Visibility</div>
                    <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Show experience points in Learning mode</div>
                  </div>
                  <label className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      checked={user?.preferences?.xpVisible}
                      onChange={(e) => handlePreferenceToggle('xpVisible', e.target.checked)}
                      className="opacity-0 w-0 h-0"
                    />
                    <span
                      className="absolute cursor-pointer inset-0 rounded-full transition-all"
                      style={{
                        backgroundColor: user?.preferences?.xpVisible ? 'var(--color-primary)' : 'var(--color-border)'
                      }}
                    >
                      <span
                        className="absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-all"
                        style={{
                          transform: user?.preferences?.xpVisible ? 'translateX(24px)' : 'translateX(0)'
                        }}
                      ></span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-center" style={{ color: 'var(--color-text-secondary)' }}>
                Connect your favorite services to enhance your experience
              </p>

              <div className="space-y-3">
                {/* GitHub Integration */}
                <div className="p-4 rounded-lg border flex items-center justify-between" style={{ backgroundColor: 'var(--color-ai-bubble)', borderColor: 'var(--color-border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🐙</div>
                    <div>
                      <div className="font-medium" style={{ color: 'var(--color-text)' }}>GitHub</div>
                      <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {user?.integrations?.github?.connected ? `Connected as ${user.integrations.github.username}` : 'Not connected'}
                      </div>
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 rounded-lg font-medium"
                    style={{
                      backgroundColor: user?.integrations?.github?.connected ? 'var(--color-border)' : 'var(--color-primary)',
                      color: '#fff'
                    }}
                  >
                    {user?.integrations?.github?.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>

                {/* Slack Integration */}
                <div className="p-4 rounded-lg border flex items-center justify-between" style={{ backgroundColor: 'var(--color-ai-bubble)', borderColor: 'var(--color-border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💬</div>
                    <div>
                      <div className="font-medium" style={{ color: 'var(--color-text)' }}>Slack</div>
                      <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {user?.integrations?.slack?.connected ? 'Connected' : 'Not connected'}
                      </div>
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 rounded-lg font-medium"
                    style={{
                      backgroundColor: user?.integrations?.slack?.connected ? 'var(--color-border)' : 'var(--color-primary)',
                      color: '#fff'
                    }}
                  >
                    {user?.integrations?.slack?.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="px-6 py-4 border-t flex justify-between"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <button
            onClick={logout}
            className="px-6 py-2 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: 'var(--color-border)',
              color: 'var(--color-text)'
            }}
          >
            Logout
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-medium transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#fff'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
