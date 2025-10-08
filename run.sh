#!/bin/bash

# Script to run the server with nodemon and configure Codespaces port

cd fsq-proxy-api

# Check if running in Codespaces
if [ -n "$CODESPACE_NAME" ]; then
    echo "🚀 Running in GitHub Codespaces"
    echo "📡 Configuring port 3000 for public access..."
    
    # Make port 3000 public using gh CLI
    gh codespace ports visibility 3000:public -c $CODESPACE_NAME 2>/dev/null || {
        echo "⚠️  Note: Could not auto-configure port visibility."
        echo "Please manually set port 3000 to 'Public' in the PORTS tab."
    }
    
    # Get the forwarded URL
    FORWARDED_URL=$(gh codespace ports -c $CODESPACE_NAME --json sourcePort,browseUrl -q '.[] | select(.sourcePort==3000) | .browseUrl' 2>/dev/null)
    
    if [ -n "$FORWARDED_URL" ]; then
        echo "✅ Server will be available at: $FORWARDED_URL"
    fi
else
    echo "🚀 Running locally"
    echo "✅ Server will be available at: http://localhost:3000"
fi

echo ""
echo "Starting server with nodemon..."
echo "Press Ctrl+C to stop"
echo ""

# Start nodemon
npm run dev