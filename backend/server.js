const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS configuration - allow requests from React dev server
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for chat history (in production, use a database)
const chatHistory = [];

// Ollama configuration
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || '';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2';
const USE_OLLAMA = process.env.USE_OLLAMA === 'true' || !!OLLAMA_API_KEY;

// Model parameters (customizable via environment variables)
const TEMPERATURE = parseFloat(process.env.OLLAMA_TEMPERATURE) || 0.7;
const TOP_P = parseFloat(process.env.OLLAMA_TOP_P) || 0.9;
const TOP_K = parseInt(process.env.OLLAMA_TOP_K) || 40;
const NUM_PREDICT = parseInt(process.env.OLLAMA_NUM_PREDICT) || 2048;
const REPEAT_PENALTY = parseFloat(process.env.OLLAMA_REPEAT_PENALTY) || 1.1;

// System prompt to improve response quality
const SYSTEM_PROMPT = `You are a helpful, knowledgeable, and friendly AI assistant. Your goal is to provide detailed, accurate, and comprehensive answers to user questions.

Guidelines for your responses:
- Be specific and detailed rather than vague
- Provide examples when helpful
- Break down complex topics into clear explanations
- If you don't know something, admit it rather than guessing
- Use a conversational but professional tone
- Structure longer responses with clear points or steps
- Be thorough but concise - aim for quality over brevity

Always strive to give the most helpful and complete answer possible.`;

// Get bot response using Ollama API
const getBotResponse = async (userMessage, conversationHistory = []) => {
  // If Ollama is not configured, use fallback responses
  if (!USE_OLLAMA) {
    return getFallbackResponse(userMessage);
  }

  try {
    // Prepare messages for Ollama chat API
    // Start with system prompt for better response quality
    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      }
    ];

    // Add conversation history (last 20 messages for better context)
    if (conversationHistory.length > 0) {
      const historyMessages = conversationHistory
        .slice(-20) // Increased from 10 to 20 for better context
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));
      messages.push(...historyMessages);
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage
    });

    // Prepare request to Ollama with improved parameters
    const requestConfig = {
      method: 'POST',
      url: `${OLLAMA_API_URL}/api/chat`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        model: OLLAMA_MODEL,
        messages: messages,
        stream: false,
        // Parameters to improve response quality
        options: {
          temperature: TEMPERATURE, // Lower = more focused, Higher = more creative (0.7 is balanced)
          top_p: TOP_P, // Nucleus sampling - controls diversity
          top_k: TOP_K, // Limits vocabulary to top K tokens
          num_predict: NUM_PREDICT, // Maximum tokens to generate (allows longer, detailed responses)
          repeat_penalty: REPEAT_PENALTY // Reduces repetition
        }
      },
      timeout: 120000 // 120 second timeout for longer responses
    };

    // Add API key if provided (for Ollama Cloud or authenticated endpoints)
    if (OLLAMA_API_KEY && OLLAMA_API_KEY.trim()) {
      requestConfig.headers['Authorization'] = `Bearer ${OLLAMA_API_KEY.trim()}`;
    }

    const response = await axios(requestConfig);
    
    // Extract response text - handle different response formats
    if (response.data) {
      // Standard chat API response format
      if (response.data.message && response.data.message.content) {
        return response.data.message.content.trim();
      }
      // Alternative response format
      if (response.data.response) {
        return response.data.response.trim();
      }
      // Direct content field
      if (response.data.content) {
        return response.data.content.trim();
      }
    }
    
    console.error('Unexpected Ollama response format:', JSON.stringify(response.data));
    throw new Error('Unexpected response format from Ollama');
    
  } catch (error) {
    // Log detailed error information
    if (error.response) {
      // The request was made and the server responded with a status code outside 2xx
      console.error('Ollama API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
      
      // Handle specific error codes
      if (error.response.status === 401) {
        console.error('Authentication failed. Check your API key.');
        return 'I apologize, but there was an authentication error. Please check the API configuration.';
      }
      if (error.response.status === 404) {
        console.error('Model not found. Check if the model name is correct.');
        return 'I apologize, but the AI model is not available. Please check the model configuration.';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Ollama API Request Error:', error.message);
      console.error('No response received. Is Ollama running?');
      
      if (error.code === 'ECONNREFUSED') {
        console.log('Ollama connection refused. Using fallback responses.');
        return getFallbackResponse(userMessage);
      }
    } else {
      // Something else happened
      console.error('Ollama API Error:', error.message);
    }
    
    // Return fallback response for any error
    return getFallbackResponse(userMessage);
  }
};

// Fallback response when Ollama is not available
const getFallbackResponse = (userMessage) => {
  const message = userMessage.toLowerCase().trim();
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! How can I help you today?";
  }
  
  if (message.includes('how are you')) {
    return "I'm doing great, thank you for asking! How can I assist you?";
  }
  
  if (message.includes('bye') || message.includes('goodbye')) {
    return "Goodbye! Have a great day!";
  }
  
  if (message.includes('help')) {
    return "I'm here to help! You can ask me questions, and I'll do my best to assist you.";
  }
  
  if (message.includes('time')) {
    return `The current time is ${new Date().toLocaleTimeString()}`;
  }
  
  if (message.includes('date')) {
    return `Today's date is ${new Date().toLocaleDateString()}`;
  }
  
  return "That's interesting! Can you tell me more about that?";
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Chatbot API is running!' });
});

