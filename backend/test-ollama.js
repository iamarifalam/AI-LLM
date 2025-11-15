// Simple test script to verify Ollama connection
require('dotenv').config();
const axios = require('axios');

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || '';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2';

console.log('Testing Ollama Connection...\n');
console.log('Configuration:');
console.log(`  URL: ${OLLAMA_API_URL}`);
console.log(`  Model: ${OLLAMA_MODEL}`);
console.log(`  API Key: ${OLLAMA_API_KEY ? 'Set' : 'Not set'}\n`);

const testMessage = {
  model: OLLAMA_MODEL,
  messages: [
    {
      role: 'user',
      content: 'Hello! Just say "Hi" back.'
    }
  ],
  stream: false
};

const headers = {
  'Content-Type': 'application/json'
};

if (OLLAMA_API_KEY && OLLAMA_API_KEY.trim()) {
  headers['Authorization'] = `Bearer ${OLLAMA_API_KEY.trim()}`;
}

axios.post(`${OLLAMA_API_URL}/api/chat`, testMessage, { headers })
  .then(response => {
    console.log('✅ Success! Ollama is working.\n');
    console.log('Response:', response.data);
    if (response.data.message && response.data.message.content) {
      console.log('\nBot response:', response.data.message.content);
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error connecting to Ollama:\n');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is Ollama running?');
      console.error('Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  });

