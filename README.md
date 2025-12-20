# 🎯 MESH - Developer Teammate Matching Platform

MESH is a collaborative platform that helps developers discover compatible teammates based on skills, interests, and experience levels.

## ✨ Features

### Core Features
- ✅ **User Authentication** - Oauth to take in verified users
- ✅ **Developer Profiles** - Comprehensive developer information
- ✅ **Smart Matching** - Compatibility algorithm to find the best match
- ✅ **Like System** - Like profiles you're interested in
- ✅ **Mutual Matching** - Create matches when both users like each other
- ✅ **In-App Chat** - Real-time messaging between matched developers
- ✅ **Top 10 Suggestions** - Personalized recommendations based on skills

### Additional Features
- 🔐 Permission-based access control
- 📊 Admin dashboard for management
- 🎯 Detailed profile information (GitHub, Twitter, Portfolio)
- ⚡ Skill-based filtering and matching
- 📈 Compatibility scoring system
- 🔔 Read/unread message tracking

---

## 📁 Project Structure

```
MESH/
├── backend/                          # Django REST API
│   ├── manage.py
│   ├── requirements.txt
│   ├── db.sqlite3
│   ├── SETUP_GUIDE.md               # Backend setup instructions
│   ├── API_DOCUMENTATION.md         # Complete API reference
│   ├── GOOGLE_OAUTH_SETUP.md        # OAuth configuration
│   │
│   ├── backend/                     # Django settings
│   │   ├── settings.py              # Configuration
│   │   ├── urls.py                  # URL routing
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   └── api/                         # Main application
│       ├── models.py                # Database models
│       ├── views.py                 # API viewsets
│       ├── serializers.py           # DRF serializers
│       ├── urls.py                  # API routes
│       ├── admin.py                 # Admin configuration
│       ├── matching_algorithm.py    # Compatibility algorithm
│       ├── tests.py
│       ├── migrations/              # Database migrations
│       └── management/commands/
│           └── populate_profiles.py # Sample data loader
│
└── frontend/                         # React + Tailwind CSS
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── eslint.config.js
    ├── FRONTEND_INTEGRATION.md      # React integration guide
    │
    ├── public/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   ├── components/              # React components
    │   ├── pages/                   # Page components
    │   ├── services/                # API service layer
    │   ├── hooks/                   # Custom hooks
    │   └── store/                   # State management (Redux/Zustand)
```

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Django 4.2.7
- **API:** Django REST Framework
- **Authentication:** JWT (djangorestframework-simplejwt)
- **Database:** SQLite (development), PostgreSQL (production)
- **CORS:** django-cors-headers
- **User Management:** djoser

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Fetch API
- **State Management:** Context API / Redux / Zustand

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load sample data (optional)
python manage.py populate_profiles

# Start server
python manage.py runserver
```

Backend will run on: `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
echo 'VITE_API_URL=http://localhost:8000/api' > .env

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173` (Vite) or `http://localhost:3000` (Create React App)


## 🗄️ Database Models

### UserProfile
- Extends Django User model
- Stores developer-specific information
- Fields: age, bio, github_url, x_url, portfolio_url, skills, looking_for, etc.

### Like
- Represents when user1 likes user2
- Unique constraint: (liker, liked)

### Match
- Represents mutual like between two users
- Stores compatibility score
- Unique constraint: (user1, user2)

### ChatMessage
- Stores messages between matched users
- Tracks read status

### MatchSuggestion
- Caches top suggestions for each user
- One-to-One relationship with UserProfile

---

## 🧠 Matching Algorithm

The compatibility score is calculated as:

```
Score = (Overlap × 0.25) + (Complementary × 0.35) + 
        (TypeCompat × 0.15) + (Availability × 0.15) + 
        (Experience × 0.10)

Where:
- Overlap: Percentage of shared skills
- Complementary: Skills alignment (25-50%)
- TypeCompat: Developer type preference match
- Availability: Can they work together?
- Experience: Similar experience levels?
```

**Score Range:** 0-100 (higher is better)