// Get chat history
app.get('/api/chat/history', (req, res) => {
  res.json({ history: chatHistory });
});

// Send message
app.post('/api/chat/message', async (req, res) => {
  const { message, userId } = req.body;
  
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  const userMessage = {
    id: Date.now(),
    text: message,
    sender: 'user',
    timestamp: new Date().toISOString(),
    userId: userId || 'anonymous'
  };
  
  try {
    // Get conversation history for context
    const conversationHistory = chatHistory.filter(msg => 
      msg.userId === (userId || 'anonymous')
    );
    
    // Get bot response from Ollama (with error handling built-in)
    const botResponse = await getBotResponse(message, conversationHistory);
    
    // Ensure we have a valid response
    if (!botResponse || typeof botResponse !== 'string') {
      throw new Error('Invalid response from AI service');
    }
    
    const botMessage = {
      id: Date.now() + 1,
      text: botResponse,
      sender: 'bot',
      timestamp: new Date().toISOString()
    };
    
    // Store messages
    chatHistory.push(userMessage, botMessage);
    
    // Keep only last 100 messages
    if (chatHistory.length > 100) {
      chatHistory.shift();
    }
    
    res.json({
      userMessage,
      botMessage
    });
  } catch (error) {
    console.error('Error processing message:', error);
    
    // Create error message for user
    const errorMessage = {
      id: Date.now() + 1,
      text: 'I apologize, but I encountered an error processing your message. Please try again.',
      sender: 'bot',
      timestamp: new Date().toISOString()
    };
    
    // Still store user message
    chatHistory.push(userMessage);
    
    res.status(500).json({ 
      error: 'Failed to process message',
      message: error.message,
      userMessage,
      botMessage: errorMessage
    });
  }
});

// Clear chat history
app.delete('/api/chat/history', (req, res) => {
  chatHistory.length = 0;
  res.json({ message: 'Chat history cleared' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    port: PORT,
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// Error handling for server startup
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit, let the server continue
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit, let the server continue
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
  console.log(`Ollama Configuration:`);
  console.log(`  - Using Ollama: ${USE_OLLAMA ? 'Yes' : 'No'}`);
  if (USE_OLLAMA) {
    console.log(`  - Ollama URL: ${OLLAMA_API_URL}`);
    console.log(`  - Model: ${OLLAMA_MODEL}`);
    console.log(`  - API Key: ${OLLAMA_API_KEY && OLLAMA_API_KEY.trim() ? 'Set' : 'Not set (using local)'}`);
    console.log(`  - Temperature: ${TEMPERATURE} (lower = focused, higher = creative)`);
    console.log(`  - Max Tokens: ${NUM_PREDICT} (longer responses)`);
    console.log(`  - Repeat Penalty: ${REPEAT_PENALTY} (reduces repetition)`);
    console.log(`  - System Prompt: Enabled (improves response quality)`);
  }
}).on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use!`);
    console.error(`Please either:`);
    console.error(`  1. Stop the process using port ${PORT}`);
    console.error(`  2. Change the PORT in your .env file`);
    console.error(`  3. Kill the process: lsof -ti:${PORT} | xargs kill -9\n`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});

