import { useState, useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Send, Loader, Paperclip, X } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatWindow = () => {
  const { currentChat, sending, createChat, sendMessage, setCurrentChat } = useChat();
  const { currentMode, getCurrentMode } = useTheme();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Listen for new chat event
  useEffect(() => {
    const handleNewChat = () => {
      setCurrentChat(null);
      inputRef.current?.focus();
    };

    window.addEventListener('newChat', handleNewChat);
    return () => window.removeEventListener('newChat', handleNewChat);
  }, [setCurrentChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  // Show typing indicator when sending
  useEffect(() => {
    setIsTyping(sending);
  }, [sending]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    const userMessage = message;
    const file = selectedFile;
    setMessage('');
    setSelectedFile(null);

    if (!currentChat) {
      // Create new chat
      await createChat(currentMode, userMessage, file);
    } else {
      // Send message to existing chat
      await sendMessage(currentChat._id, userMessage, file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === 'user';
    const isLastAI = !isUser && index === currentChat.messages.length - 1;

    return (
      <div
        key={index}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 message-enter`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div
          className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
            isLastAI && user?.preferences?.animationsEnabled ? 'neural-pulse' : ''
          }`}
          style={{
            backgroundColor: isUser ? 'var(--color-user-bubble)' : 'var(--color-ai-bubble)',
            color: 'var(--color-text)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Show file attachment badge if present */}
          {msg.attachments && msg.attachments.length > 0 && (
            <div 
              className="mb-2 p-2 rounded-lg flex items-center gap-2 text-sm"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderLeft: '3px solid var(--color-primary)'
              }}
            >
              <Paperclip size={14} style={{ color: 'var(--color-primary)' }} />
              <span style={{ color: 'var(--color-text)' }}>
                {msg.attachments[0].filename}
              </span>
            </div>
          )}
          
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
          <div 
            className="text-xs mt-2 opacity-60"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {format(new Date(msg.timestamp), 'h:mm a')}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {!currentChat ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="text-6xl mb-4">
              {getCurrentMode()?.icon || '💬'}
            </div>
            <h2 
              className="text-2xl font-bold"
              style={{ color: 'var(--color-text)' }}
            >
              {getCurrentMode()?.displayName}
            </h2>
            <p 
              className="text-lg max-w-md"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {getCurrentMode()?.description}
            </p>
            <div 
              className="text-sm opacity-70 mt-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Start a conversation by typing a message below
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {currentChat.messages.map((msg, index) => renderMessage(msg, index))}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div
                  className="rounded-2xl px-4 py-3 flex items-center gap-2"
                  style={{
                    backgroundColor: 'var(--color-ai-bubble)',
                    color: 'var(--color-text)'
                  }}
                >
                  <div className="loading-dots flex gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }}></span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }}></span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }}></span>
                  </div>
                  <span className="text-sm opacity-70">AI is thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div 
        className="border-t p-4"
        style={{ 
          backgroundColor: 'var(--color-ai-bubble)',
          borderColor: 'var(--color-border)'
        }}
      >
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* File attachment preview */}
          {selectedFile && (
            <div 
              className="mb-3 p-3 rounded-lg"
              style={{
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)'
              }}
            >
              {filePreview ? (
                // Image preview
                <div className="space-y-2">
                  <div className="relative inline-block">
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="max-h-40 rounded-lg"
                      style={{ maxWidth: '300px' }}
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute -top-2 -right-2 p-1 rounded-full"
                      style={{ 
                        backgroundColor: 'var(--color-primary)',
                        color: '#fff'
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Paperclip size={14} style={{ color: 'var(--color-primary)' }} />
                    <span className="text-xs" style={{ color: 'var(--color-text)' }}>
                      {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                </div>
              ) : (
                // Text file preview
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Paperclip size={16} style={{ color: 'var(--color-primary)' }} />
                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                      {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 rounded hover:bg-opacity-10"
                    style={{ color: 'var(--color-text)' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".txt,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.h,.css,.html,.json,.md,.pdf,.doc,.docx,.csv,.jpg,.jpeg,.png,.gif,.webp,.bmp,image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={sending}
              className="px-4 py-3 rounded-xl transition-all hover:scale-105 disabled:opacity-50"
              style={{
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)'
              }}
              title="Attach file"
            >
              <Paperclip size={20} />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message ${getCurrentMode()?.displayName}...`}
              disabled={sending}
              className="flex-1 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                '--tw-ring-color': 'var(--color-primary)'
              }}
            />
            <button
              type="submit"
              disabled={!message.trim() || sending}
              className="px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#fff'
              }}
            >
              {sending ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
