# 🤖 Full-Stack AI Chatbot Application

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-Integrated-FF6B6B?logo=ollama)
![License](https://img.shields.io/badge/License-MIT-green)

A modern, production-ready full-stack chatbot application with a beautiful ChatGPT-like interface, powered by Ollama AI.

[Live Demo](#) • [Documentation](#installation) • [Report Bug](https://github.com/iamarifalam/AI-LLM/issues) • [Request Feature](https://github.com/iamarifalam/AI-LLM/issues)

</div>

## ✨ Features

- 🎨 **Beautiful ChatGPT-like UI** - Modern, responsive design with dark/light mode toggle
- 💬 **Real-time Chat Interface** - Smooth, instant messaging experience
- 🤖 **Ollama AI Integration** - Powered by state-of-the-art LLM models (llama3.1, mistral, etc.)
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- 🔄 **Chat History Management** - Persistent conversation history with clear functionality
- ⚡ **Fast & Lightweight** - Optimized for performance
- 🎯 **Highly Customizable** - Easy to extend with additional AI providers
- 🔒 **Secure** - Environment-based configuration, API keys never exposed

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Axios** - HTTP client for API calls
- **CSS3** - Custom animations and responsive design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Ollama** - Local/Cloud LLM integration
- **CORS** - Cross-origin resource sharing

## 📸 Screenshots

*Add screenshots of your application here*

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Ollama (optional, for local AI)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamarifalam/AI-LLM.git
   cd AI-LLM
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env and add your Ollama API key (optional for local Ollama)
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5001`
   - Frontend app on `http://localhost:3000`

## 📖 Usage

### Basic Usage

1. Start the application using `npm run dev`
2. Open `http://localhost:3000` in your browser
3. Start chatting with the AI assistant!

### Ollama Setup

The application supports both local and cloud Ollama instances:

**Local Ollama:**
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model
ollama pull llama3.1

# Start Ollama
ollama serve
```

**Ollama Cloud:**
1. Get your API key from Ollama Cloud
2. Add it to `backend/.env`:
   ```env
   OLLAMA_API_KEY=your_api_key_here
   OLLAMA_API_URL=https://api.ollama.ai
   ```

### Recommended Models

For best results, use these models:
- `llama3.1` - Latest and most capable (recommended)
- `mistral` - Excellent for detailed responses
- `llama3` - Great general-purpose model
- `qwen2.5` - Strong technical capabilities

## 🎨 Customization

### Adjusting Response Quality

Edit `backend/.env` to customize model parameters:

```env
OLLAMA_TEMPERATURE=0.7        # 0.0-1.0, lower = focused, higher = creative
OLLAMA_NUM_PREDICT=2048       # Maximum tokens (longer responses)
OLLAMA_REPEAT_PENALTY=1.1     # Reduces repetition
```

### Customizing System Prompt

Edit the `SYSTEM_PROMPT` in `backend/server.js` to change the AI's behavior and response style.

### Styling

Modify `frontend/src/App.css` to customize the appearance, colors, and layout.

## 📡 API Endpoints

### `GET /api/health`
Health check endpoint

### `GET /api/chat/history`
Get chat history

### `POST /api/chat/message`
Send a message to the chatbot

**Request:**
```json
{
  "message": "Hello!",
  "userId": "user-123"
}
```

**Response:**
```json
{
  "userMessage": {
    "id": 1234567890,
    "text": "Hello!",
    "sender": "user",
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "botMessage": {
    "id": 1234567891,
    "text": "Hello! How can I help you today?",
    "sender": "bot",
    "timestamp": "2024-01-01T12:00:00.100Z"
  }
}
```

### `DELETE /api/chat/history`
Clear chat history

## 🏗️ Project Structure

```
AI-LLM/
├── backend/
│   ├── server.js          # Express server with Ollama integration
│   ├── package.json
│   ├── env.example        # Environment variables template
│   └── test-ollama.js    # Ollama connection test script
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # ChatGPT-like styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json
├── .gitignore
├── package.json           # Root package.json with scripts
├── README.md
├── LICENSE
└── start.sh              # Startup script
```

## 🧪 Testing

Test Ollama connection:
```bash
cd backend
node test-ollama.js
```

## 🚢 Building for Production

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
npm start
```

## 🐛 Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Arif Alam**

- GitHub: [@iamarifalam](https://github.com/iamarifalam)
- Email: Ariflm10@gmail.com
- Website: [damnreality.websites.co.in](https://damnreality.websites.co.in)
- Twitter: [@Arifalam4u](https://twitter.com/Arifalam4u)

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai/) for providing excellent LLM integration
- [React](https://reactjs.org/) team for the amazing framework
- ChatGPT for UI/UX inspiration

## ⭐ Show your support

Give a ⭐ if this project helped you!

---

<div align="center">
Made with ❤️ by <a href="https://github.com/iamarifalam">Arif Alam</a>
</div>
