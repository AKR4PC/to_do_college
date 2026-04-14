# To-Do Dashboard — Full Stack MERN App

A Kanban-style task management dashboard built with the MERN stack, featuring drag-and-drop, smooth scrolling, and a pixel-perfect UI replicated from a Figma design.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18 + Vite                     |
| Styling   | Tailwind CSS v4                     |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Smooth Scroll | Lenis                           |
| Backend   | Node.js + Express.js                |
| Database  | MongoDB (via Mongoose ODM)          |
| HTTP Client | Axios                             |
| Notifications | react-hot-toast               |

---

## Project Structure

```
to_do_college/
├── client/                  # React frontend
│   ├── src/
│   │   ├── api/             # Axios API calls
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── App.jsx          # Root component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles + Tailwind
│   ├── vite.config.js
│   └── package.json
│
├── server/                  # Express backend
│   ├── models/
│   │   ├── Task.js          # Mongoose Task schema
│   │   └── Column.js        # Mongoose Column schema
│   ├── routes/
│   │   ├── tasks.js         # CRUD + reorder endpoints
│   │   └── columns.js       # Column endpoints
│   ├── index.js             # Server entry point
│   ├── .env                 # Environment variables (not committed)
│   └── package.json
│
├── .gitignore
├── README.md
└── presentation.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- A MongoDB Atlas account (free tier works perfectly)

### 1. Clone the repo
```bash
git clone https://github.com/AKR4PC/to_do_college.git
cd to_do_college
```

### 2. Set up MongoDB Atlas
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new cluster (free M0 tier)
3. Click **Connect** → **Drivers** → copy the connection string
4. Replace `<username>` and `<password>` with your credentials

### 3. Configure the backend
```bash
cd server
# Edit .env file:
# MONGO_URI=mongodb+srv://youruser:yourpass@cluster0.mongodb.net/todo_db
# PORT=5000
```

### 4. Install dependencies
```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 5. Run the app

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App running on http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | `/api/tasks`              | Get all tasks            |
| POST   | `/api/tasks`              | Create a new task        |
| PATCH  | `/api/tasks/:id`          | Update a task            |
| PATCH  | `/api/tasks/reorder/bulk` | Bulk reorder after drag  |
| DELETE | `/api/tasks/:id`          | Delete a task            |
| GET    | `/api/columns`            | Get columns (auto-seeds) |
| GET    | `/api/health`             | Health check             |

---

## Build for Production

```bash
cd client
npm run build
# Output in client/dist/
```

---

## Environment Variables

| Variable    | Description                        |
|-------------|------------------------------------|
| `MONGO_URI` | MongoDB Atlas connection string    |
| `PORT`      | Server port (default: 5000)        |
