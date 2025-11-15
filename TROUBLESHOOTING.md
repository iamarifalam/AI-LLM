# Troubleshooting Connection Issues

## Issue: "Unable to connect to the server"

### Quick Fixes:

1. **Restart the Backend Server**
   - The backend needs to be restarted to pick up CORS changes
   - If using `npm run dev`, stop it (Ctrl+C) and restart
   - Or manually restart: `cd backend && npm run dev`

2. **Verify Backend is Running**
   ```bash
   curl http://localhost:5001/api/health
   ```
   Should return: `{"status":"ok",...}`

3. **Check Browser Console**
   - Open browser DevTools (F12)
   - Check Console tab for detailed error messages
   - Check Network tab to see if requests are being made

4. **Verify Ports**
   - Backend should be on port **5001**
   - Frontend should be on port **3000**
   - Check: `lsof -ti:5001` and `lsof -ti:3000`

5. **Test Connection**
   ```bash
   # Test backend directly
   curl -X POST http://localhost:5001/api/chat/message \
     -H "Content-Type: application/json" \
     -d '{"message":"test"}'
   ```

### Common Issues:

**CORS Errors:**
- Backend CORS is now configured for `http://localhost:3000`
- Make sure backend is restarted after CORS changes

**Port Mismatch:**
- Frontend expects backend on port 5001
- Check `frontend/src/App.js` has: `http://localhost:5001`
- Check `backend/.env` has: `PORT=5001`

**Network Errors:**
- Check if backend process is actually running
- Verify no firewall blocking localhost connections
- Try accessing `http://localhost:5001/api/health` in browser

### Debug Steps:

1. Open browser console (F12)
2. Try sending a message
3. Check the error details in console
4. Look for the exact error message and URL being called

### Still Not Working?

Check the backend console logs for:
- CORS errors
- Port binding errors
- Ollama connection errors
- Any other error messages

