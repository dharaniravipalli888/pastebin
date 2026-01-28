# 📝 Pastebin Lite

A simple, full-stack pastebin application that allows users to share code snippets and text with optional expiration features. Built with **React** for the frontend and **FastAPI** for the backend.

---

## 🎯 Project Overview

Pastebin Lite is a lightweight clipboard sharing service with the following features:

- **Create Pastes**: Share code or text snippets with a unique ID
- **View Pastes**: Retrieve and view shared pastes with unique links
- **Optional TTL (Time-To-Live)**: Set an expiration time for pastes
- **View Limits**: Set maximum view count before a paste expires
- **Copy Sharing Links**: Easy one-click copy functionality for sharing
- **HTML View**: Direct HTML rendering of pastes for easy sharing
- **Backend Health Check**: Monitor backend connectivity from frontend

---

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 19.x
- React Router (for navigation)
- CSS3 (custom styling)
- Fetch API (for HTTP requests)

**Backend:**
- FastAPI (Python async web framework)
- SQLAlchemy (ORM)
- PostgreSQL (database)
- Uvicorn (ASGI server)
- CORS support for cross-origin requests

---

## 📂 Project Structure

```
naukari_project/
├── backend/
│   ├── main.py              # FastAPI app initialization
│   ├── models.py            # SQLAlchemy Paste model
│   ├── db.py                # Database configuration
│   ├── routes.py            # API endpoints
│   ├── Requirements         # Python dependencies
│   └── __pycache__/
├── frontend/
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   ├── App.css          # Main styles
│   │   ├── index.js         # React entry point
│   │   ├── components/
│   │   │   ├── CreatePaste.js      # Component to create pastes
│   │   │   ├── ViewPaste.js        # Component to view pastes
│   │   │   ├── PasteSuccess.js     # Success message after creation
│   │   │   └── styles/
│   │   │       ├── CreatePaste.css
│   │   │       ├── ViewPaste.css
│   │   │       └── PasteSuccess.css
│   │   └── services/
│   │       └── api.js       # API service with helper functions
│   ├── package.json
│   └── public/
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 14+** (for frontend)
- **PostgreSQL** (database)
- **npm** or **yarn** (for frontend package management)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r Requirements
   ```

5. **Create a `.env` file in the backend directory:**
   ```bash
   touch .env
   ```

6. **Add the database URL to `.env`:**
   ```env
   DB_URL=postgresql://username:password@localhost:5432/pastebin_lite
   ```

   Replace `username`, `password`, and `localhost` with your PostgreSQL credentials.

7. **Create the PostgreSQL database:**
   ```bash
   createdb pastebin_lite
   ```

8. **Run the backend server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The backend API will be available at: `http://localhost:8000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The frontend will open automatically at: `http://localhost:3000`

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📖 Project Walkthrough

### Backend Architecture

#### **Database Model** (`models.py`)

The `Paste` model stores all paste information:

```python
class Paste(Base):
    __tablename__ = "pastes"
    
    id: String(16)           # Unique paste ID (first 8 chars of UUID hex)
    content: Text            # Actual paste content
    created_at: BigInteger   # Timestamp in milliseconds
    ttl_seconds: Integer     # Optional: expires after N seconds
    max_views: Integer       # Optional: expires after N views
    views: Integer           # Current view count
```

#### **API Endpoints** (`routes.py`)

1. **Health Check**
   ```
   GET /api/healthz
   ```
   - Verifies backend is running and database is connected
   - Used by frontend to show connection status

2. **Create Paste**
   ```
   POST /api/pastes
   Content-Type: application/json
   
   {
     "content": "Your code or text here",
     "ttl_seconds": 3600,      // Optional: expires in 1 hour
     "max_views": 10           // Optional: expires after 10 views
   }
   ```
   - Creates a new paste with unique ID
   - Returns paste metadata (id, content, ttl_seconds, max_views)

3. **Get Paste (JSON)**
   ```
   GET /api/pastes/{paste_id}
   ```
   - Retrieves paste content in JSON format
   - Increments view counter
   - Returns 404 if paste is expired or not found

