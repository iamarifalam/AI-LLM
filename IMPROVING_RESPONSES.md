# Improving LLM Response Quality

## Changes Made

### 1. **System Prompt Added**
- Added a comprehensive system prompt that instructs the model to:
  - Be specific and detailed rather than vague
  - Provide examples when helpful
  - Break down complex topics clearly
  - Be thorough but concise

### 2. **Improved Model Parameters**
- **Temperature**: 0.7 (balanced between focused and creative)
- **Top P**: 0.9 (controls response diversity)
- **Top K**: 40 (limits vocabulary for quality)
- **Num Predict**: 2048 (allows longer, detailed responses)
- **Repeat Penalty**: 1.1 (reduces repetitive phrases)

### 3. **Better Context Handling**
- Increased conversation history from 10 to 20 messages
- System prompt included in every request
- Better message formatting

## How to Further Improve Responses

### 1. **Use Better Models**

The model you use significantly affects response quality. Recommended models (in order of quality):

**Best Quality:**
- `llama3.1` or `llama3` - Latest and most capable
- `mistral` - Excellent for detailed responses
- `qwen2.5` - Great for technical questions

**Good Quality:**
- `llama2` - Current default (decent but older)
- `codellama` - Good for code-related questions
- `neural-chat` - Good conversational model

**To change model:**
```bash
# In backend/.env
OLLAMA_MODEL=llama3.1
```

**To download a new model:**
```bash
ollama pull llama3.1
# or
ollama pull mistral
```

### 2. **Adjust Temperature**

Temperature controls creativity vs focus:

- **Lower (0.3-0.5)**: More focused, factual, consistent
- **Medium (0.7)**: Balanced (current default)
- **Higher (0.9-1.2)**: More creative, varied, but less focused

**To adjust:**
```bash
# In backend/.env
OLLAMA_TEMPERATURE=0.5  # For more focused answers
# or
OLLAMA_TEMPERATURE=0.9  # For more creative answers
```

### 3. **Increase Response Length**

For more detailed responses, increase `NUM_PREDICT`:

```bash
# In backend/.env
OLLAMA_NUM_PREDICT=4096  # Allows much longer responses
```

### 4. **Customize System Prompt**

You can modify the system prompt in `backend/server.js` to match your needs:

```javascript
const SYSTEM_PROMPT = `Your custom instructions here...`;
```

Examples:
- **Technical Assistant**: "You are a technical expert. Provide detailed, accurate technical explanations..."
- **Creative Writer**: "You are a creative writing assistant. Help users with storytelling, character development..."
- **Code Helper**: "You are a programming assistant. Provide clear, well-commented code examples..."

### 5. **Reduce Repetition**

If responses are repetitive:

```bash
# In backend/.env
OLLAMA_REPEAT_PENALTY=1.2  # Higher = less repetition
```

## Quick Tips

1. **Restart the backend** after changing `.env` settings
2. **Try different models** - some are much better than others
3. **Clear chat history** if responses seem off
4. **Be specific in questions** - better questions = better answers
5. **Use follow-up questions** - the model remembers context

## Testing Improvements

After making changes:
1. Restart backend: `cd backend && npm run dev`
2. Clear chat history in the UI
3. Ask the same question again
4. Compare responses

## Model Comparison

| Model | Quality | Speed | Best For |
|-------|---------|-------|----------|
| llama3.1 | ⭐⭐⭐⭐⭐ | Medium | General purpose, detailed answers |
| mistral | ⭐⭐⭐⭐⭐ | Fast | Detailed explanations |
| llama3 | ⭐⭐⭐⭐ | Medium | General purpose |
| llama2 | ⭐⭐⭐ | Fast | Basic questions |
| codellama | ⭐⭐⭐⭐ | Medium | Code-related questions |

## Troubleshooting

**Still getting vague answers?**
1. Check which model you're using
2. Try a better model (llama3.1 or mistral)
3. Lower temperature to 0.5-0.6
4. Increase NUM_PREDICT to 2048 or higher
5. Check if the model is properly downloaded

**Responses too long?**
- Lower NUM_PREDICT to 1024
- Increase REPEAT_PENALTY to 1.2

**Responses too short?**
- Increase NUM_PREDICT to 4096
- Lower REPEAT_PENALTY to 1.0

