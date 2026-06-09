# PMS – Full Stack (React + Express + MongoDB)

Your Project Task Management System connected to a real MongoDB database.

---

## 📁 Folder Structure

```
pms-fullstack/
├── backend/                  ← Node.js + Express + MongoDB
│   ├── models/
│   │   ├── Project.js        ← Mongoose Project schema
│   │   └── Task.js           ← Mongoose Task schema
│   ├── routes/
│   │   ├── projects.js       ← GET/POST/PUT/DELETE /api/projects
│   │   └── tasks.js          ← GET/POST/PUT/DELETE /api/tasks
│   ├── .env                  ← MONGO_URI and PORT config
│   ├── server.js             ← Express app entry point
│   └── package.json
│
└── frontend/                 ← React app
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── services/
    │   │   └── api.js        ← All fetch() calls to the backend
    │   ├── hooks/
    │   │   └── useAppData.js ← Fetches from MongoDB on load
    │   ├── data/
    │   │   └── initialData.js← Member names and colors only
    │   ├── utils/
    │   │   └── helpers.js    ← Date, deadline, style helpers
    │   ├── styles/
    │   │   └── global.css
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── Topbar.jsx
    │   │   └── shared.jsx    ← Badge, Modal, Avatar, Spinner, etc.
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Tasks.jsx
    │   │   ├── Projects.jsx
    │   │   └── Reports.jsx
    │   ├── App.jsx
    │   └── index.js
    └── package.json
```

---

## 🚀 Setup Instructions

### Step 1 — Install MongoDB locally

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Download from https://www.mongodb.com/try/download/community and install.

**Ubuntu/Linux:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

Verify it's running:
```bash
mongosh
# Should show the MongoDB shell — type `exit` to quit
```

---

### Step 2 — Start the Backend

```bash
cd pms-fullstack/backend
npm install
npm run dev        # uses nodemon for auto-reload
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

Test it: http://localhost:5000/api/health → `{"status":"ok"}`

---

### Step 3 — Start the Frontend

Open a **new terminal**:

```bash
cd pms-fullstack/frontend
npm install
npm start
```

App opens at **http://localhost:3000**

---

## 🔗 How It Works

```
[React UI]
    │  Create Project button
    ▼
[api.js] → POST /api/projects
    │
    ▼
[Express server.js]
    │
    ▼
[routes/projects.js]
    │
    ▼
[models/Project.js] → MongoDB (pms_db)
    │
    ▼
[Returns created document with _id]
    │
    ▼
[React state updates → UI updates instantly]
```

---

## 🌐 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET    | /api/projects      | Get all projects |
| POST   | /api/projects      | Create a project |
| PUT    | /api/projects/:id  | Update a project |
| DELETE | /api/projects/:id  | Delete a project |
| GET    | /api/tasks         | Get all tasks |
| POST   | /api/tasks         | Create a task |
| PUT    | /api/tasks/:id     | Update task (e.g. status) |
| DELETE | /api/tasks/:id     | Delete a task |

---

## ⚙️ Environment Variables (backend/.env)

```env
MONGO_URI=mongodb://localhost:27017/pms_db
PORT=5000
```

To use **MongoDB Atlas** (cloud), replace MONGO_URI with your Atlas connection string:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/pms_db
```

---

## 🛠 To Customise

- Add members: Edit `MEMBERS` in `frontend/src/data/initialData.js`
- Change port: Edit `PORT` in `backend/.env`
- Add fields to Project: Edit `backend/models/Project.js` + the form in `Projects.jsx`
