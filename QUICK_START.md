# 🚀 Quick Start Guide

## Start Development Server

```bash
cd notesBuddy-standalone
npm install
npm run dev
```

Open: http://localhost:5173

## Deploy to Netlify (Fast!)

### Method 1: Drag & Drop (Fastest!)
```bash
npm run build
```
Then drag the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

### Method 2: GitHub + Netlify
```bash
# Push to GitHub
git init
git add .
git commit -m "NotesBuddy Standalone"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main

# Then connect on Netlify Dashboard
# Build command: npm run build
# Publish directory: dist
```

### Method 3: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
```

## Test the App

1. **Register**: Create account (email + password)
2. **Login**: Use your credentials
3. **Upload**: Add a PDF note (keep < 1MB for best performance)
4. **Browse**: View all notes
5. **Download**: Click download on any note
6. **Like**: Heart icon to like notes
7. **Profile**: View your statistics

## Important Notes

- ✅ Works 100% offline after first load
- ✅ No backend or database needed
- ✅ All data in browser localStorage
- ⚠️ Keep PDFs small (< 1-2MB recommended)
- ⚠️ Data is per-browser (not synced)
- ⚠️ Clearing browser data = lose all notes

## File Structure

```
notesBuddy-standalone/
├── src/
│   ├── context/
│   │   ├── AuthContext.jsx     ← localStorage auth
│   │   └── NotesContext.jsx    ← localStorage notes
│   ├── pages/
│   │   ├── Upload.jsx          ← Base64 PDF upload
│   │   ├── Profile.jsx         ← User profile
│   │   └── ...
│   └── ...
├── netlify.toml               ← Deployment config
├── package.json               ← No axios!
└── README.md
```

## Troubleshooting

**Q: localStorage full error?**  
A: Delete some notes or use smaller PDFs

**Q: Data lost after browser restart?**  
A: Check if you're in incognito mode (doesn't persist)

**Q: Can't see uploaded notes?**  
A: Check if note is set to "Private"

**Q: Build fails on Netlify?**  
A: Check Node version is 18+ in build settings

## Need Help?

Read the full guides:
- `README.md` - Project overview
- `NETLIFY_DEPLOYMENT.md` - Detailed deployment
- `MIGRATION_SUMMARY.md` - What was changed

---

**Happy Note Sharing! 📚**
