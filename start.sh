#!/bin/bash

# Startup script for the chatbot application
# This script ensures ports are free before starting

echo "🚀 Starting Chatbot Application..."
echo ""

# Kill any processes on ports 5001 and 3000
echo "Clearing ports..."
lsof -ti:5001 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 1

# Verify ports are free
if lsof -ti:5001 > /dev/null 2>&1; then
    echo "⚠️  Warning: Port 5001 is still in use"
else
    echo "✅ Port 5001 is free"
fi

if lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  Warning: Port 3000 is still in use"
else
    echo "✅ Port 3000 is free"
fi

echo ""
echo "Starting servers..."
echo ""

# Start the application
npm run dev

