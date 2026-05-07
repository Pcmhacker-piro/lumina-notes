<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Lumina Notes - AI-Powered Note Taking App

A collaborative note-taking application with AI assistance, real-time collaboration, and Firebase integration.

View your app in AI Studio: https://ai.studio/apps/697a2e62-54d1-4953-9da6-443a9274a37c

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** v9.0.0 or higher (comes with Node.js)

### Step 1: Clone & Install Dependencies

```bash
# Navigate to the project directory
cd lumina-notes

# Install all dependencies
npm install

# Fix any security vulnerabilities
npm audit fix
```

### Step 2: Configure Environment Variables

1. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

2. Edit `.env` and add your configuration:
```env
# Get your Gemini API key from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY="your-gemini-api-key-here"

# Local development URL
APP_URL="http://localhost:3000"
```

### Step 3: Configure Firebase (Important!)

To enable Google Sign-In, you need to authorize your localhost domain in Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **gen-lang-client-0292106071**
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Click "Add domain" and add:
   - `localhost:3000`
   - `127.0.0.1:3000`
   - Your machine's IP (e.g., `192.168.246.242:3000`)

> **Tip:** Changes may take 5-10 minutes to propagate. If you still see auth errors, try a hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows).

### Step 4: Run the Application

```bash
npm run dev
```

The app will start at:
- **Local:** http://localhost:3000
- **Network:** http://192.168.246.242:3000 (adjust IP to your machine)

---

## 📝 Available Scripts

```bash
# Start development server with hot-reload
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview

# Check TypeScript errors
npm run lint

# Clean build artifacts
npm clean
```

---

## 🔧 Project Structure

```
lumina-notes/
├── src/
│   ├── components/          # React components
│   │   ├── AuthProvider.tsx # Firebase authentication
│   │   ├── Editor.tsx       # Rich text editor (Tiptap)
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── ShareModal.tsx   # Document sharing
│   │   └── VersionHistory.tsx # Document versioning
│   ├── lib/
│   │   ├── firebase.ts      # Firebase configuration
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/
├── .env                     # Environment variables (create this)
├── .env.example             # Environment template
├── firebase-applet-config.json  # Firebase config
├── firestore.rules          # Firestore security rules
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

---

## 🐛 Troubleshooting

### Issue: "auth/unauthorized-domain" Error on Sign-In

**Solution:** Add your localhost domain to Firebase:
1. Go to Firebase Console → Authentication → Settings
2. Add `localhost:3000` to Authorized domains
3. Wait 5-10 minutes and refresh the browser

### Issue: Port 3000 Already in Use

**Solution:** Kill the process or use a different port:
```bash
# Kill the process using port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- --port 3001
```

### Issue: Dependencies Installation Fails

**Solution:** Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript Errors

**Solution:** Run type checking and fix:
```bash
npm run lint
```

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Editor:** Tiptap (Rich Text Editor)
- **Backend:** Firebase Firestore, Firebase Auth
- **AI:** Google Gemini API
- **Build Tool:** Vite
- **Runtime:** Node.js

---

## 🔐 Security Notes

- Never commit `.env` files to git (already in `.gitignore`)
- Firebase config is public by design
- Use Firestore security rules to protect data
- Keep API keys secure

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Gemini API](https://ai.google.dev)

---

## 👤 Author

- **Name**: Prakash Chand Meena  
- **LinkedIn**: [Prakash Chand Meena](https://www.linkedin.com/in/prakash-meena-a46906324/)  
- **GitHub**: [Pcmhacker-piro](https://github.com/Pcmhacker-piro/)
