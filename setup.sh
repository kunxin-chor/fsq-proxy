#!/bin/bash

# Simple script to configure .env file

cd fsq-proxy-api

# Prompt for API key
echo "Enter your Foursquare Service Key:"
read FSQ_API_KEY

# Prompt for port
echo "Enter port (press Enter for default 3000):"
read PORT
PORT=${PORT:-3000}

# Write to .env
cat > .env << EOF
PORT=$PORT
FSQ_API_KEY=$FSQ_API_KEY
EOF

echo "✅ .env file created successfully!"

echo "Install dependencies"
npm install
npm install -g nodemon