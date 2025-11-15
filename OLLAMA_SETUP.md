# Ollama Setup Guide

## Quick Start

1. **Create your `.env` file in the backend folder:**
   ```bash
   cd backend
   cp env.example .env
   ```

2. **Open `backend/.env` and add your Ollama API key:**
   ```env
   USE_OLLAMA=true
   OLLAMA_API_KEY=your_ollama_api_key_here
   OLLAMA_MODEL=llama2
   OLLAMA_API_URL=http://localhost:11434
   ```

3. **Replace `your_ollama_api_key_here` with your actual API key**

4. **Save the file and restart your backend server**

That's it! Your chatbot will now use Ollama for AI responses.

## Configuration Options

### For Ollama Cloud (with API key)
```env
USE_OLLAMA=true
OLLAMA_API_KEY=your_actual_api_key
OLLAMA_API_URL=https://api.ollama.ai  # Your cloud endpoint
OLLAMA_MODEL=llama2
```

### For Local Ollama (no API key needed)
```env
USE_OLLAMA=true
OLLAMA_API_KEY=  # Leave empty for local
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

Make sure Ollama is running locally:
```bash
ollama serve
```

And the model is downloaded:
```bash
ollama pull llama2
```

## Available Models

You can change `OLLAMA_MODEL` to any model you have available:
- `llama2`
- `llama3`
- `mistral`
- `codellama`
- `phi`
- `neural-chat`
- And many more!

## Testing

After setting up, start your server:
```bash
npm run dev
```

The server console will show:
```
Ollama Configuration:
  - Using Ollama: Yes
  - Ollama URL: http://localhost:11434
  - Model: llama2
  - API Key: Set (or Not set for local)
```

If you see errors, check:
1. Your API key is correct
2. Ollama is running (for local)
3. The model name is correct
4. The API URL is accessible

