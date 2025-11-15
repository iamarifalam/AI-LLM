import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/chat/history`, {
        timeout: 5000
      });
      if (response.data && Array.isArray(response.data.history)) {
        setMessages(response.data.history);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Don't show error to user, just start with empty history
      setMessages([]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/chat/message`, {
        message: messageToSend,
        userId: 'user-' + Date.now()
      }, {
        timeout: 120000 // 120 second timeout
      });

      // Validate response
      if (response.data && response.data.botMessage) {
        setMessages(prev => [...prev, response.data.botMessage]);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.status,
        request: error.request ? 'Request made but no response' : 'No request made',
        config: {
          url: error.config?.url,
          method: error.config?.method
        }
      });
      
      let errorText = 'Sorry, I encountered an error. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        if (error.response.data && error.response.data.botMessage) {
          // Server provided an error message
          setMessages(prev => [...prev, error.response.data.botMessage]);
          setIsLoading(false);
          return;
        }
        errorText = `Error: ${error.response.status} - ${error.response.statusText || 'Server error'}`;
      } else if (error.request) {
        // Request made but no response
        console.error(`Failed to connect to ${API_URL}/api/chat/message`);
        errorText = `Unable to connect to the server at ${API_URL}. Please check if the backend is running on port 5001.`;
      } else {
        // Something else happened
        errorText = error.message || 'An unexpected error occurred.';
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      try {
        await axios.delete(`${API_URL}/api/chat/history`, {
          timeout: 5000
        });
        setMessages([]);
      } catch (error) {
        console.error('Error clearing chat:', error);
        // Clear local state even if API call fails
        setMessages([]);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatMessage = (text) => {
    // Simple markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br />');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={clearChat}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New chat
          </button>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none"
              style={{ transform: sidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
            >
              <path d="M6 4L14 10L6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="sidebar-content">
          <div className="chat-history">
            <div className="history-item active">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 3h12M2 8h12M2 13h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Current Chat</span>
            </div>
          </div>
        </div>
        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-content">
        {/* Header */}
        <div className="chat-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <h1>ChatGPT</h1>
        </div>

        {/* Messages */}
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <div className="welcome-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 32h24M32 20v24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h2>How can I help you today?</h2>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message-wrapper ${message.sender === 'user' ? 'user' : 'assistant'}`}
                >
                  <div className="message-container">
                    <div className="avatar">
                      {message.sender === 'user' ? (
                        <div className="avatar-user">U</div>
                      ) : (
                        <div className="avatar-assistant">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 2L2 7v6l8 5 8-5V7l-8-5z" stroke="currentColor" strokeWidth="1.5" fill="currentColor"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="message-content-wrapper">
                      <div className="message-content">
                        <div 
                          className="message-text"
                          dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
                        />
                        {message.sender === 'assistant' && (
                          <button 
                            className="copy-btn"
                            onClick={() => copyToClipboard(message.text)}
                            title="Copy"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <rect x="6" y="6" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                              <path d="M4 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message-wrapper assistant">
                  <div className="message-container">
                    <div className="avatar">
                      <div className="avatar-assistant">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M10 2L2 7v6l8 5 8-5V7l-8-5z" stroke="currentColor" strokeWidth="1.5" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>
                    <div className="message-content-wrapper">
                      <div className="message-content">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="input-area">
          <form onSubmit={sendMessage} className="input-form">
            <div className="input-wrapper">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message ChatGPT..."
                className="message-input"
                rows="1"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="send-button"
                disabled={!inputMessage.trim() || isLoading}
                title="Send message"
              >
                {isLoading ? (
                  <div className="spinner"></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M18 2L9 11M18 2l-7 7M18 2H2l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
            <div className="input-footer">
              <p>ChatGPT can make mistakes. Check important info.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;