4. **Get Paste (HTML)**
   ```
   GET /p/{paste_id}
   ```
   - Returns paste as a styled HTML page
   - Useful for direct sharing in browsers
   - Increments view counter
   - Returns 404 if paste is expired or not found

#### **Expiry Logic**

Pastes can expire based on two conditions:

1. **TTL (Time-To-Live)**: Expires if current time exceeds `created_at + ttl_seconds`
2. **Max Views**: Expires if view count reaches or exceeds `max_views`

Both conditions are checked whenever a paste is accessed.

---

### Frontend Architecture

#### **Main App Component** (`App.js`)

Manages the overall application state and navigation:

- **State Management:**
  - `view`: Controls which component to display ('create', 'view', 'success')
  - `currentPaste`: Stores the last created paste
  - `viewPasteId`: ID of the paste being viewed
  - `backendStatus`: Connection status to backend

- **Features:**
  - Performs health check on app load
  - Displays connection status badge
  - Routes between different views
  - Shows warning if backend is disconnected

#### **Components**

1. **CreatePaste Component**
   - Displays a form to create new pastes
   - Input fields:
     - `Paste Content`: Required text area
     - `TTL (Seconds)`: Optional expiration time
     - `Max Views`: Optional view limit
   - Handles form submission and error display
   - Calls API to create paste

2. **PasteSuccess Component**
   - Shows success message after paste creation
   - Displays:
     - Unique paste ID
     - Shareable link (copy button included)
     - TTL and max views information (if set)
   - Buttons to:
     - View the paste
     - Create another paste

3. **ViewPaste Component**
   - Fetches and displays paste content
   - Shows metadata (ID, view count)
   - Copy-to-clipboard functionality
   - Error handling for expired/not found pastes
   - Loading state while fetching

#### **API Service** (`services/api.js`)

Helper functions for backend communication:

```javascript
// Health check - verifies backend availability
healthCheck()

// Create a paste
createPaste(content, ttlSeconds, maxViews)

// Retrieve a paste by ID
getPaste(pasteId)
```

All requests use the base URL: `http://localhost:8000`

---

## 🔄 User Flow

1. **User opens the app** → Frontend loads, performs health check
2. **User enters content** → Types or pastes text in CreatePaste component
3. **User sets expiry (optional)** → Configures TTL and/or view limit
4. **User submits** → Calls `/api/pastes` endpoint
5. **Backend creates paste** → Generates unique ID, stores in database
6. **Success page displays** → Shows ID and shareable link
7. **User shares link** → Can copy link or direct HTML route
8. **Recipient accesses paste** → Frontend fetches via `/api/pastes/{id}`
9. **Paste displays** → Content shown in ViewPaste component
10. **Paste may expire** → Based on TTL or view count

---

## 🛡️ Security Features

- **CORS Enabled**: Allows frontend to communicate with backend
- **Input Validation**: TTL and max_views must be positive integers
- **SQL Injection Protection**: Uses SQLAlchemy ORM
- **HTML Escaping**: Paste content is escaped in HTML views
- **Database Connection Pooling**: Optimized with `pool_pre_ping`

---

## 🧪 Testing Health Check

Verify the backend is running:

```bash
curl http://localhost:8000/api/healthz
```

Expected response:
```json
{"ok": true}
```

---

## 📝 Example API Usage

### Create a Paste (expires in 1 hour, max 5 views)
```bash
curl -X POST http://localhost:8000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "console.log(\"Hello, World!\");",
    "ttl_seconds": 3600,
    "max_views": 5
  }'
```

Response:
```json
{
  "id": "a1b2c3d4",
  "content": "console.log(\"Hello, World!\");",
  "ttl_seconds": 3600,
  "max_views": 5
}
```

### View the Paste
```bash
curl http://localhost:8000/api/pastes/a1b2c3d4
```

Response:
```json
{
  "id": "a1b2c3d4",
  "content": "console.log(\"Hello, World!\");",
  "views": 1
}
```

---