**Example:**
- User A (React, Node.js, 4 years) looking for Backend
- User B (Python, FastAPI, 5 years) looking for Frontend
- Compatibility Score: ~78%

---

## 🎨 Frontend Integration

### Key Integration Points

1. **Authentication Flow**
   - Login → Get JWT token → Store in localStorage
   - Use token in all API requests

2. **Profile Setup**
   - Create profile after signup
   - Update profile information
   - Upload profile image

3. **Discovery Flow**
   - Browse all profiles (paginated)
   - View suggestions (top 10)
   - Like/unlike profiles

4. **Matching Flow**
   - Automatic match creation on mutual like
   - View your matches
   - See other user's detailed profile

5. **Chat Flow**
   - Send messages in matched chats
   - View message history
   - Mark messages as read

### Example React Hook Usage

```javascript
import { useProfile } from '../hooks/useProfile';
import { useMatches } from '../hooks/useMatches';
import { useChat } from '../hooks/useChat';

function MyComponent() {
  const { profile, suggestions, fetchSuggestions } = useProfile();
  const { matches, likeProfile } = useMatches();
  const { messages, sendMessage } = useChat(matchId);

  // Use the hooks in your component...
}
```

See `FRONTEND_INTEGRATION.md` for detailed examples.

---

## 🌍 Environment Variables

### Backend (.env or settings.py)
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Email (optional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
VITE_JWT_KEY=access_token
```

---

## 🗂️ Important Files

| File | Purpose |
|------|---------|
| `SETUP_GUIDE.md` | Complete backend setup instructions |
| `API_DOCUMENTATION.md` | Full API reference with examples |
| `FRONTEND_INTEGRATION.md` | React integration guide and hooks |
| `GOOGLE_OAUTH_SETUP.md` | Google OAuth configuration |
| `matching_algorithm.py` | Compatibility calculation logic |

---

## 🔐 Security Considerations

- ✅ JWT token-based authentication
- ✅ CORS validation
- ✅ Permission-based access control
- ✅ SQL injection protection (ORM)
- ✅ CSRF protection enabled
- ⚠️ TODO: Rate limiting
- ⚠️ TODO: Input validation
- ⚠️ TODO: SQL query optimization



## 📊 Admin Dashboard

Access at: `http://localhost:8000/admin/`

**Manage:**
- User accounts
- Developer profiles
- Likes and matches
- Chat messages
- User verification status



## 🚢 Deployment

### Backend Deployment Checklist
- [ ] Set DEBUG = False
- [ ] Update SECRET_KEY
- [ ] Configure ALLOWED_HOSTS
- [ ] Setup PostgreSQL database
- [ ] Configure CORS properly
- [ ] Setup SSL/HTTPS
- [ ] Configure environment variables
- [ ] Setup error logging
- [ ] Configure static files serving
- [ ] Configure media files serving
- [ ] Use Gunicorn/uWSGI
- [ ] Setup Nginx reverse proxy
- [ ] Configure backup strategy
- [ ] Setup monitoring

### Frontend Deployment
- [ ] Run `npm run build`
- [ ] Deploy dist/ folder to CDN or static server
- [ ] Update VITE_API_URL for production API
- [ ] Configure domain and SSL

---

## 🧪 Testing

### Run Tests
```bash
python manage.py test
```

### Create Test Data
```bash
python manage.py populate_profiles
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** ModuleNotFoundError: No module named 'rest_framework'
```bash
pip install -r requirements.txt
```

**Problem:** No such table: api_userprofile
```bash
python manage.py migrate
```

**Problem:** CORS errors
- Update CORS_ALLOWED_ORIGINS in settings.py
- Restart Django server

### Frontend Issues

**Problem:** API requests failing (CORS errors)
- Check if backend is running
- Verify VITE_API_URL in .env
- Check browser console for errors

**Problem:** Tokens not being saved
- Check localStorage permissions
- Verify token storage logic in useAuth hook

---

**Built with ❤️ for CC internal Hack**