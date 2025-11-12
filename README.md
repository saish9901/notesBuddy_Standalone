# NotesBuddy - Standalone LocalStorage Version# 📚 NotesBuddy - Your Study Companion



A **standalone**, **frontend-only** notes sharing application that works entirely with browser localStorage - no backend or database required!A production-ready, full-stack web application that enables students to share, discover, and download educational resources. Built with modern technologies for a seamless and responsive user experience.



## 🚀 Features![License](https://img.shields.io/badge/license-MIT-blue.svg)

![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)

- ✅ **No Backend Required** - Works 100% in the browser![React](https://img.shields.io/badge/react-18.2.0-blue)

- ✅ **localStorage Database** - All data stored locally![MySQL](https://img.shields.io/badge/mysql-8.0-orange)

- ✅ **PDF Upload** - Base64 encoding for file storage

- ✅ **User Authentication** - Register/Login (localStorage)## 📋 Overview

- ✅ **Notes Management** - Upload, browse, search, delete

- ✅ **Privacy Controls** - Public/private notes**NotesBuddy** is your ultimate study companion that enables students to upload, share, search, and download educational PDF notes. It features secure authentication, advanced search with multiple filters, privacy controls, like system, and comprehensive user profiles with statistics tracking.

- ✅ **Like System** - Like your favorite notes

- ✅ **Search & Filter** - Advanced search functionality## 🛠️ Tech Stack

- ✅ **Download PDFs** - Download notes as PDF files

- ✅ **Responsive Design** - Works on all devices### **Frontend**

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)

## 📦 Tech Stack![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?style=for-the-badge&logo=vite&logoColor=white)

![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.3.6-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

- **React 18.2.0** - UI library![React Router](https://img.shields.io/badge/React_Router-6.20.1-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

- **Vite** - Build tool

- **TailwindCSS** - Styling- **React 18.2.0** - UI library for building interactive interfaces

- **React Router DOM** - Routing- **Vite 5.4.21** - Lightning-fast build tool and dev server

- **React Hot Toast** - Notifications- **TailwindCSS 3.3.6** - Utility-first CSS framework with custom animations

- **React Router DOM 6.20.1** - Client-side routing and navigation

## 🛠️ Installation- **Axios** - Promise-based HTTP client for API requests

- **React Hot Toast** - Beautiful, customizable toast notifications

```bash

# Install dependencies### **Backend**

npm install![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js&logoColor=white)

![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white)

# Run development server![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

npm run dev![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)



# Build for production- **Node.js** - JavaScript runtime environment

npm run build- **Express 4.18.2** - Fast, unopinionated web framework

- **MySQL2 3.6.5** - MySQL database driver with promise support

# Preview production build- **bcryptjs** - Password hashing for secure authentication

npm run preview- **jsonwebtoken** - JWT implementation for authentication

```- **Multer** - Middleware for handling multipart/form-data (file uploads)

- **Express Validator** - Middleware for request validation and sanitization

## 🌐 Deployment to Netlify

### ✨ Key Features

### Option 1: Netlify CLI

#### 📝 Core Features

```bash- **Upload & Share Notes** - Upload PDF notes with metadata (subject, semester, description)

# Install Netlify CLI- **Advanced Search** - Search by title, subject, semester, or uploader with multiple filters

npm install -g netlify-cli- **Privacy Controls** - Toggle notes between public and private visibility

- **Like System** - Like your favorite notes and track popular content

# Login- **Download Tracking** - Download notes with automatic counter incrementation

netlify login- **User Authentication** - Secure JWT-based registration and login

- **Profile Management** - Update profile, change password, view statistics

# Build- **Account Deletion** - Complete account removal with data cleanup

npm run build

#### 🎯 Advanced Features

# Deploy- **View Counter** - Track note popularity with automatic view counting

netlify deploy --prod --dir=dist- **Responsive Design** - Mobile-first design optimized for all screen sizes

```- **Real-time Notifications** - Toast notifications for all user actions

- **Pagination** - Efficient navigation through large note collections

### Option 2: Netlify Dashboard- **Protected Routes** - Role-based access control for authenticated users

- **Confirmation Modals** - User-friendly confirmations for logout and privacy changes

1. Go to [app.netlify.com](https://app.netlify.com/)- **Search Persistence** - Maintain search state across pagination

2. Click "Add new site" → "Import an existing project"- **Sorting Options** - Sort by date, downloads, views, likes, or popularity

3. Connect your GitHub repository

4. Configure:## 🏗️ Project Structure

   - **Build command**: `npm run build`

   - **Publish directory**: `dist````

5. Click "Deploy site"notesbuddy/

├── backend/                    # Node.js + Express backend

## 📱 Usage│   ├── config/                # Database & configuration

│   ├── controllers/           # Request handlers

1. **Register** - Create an account (stored in localStorage)│   ├── middleware/            # Custom middleware

2. **Login** - Access your dashboard│   ├── models/                # Database models

3. **Upload Notes** - Share PDF notes with metadata│   ├── routes/                # API routes

4. **Browse** - Explore all public notes│   ├── utils/                 # Helper functions

5. **Search** - Filter by title, subject, semester, etc.│   ├── uploads/               # PDF storage

6. **Download** - Download PDF files│   ├── .env.example           # Environment template

7. **Like** - Mark your favorite notes│   ├── package.json

8. **Privacy** - Toggle notes between public/private│   ├── server.js              # Entry point

│   └── README.md

## 💾 Data Storage│

├── frontend/                  # React frontend

All data is stored in browser localStorage:│   ├── public/                # Static assets

│   ├── src/

- `notesBuddy_users` - User accounts│   │   ├── components/        # Reusable components

- `notesBuddy_currentUser` - Logged-in user│   │   ├── context/           # Context providers

- `notesBuddy_notes` - All notes (with base64 PDFs)│   │   ├── hooks/             # Custom hooks

- `notesBuddy_likes` - Like relationships│   │   ├── pages/             # Page components

│   │   ├── services/          # API service

**Note**: localStorage has a ~5-10MB limit per domain. Uploading many large PDFs may hit this limit.│   │   ├── App.jsx            # Main component

│   │   └── main.jsx           # Entry point

## 🎨 Project Structure│   ├── .env.example           # Environment template

│   ├── package.json

```│   ├── vite.config.js

notesBuddy-standalone/│   └── README.md

├── src/│

│   ├── components/      # React components└── README.md                  # This file

│   ├── context/         # Auth & Notes context (localStorage)```

│   ├── hooks/           # Custom hooks

│   ├── pages/           # Page components## 🚀 Quick Start

│   ├── App.jsx          # Main app component

│   └── main.jsx         # Entry point### Prerequisites

├── public/              # Static assets

├── index.html           # HTML template- Node.js (v14 or higher)

├── package.json         # Dependencies- MySQL (v5.7 or higher)

├── vite.config.js       # Vite configuration- npm or yarn

└── tailwind.config.js   # Tailwind configuration

```### Installation



## 🔒 Security Note1. **Clone the repository**:

```bash

⚠️ **Important**: This is a demo/educational project. Passwords are stored in plain text in localStorage. For production use, implement proper security measures.git clone <repository-url>

cd college-notes-platform

## 📄 License```



MIT2. **Setup Backend**:

```bash

## 👨‍💻 Authorcd backend

npm install

NotesBuddy Teamcp .env.example .env

# Edit .env with your database credentials

---npm run init-db

npm run dev

**Made with ❤️ for students, by students**```


3. **Setup Frontend** (in a new terminal):
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend API URL
npm run dev
```

4. **Access the application**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Notes Table
```sql
CREATE TABLE notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(100) NOT NULL,
  semester VARCHAR(50) NOT NULL,
  filePath VARCHAR(255) NOT NULL,
  uploadedBy INT NOT NULL,
  downloads INT DEFAULT 0,
  uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploadedBy) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Notes
- `POST /api/notes/upload` - Upload note (protected)
- `GET /api/notes/all` - Get all notes with pagination
- `GET /api/notes/search?q=query` - Search notes
- `GET /api/notes/:id` - Get note by ID
- `GET /api/notes/download/:id` - Download note PDF
- `DELETE /api/notes/delete/:id` - Delete note (protected)
- `GET /api/notes/my/notes` - Get user's notes (protected)

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=notes_app
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📦 Dependencies

### Backend
- express - Web framework
- mysql2 - MySQL client
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- multer - File upload
- express-validator - Input validation
- cors - Cross-origin resource sharing
- dotenv - Environment variables

### Frontend
- react - UI library
- react-router-dom - Routing
- axios - HTTP client
- react-hot-toast - Notifications
- tailwindcss - CSS framework
- vite - Build tool

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Push code to GitHub
2. Create new Web Service
3. Set environment variables
4. Deploy MySQL database (PlanetScale/DigitalOcean)
5. Update DB connection in environment

### Frontend Deployment (Vercel/Netlify)
1. Build project: `npm run build`
2. Deploy `dist` folder
3. Set `VITE_API_URL` environment variable
4. Configure build command: `npm run build`
5. Configure output directory: `dist`

### Database Hosting Options
- **PlanetScale**: Serverless MySQL with generous free tier
- **DigitalOcean**: Managed MySQL databases
- **AWS RDS**: Amazon's managed database service
- **Railway**: All-in-one platform with database support

## 🔐 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication
- Input validation and sanitization
- SQL injection protection (parameterized queries)
- File type and size validation
- CORS configuration
- Environment-based secrets
- Protected routes
- Error message sanitization

## 📱 Pages & Features

### Public Pages
- **Dashboard**: Landing page with features overview
- **Login**: User authentication
- **Register**: New user registration
- **Notes List**: Browse all available notes
- **Note Details**: View individual note information
- **Search**: Find notes by keyword

### Protected Pages
- **Upload**: Upload new PDF notes
- **Profile**: View statistics and manage uploads

## 🎨 UI/UX Features

- Responsive design (mobile, tablet, desktop)
- Loading states and skeleton screens
- Toast notifications for user feedback
- Form validation with error messages
- Drag-and-drop file upload
- Pagination for large datasets
- Search with real-time filtering
- Accessible (ARIA labels, keyboard navigation)

## 🧪 Testing

### Backend Testing
```bash
cd backend
# Test database connection
npm run init-db

# Test API endpoints
curl http://localhost:5000/api/health
```

### Frontend Testing
```bash
cd frontend
# Start development server
npm run dev

# Build for production
npm run build
npm run preview
```

## 📖 API Documentation

Detailed API documentation is available in the backend README. Example requests:

**Register User**:
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Upload Note**:
```bash
POST http://localhost:5000/api/notes/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

title: Data Structures Notes
description: Complete DSA notes
subject: Computer Science
semester: 3
file: <PDF file>
```

