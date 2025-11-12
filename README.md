# 📚 NotesBuddy - Standalone Version

A **standalone**, **frontend-only** notes sharing application that works entirely with browser localStorage - no backend or database required!

## ✨ Features

- ✅ **No Backend Required** - Works 100% in the browser
- ✅ **localStorage Database** - All data stored locally
- ✅ **PDF Upload & Download** - Base64 encoding for file storage
- ✅ **User Authentication** - Register/Login (localStorage-based)
- ✅ **Notes Management** - Upload, browse, search, delete
- ✅ **Privacy Controls** - Toggle notes between public/private
- ✅ **Like System** - Like your favorite notes
- ✅ **Advanced Search & Filter** - Filter by title, subject, semester, uploader
- ✅ **Dark Mode** - Full dark theme support with toggle
- ✅ **Responsive Design** - Works on all devices
- ✅ **User Profiles** - View statistics and manage uploads
- ✅ **Real-time Notifications** - Toast notifications for all actions

## 🛠️ Tech Stack

- **React 18.2.0** - UI library for building interactive interfaces
- **Vite 5.0.8** - Lightning-fast build tool and dev server
- **TailwindCSS 3.3.6** - Utility-first CSS framework with custom animations
- **React Router DOM 6.20.1** - Client-side routing and navigation
- **React Hot Toast 2.4.1** - Beautiful, customizable toast notifications

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone the repository**:
```bash
git clone <repository-url>
cd notesBuddy-standalone
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run development server**:
```bash
npm run dev
```

4. **Build for production**:
```bash
npm run build
```

5. **Preview production build**:
```bash
npm run preview
```

6. **Access the application**:
   - Development: http://localhost:3003
   - Production preview: http://localhost:4173

## 🎨 Project Structure

```
notesBuddy-standalone/
├── src/
│   ├── components/      # Reusable React components
│   ├── context/         # Context providers (Auth, Notes, Theme)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind configuration
```

## � Data Storage

All data is stored in browser localStorage:

- `notesBuddy_users` - User accounts (name, email, password)
- `notesBuddy_currentUser` - Currently logged-in user
- `notesBuddy_notes` - All notes with base64-encoded PDFs
- `notesBuddy_likes` - Like relationships
- `notesBuddy_theme` - Dark/light mode preference

**Note**: localStorage has a ~5-10MB limit per domain. Uploading many large PDFs may hit this limit.

## � Usage

1. **Register** - Create an account (stored in localStorage)
2. **Login** - Access your dashboard
3. **Upload Notes** - Share PDF notes with metadata (title, subject, semester, description)
4. **Browse** - Explore all public notes
5. **Search** - Filter by title, subject, semester, or uploader
6. **Download** - Download PDF files
7. **Like** - Mark your favorite notes
8. **Privacy** - Toggle notes between public/private
9. **Profile** - View statistics and manage your uploads
10. **Dark Mode** - Toggle between light and dark themes

## 🔒 Security Note

⚠️ **Important**: This is a demo/educational project. Passwords are stored in plain text in localStorage. For production use, implement proper security measures.


## 👨‍💻 Author 

Saish Naik



