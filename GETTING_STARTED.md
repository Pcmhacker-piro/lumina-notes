# Getting Started with Lumina Notes

Welcome! This guide will help you set up Lumina Notes on your laptop step-by-step.

---

## ⚡ Quick Setup (5 minutes)

### For Mac & Linux Users:

```bash
# 1. Navigate to the project folder
cd lumina-notes

# 2. Run the automated setup script
bash setup.sh

# 3. Edit .env file and add your Gemini API key
# See "Step 2" below for details

# 4. Start the app
npm run dev
```

### For Windows Users:

```bash
# 1. Navigate to the project folder
cd lumina-notes

# 2. Run the automated setup script
setup.bat

# 3. Edit .env file and add your Gemini API key
# See "Step 2" below for details

# 4. Start the app
npm run dev
```

---

## 📋 Step-by-Step Manual Setup

### Step 1: Install Node.js

**Check if you already have it:**
```bash
node --version
npm --version
```

If you see version numbers, skip to Step 2. Otherwise:

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version
3. Install it by following the installer
4. Restart your terminal/command prompt
5. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Get Your Gemini API Key

1. Visit [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key
4. Open the `.env` file in the project (use any text editor)
5. Replace the placeholder with your actual key:
   ```env
   GEMINI_API_KEY="your-copied-key-here"
   ```
6. Save the file

### Step 3: Install Project Dependencies

```bash
cd lumina-notes
npm install
npm audit fix
```

This may take 1-2 minutes. Wait for it to complete.

### Step 4: Configure Firebase (Important!)

This step is required for Google Sign-In to work.

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. You should see project "gen-lang-client-0292106071" (if not, ask admin)
3. Click **Authentication** in the left sidebar
4. Go to **Settings** tab
5. Find **Authorized domains** section
6. Click **Add domain** button
7. Add these domains (one at a time):
   - `localhost:3000`
   - `127.0.0.1:3000`
   - Your machine's IP address (see below)

**Finding your machine's IP address:**

**Mac/Linux:**
```bash
ifconfig | grep "inet "
# Look for something like: inet 192.168.1.100
# Use: 192.168.1.100:3000
```

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" like: 192.168.1.100
# Use: 192.168.1.100:3000
```

8. After adding all domains, wait **5-10 minutes** for Firebase to update

### Step 5: Run the App

```bash
npm run dev
```

You should see:
```
  VITE v6.4.2  ready in 1861 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

Open http://localhost:3000 in your browser!

---

## 🆘 Troubleshooting

### Problem: "auth/unauthorized-domain" Error

**Cause:** Firebase doesn't recognize your domain

**Fix:**
1. Re-check that you added your domains in Firebase Console
2. Try a **hard refresh**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
3. Wait another 5-10 minutes
4. Clear browser cache and try again

### Problem: Port 3000 Already in Use

**Cause:** Another app is using port 3000

**Fix - Option 1:** Kill the process (Mac/Linux)
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

**Fix - Option 2:** Use a different port
```bash
npm run dev -- --port 3001
# Then visit http://localhost:3001
```

### Problem: "npm: command not found"

**Cause:** Node.js/npm not properly installed

**Fix:**
1. Download [Node.js LTS](https://nodejs.org/)
2. Install it completely
3. Restart your terminal
4. Try again

### Problem: Dependencies Won't Install

**Cause:** Cache corruption

**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: TypeScript Errors

**Cause:** Version conflicts

**Fix:**
```bash
npm run lint
```

This will show detailed errors. If you can't fix them, reach out to the team.

---

## 📁 Project Structure

```
lumina-notes/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── lib/                # Utilities & Firebase
│   ├── App.tsx             # Main app
│   └── main.tsx            # Entry point
├── public/                 # Static files
├── .env                    # Your local configuration (create from .env.example)
├── firebase-applet-config.json  # Firebase settings (pre-configured)
├── package.json            # Dependencies list
├── vite.config.ts          # Build configuration
└── README.md               # Full documentation
```

---

## 🎯 Common Tasks

### Start Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview  # Test the build locally
```

### Check for Errors
```bash
npm run lint
```

### Clean Build Files
```bash
npm run clean
```

---

## 🆘 Need Help?

1. Check the [README.md](README.md) for more details
2. Check the [Troubleshooting](#-troubleshooting) section above
3. Contact the project maintainer

---

## ✅ Success Checklist

Before considering setup complete:

- [ ] Node.js v18+ installed
- [ ] npm dependencies installed (`npm install`)
- [ ] `.env` file created with Gemini API key
- [ ] Firebase domains authorized (localhost:3000, 127.0.0.1:3000, your IP)
- [ ] `npm run dev` starts without errors
- [ ] App loads at http://localhost:3000
- [ ] Can see the login page

You're all set! 🎉
