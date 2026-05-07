# 🚀 Lumina Notes - Quick Reference

## First Time Setup

```bash
# Mac/Linux
bash setup.sh

# Windows
setup.bat
```

Or manually:
```bash
npm install
npm audit fix
npm run dev
```

---

## Daily Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server on localhost:3000 |
| `npm run lint` | Check for TypeScript errors |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run clean` | Delete build artifacts |

---

## Common Issues & Fixes

### ❌ Auth Error: `auth/unauthorized-domain`
**Fix:** Add domain to Firebase Console → Authentication → Settings → Authorized domains
- Add: `localhost:3000`, `127.0.0.1:3000`, your machine IP

### ❌ Port 3000 Already in Use (Mac/Linux)
```bash
lsof -ti:3000 | xargs kill -9
npm run dev -- --port 3001
```

### ❌ Dependencies Won't Install
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ "Node not found"
Install [Node.js LTS](https://nodejs.org/) and restart terminal

---

## Project Files

- **README.md** - Full documentation
- **GETTING_STARTED.md** - Step-by-step setup guide
- **.env** - Your local configuration (create from .env.example)
- **firebase-applet-config.json** - Firebase settings
- **src/** - Source code
- **vite.config.ts** - Build settings
- **tsconfig.json** - TypeScript settings

---

## URLs

- **Dev Server:** http://localhost:3000
- **Gemini API:** https://aistudio.google.com/app/apikey
- **Firebase Console:** https://console.firebase.google.com
- **Project Dashboard:** https://ai.studio/apps/697a2e62-54d1-4953-9da6-443a9274a37c

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Editor:** Tiptap (rich text)
- **Backend:** Firebase Firestore + Auth
- **Build:** Vite
- **API:** Google Gemini

---

## Tips

💡 **Fast refresh:** After code changes, browser auto-refreshes (HMR enabled)

💡 **Getting your IP:** 
- Mac/Linux: `ifconfig | grep "inet "`
- Windows: `ipconfig` (look for IPv4 Address)

💡 **Firebase changes take 5-10 minutes** to propagate - be patient!

💡 **Hard refresh browser** if changes don't show:
- Mac: Cmd+Shift+R
- Windows: Ctrl+Shift+R

---

## Need Help?

1. Read: **GETTING_STARTED.md**
2. Check: **README.md**
3. Search: GitHub Issues
4. Ask: Project maintainer

---

**Last Updated:** May 2026
