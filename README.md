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

### Additional Features
- 🔐 Permission-based access control
- 📊 Admin dashboard for management
- 🎯 Detailed profile information (GitHub, Twitter, Portfolio)
- ⚡ Skill-based filtering and matching
- 📈 Compatibility scoring system

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Django 4.2.7
- **API:** Django REST Framework
- **Authentication:** JWT (djangorestframework-simplejwt)
- **Database:** PostgreSQL
- **CORS:** django-cors-headers
- **User Management:** djoser

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
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


```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
VITE_JWT_KEY=access_token
```


## 🔐 Security Considerations

- ✅ JWT token-based authentication
- ✅ CORS validation
- ✅ Permission-based access control
- ✅ SQL injection protection (ORM)
- ✅ CSRF protection enabled

## 📊 Admin Dashboard

Access at: `http://localhost:8000/admin/`

**Manage:**
- User accounts
- Developer profiles
- Likes and matches
- Chat messages
- User verification status
---

**Built with ❤️ for CC internal Hack**
