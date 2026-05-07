#!/bin/bash

# ============================================
# Lumina Notes - Automated Setup Script
# ============================================
# This script automatically sets up the project
# for first-time users

echo "🚀 Lumina Notes - Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "   Please install Node.js v18+ from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js detected: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm detected: $NPM_VERSION"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Dependency installation failed."
    exit 1
fi
echo "✅ Dependencies installed successfully"
echo ""

# Fix vulnerabilities
echo "🔒 Fixing security vulnerabilities..."
npm audit fix
echo "✅ Security vulnerabilities fixed"
echo ""

# Create .env file if it doesn't exist
echo "⚙️  Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from template"
    echo ""
    echo "⚠️  IMPORTANT SETUP STEPS:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1️⃣  Edit .env and add your Gemini API key:"
    echo "   • Go to: https://aistudio.google.com/app/apikey"
    echo "   • Copy your API key"
    echo "   • Paste it in .env file"
    echo ""
    echo "2️⃣  Configure Firebase for Google Sign-In:"
    echo "   • Visit: https://console.firebase.google.com/"
    echo "   • Go to: Authentication → Settings → Authorized domains"
    echo "   • Add these domains:"
    echo "     - localhost:3000"
    echo "     - 127.0.0.1:3000"
    echo "     - Your machine IP:3000"
    echo ""
    echo "   💡 Tip: Find your IP with: ifconfig | grep 'inet '"
    echo "   ⏱️  Wait 5-10 minutes for Firebase to propagate changes"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Run TypeScript lint
echo "✔️  Running TypeScript checks..."
npm run lint
if [ $? -ne 0 ]; then
    echo "⚠️  TypeScript errors found. Please fix them before running."
    exit 1
fi
echo "✅ No TypeScript errors"
echo ""

# Success message
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 To start the development server, run:"
echo "   npm run dev"
echo ""
echo "📱 Your app will be available at:"
echo "   http://localhost:3000"
echo ""
echo "📚 For more info, see: README.md"
echo ""
