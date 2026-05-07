@echo off
REM ============================================
REM Lumina Notes - Automated Setup Script
REM ============================================
REM This script automatically sets up the project
REM for first-time Windows users

echo.
echo 🚀 Lumina Notes - Setup Script
echo ================================
echo.

REM Check if Node.js is installed
echo 📋 Checking prerequisites...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed.
    echo    Please install Node.js v18+ from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js detected: %NODE_VERSION%

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm detected: %NPM_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Dependency installation failed.
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully
echo.

REM Fix vulnerabilities
echo 🔒 Fixing security vulnerabilities...
call npm audit fix
echo ✅ Security vulnerabilities fixed
echo.

REM Create .env file if it doesn't exist
echo ⚙️  Setting up environment variables...
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env file from template
    echo.
    echo ⚠️  IMPORTANT SETUP STEPS:
    echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo.
    echo 1️⃣  Edit .env and add your Gemini API key:
    echo    • Go to: https://aistudio.google.com/app/apikey
    echo    • Copy your API key
    echo    • Paste it in .env file
    echo.
    echo 2️⃣  Configure Firebase for Google Sign-In:
    echo    • Visit: https://console.firebase.google.com/
    echo    • Go to: Authentication ^> Settings ^> Authorized domains
    echo    • Add these domains:
    echo      - localhost:3000
    echo      - 127.0.0.1:3000
    echo      - Your machine IP:3000
    echo.
    echo    💡 Tip: Find your IP with Windows Command Prompt:
    echo       ipconfig
    echo       (Look for IPv4 Address)
    echo.
    echo    ⏱️  Wait 5-10 minutes for Firebase to propagate changes
    echo.
    echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo.
) else (
    echo ✅ .env file already exists
)

REM Run TypeScript lint
echo ✔️  Running TypeScript checks...
call npm run lint
if errorlevel 1 (
    echo ⚠️  TypeScript errors found. Please fix them before running.
    pause
    exit /b 1
)
echo ✅ No TypeScript errors
echo.

REM Success message
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✨ Setup complete!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 🚀 To start the development server, run:
echo    npm run dev
echo.
echo 📱 Your app will be available at:
echo    http://localhost:3000
echo.
echo 📚 For more info, see: README.md
echo.
pause
