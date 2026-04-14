# To-Do Dashboard — College Presentation

## Project Overview

A full-stack Kanban task management dashboard built with the MERN stack. Users sign up, log in, create projects, add tasks with priorities, drag them across columns, and receive automatic reminders before deadlines. Every piece of data is scoped per user.

---

## 1. What is the MERN Stack?

| Letter | Technology | Role |
|--------|-----------|------|
| **M** | MongoDB | Database — stores users, tasks, projects, notifications as JSON documents |
| **E** | Express.js | Backend framework — handles HTTP requests, routing, middleware |
| **R** | React | Frontend library — builds the interactive UI |
| **N** | Node.js | JavaScript runtime — runs the server |

One language (JavaScript) across the entire stack.

---

## 2. Architecture

```
Browser (React + Vite)  →  port 5173
        │
        │  HTTP + JWT Bearer token (Axios)
        ▼
Express Server (Node.js)  →  port 5000
        │
        │  Mongoose ODM
        ▼
MongoDB Atlas (Cloud)
```

Vite proxies `/api/*` to Express during development — no CORS issues.

---

## 3. Authentication — JWT

### How it works:
1. User submits email + password to `POST /api/auth/login`
2. Server verifies password with **bcryptjs** (hashed, never stored plain)
3. Server signs a **JSON Web Token** (JWT) with a secret key — valid for 7 days
4. Token is stored in `localStorage` on the client
5. Every subsequent API request includes `Authorization: Bearer <token>`
6. Server middleware (`protect.js`) verifies the token on every protected route
7. If token is invalid/expired → 401 → client redirects to `/login`

```js
// Server: sign token
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Client: attach to every request (Axios interceptor)
api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});
```

### Why JWT over sessions?
- Stateless — server doesn't need to store session data
- Works perfectly with REST APIs
- Easy to implement in MERN

---

## 4. Database Models

### User
```js
{ name, email, password (hashed), teamName, timestamps }
```

### Project
```js
{ name, color, description, userId (ref → User), timestamps }
```

### Task
```js
{
  title, projectId, projectName, userId,
  columnId: 'todo' | 'inprogress' | 'done',
  order,           // position within column
  priority: 'low' | 'medium' | 'high',
  progress,        // 0–100
  dueDate,         // display string "24 Aug 2022"
  dueDateISO,      // actual Date for reminder logic
  reminderSent,    // boolean — prevents duplicate reminders
  comments, attachments, timestamps
}
```

### Notification
```js
{ userId, text, taskId, type: 'reminder'|'info'|'warning', read, timestamps }
```

---

## 5. REST API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, get JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| PATCH | `/api/auth/settings` | ✅ | Update name/password/team |
| GET | `/api/tasks` | ✅ | Get user's tasks (filterable) |
| POST | `/api/tasks` | ✅ | Create task |
| PATCH | `/api/tasks/:id` | ✅ | Update task |
| PATCH | `/api/tasks/reorder/bulk` | ✅ | Bulk reorder after drag |
| DELETE | `/api/tasks/:id` | ✅ | Delete task |
| GET | `/api/projects` | ✅ | Get user's projects |
| POST | `/api/projects` | ✅ | Create project |
| DELETE | `/api/projects/:id` | ✅ | Delete project |
| GET | `/api/notifications` | ✅ | Get notifications |
| PATCH | `/api/notifications/read-all` | ✅ | Mark all read |

---

## 6. Drag and Drop — @dnd-kit

Three key pieces:

**DndContext** — wraps the board, listens for drag events.

**useDroppable** — each column registers as a drop target with ID `todo`, `inprogress`, or `done`.

**useSortable** — each task card is both draggable AND a drop target (enables reordering within a column).

### The drag flow:
```
User grabs card → onDragStart → ghost card appears (DragOverlay)
User moves → onDragOver → column highlights
User drops → onDragEnd → calculate new positions
  → Optimistic UI update (instant feel)
  → PATCH /api/tasks/reorder/bulk (persist to MongoDB)
  → If API fails → rollback + toast error
```

### Cross-column move:
```js
// Remove from source column, insert at target position
const movedTask = { ...task, columnId: newColumn };
newOverItems.splice(insertAt, 0, movedTask);
// Recalculate order index for both columns
const reordered = newOverItems.map((t, i) => ({ ...t, order: i }));
```

---

## 7. Automatic Reminders

A background job runs every 30 minutes on the server:

```js
async function checkReminders() {
  const now  = new Date();
  const in7h = new Date(now.getTime() + 7 * 60 * 60 * 1000);

  // Find tasks due within the next 7 hours, not yet reminded, not done
  const tasks = await Task.find({
    dueDateISO: { $gte: now, $lte: in7h },
    reminderSent: false,
    columnId: { $ne: 'done' },
  });

  for (const task of tasks) {
    await Notification.create({
      userId: task.userId,
      text: `⏰ "${task.title}" is due in less than 7 hours!`,
      type: 'reminder',
    });
    task.reminderSent = true;
    await task.save();
  }
}

setInterval(checkReminders, 30 * 60 * 1000);
```

The frontend polls for new notifications every 2 minutes and shows the unread count badge on the bell icon and sidebar.

---

## 8. Task Priority System

Three priority levels replace the old color system:

| Priority | Color | Use case |
|----------|-------|----------|
| Low | 🟢 `#78d700` | Nice to have |
| Medium | 🟠 `#ffa048` | Normal work |
| High | 🔴 `#ff7979` | Urgent / blocking |

Priority drives the progress bar color, date badge color, and the priority badge on each card. The Dashboard page shows a "High Priority" section with all urgent incomplete tasks.

---

## 9. Project Management

Users can create projects (name + color). When adding a task:
- Select an existing project from dropdown, OR
- Click "+ New" to create a project inline

Tasks store both `projectId` (reference) and `projectName` (denormalized string) for fast display without joins.

---

## 10. Smooth Scrolling — Lenis

```js
const lenis = new Lenis({
  wrapper: boardRef.current,
  orientation: 'horizontal',   // board scrolls sideways
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease-out
  smoothWheel: true,
});

// Must be called every animation frame
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
```

The easing `1.001 - 2^(-10t)` starts fast and decelerates smoothly — feels premium.

---

## 11. Dark Mode

Implemented via CSS custom properties (variables) + a React context:

```css
:root { --bg-card: #ffffff; --text-primary: #1c1d22; }
.dark { --bg-card: #22232d; --text-primary: #f0f0f5; }
```

```js
// ThemeContext.jsx
const toggle = () => {
  setDark(d => !d);
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', dark ? 'light' : 'dark');
};
```

Every component uses `style={{ background: 'var(--bg-card)' }}` — one toggle switches the entire app instantly. Preference is persisted in `localStorage`.

---

## 12. Frontend Routing — React Router v6

```
/login   → AuthPage (login + signup)
/*       → AppShell (protected — redirects to /login if no token)
```

Inside AppShell, navigation is state-based (no URL change for sidebar pages) — simpler for a single-workspace app.

---

## 13. Sidebar Pages

| Page | What it shows |
|------|--------------|
| Dashboard | Stats, overall progress bar, upcoming deadlines, high-priority tasks |
| Board | Kanban board with drag-and-drop |
| Teams | Team name, member list, task distribution |
| Alerts | All notifications with read/unread state |
| Messages | Cross-team conversation threads (UI preview) |
| Settings | Edit name, team name, change password, dark mode toggle, logout |

---

## 14. Search

The search bar in the header filters tasks in real-time on the client side — no extra API call needed. It matches against task title and project name:

```js
const filtered = tasks.filter(t =>
  t.title.toLowerCase().includes(query.toLowerCase()) ||
  t.projectName.toLowerCase().includes(query.toLowerCase())
);
```

---

## 15. Key Technical Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Auth | JWT + bcryptjs | Stateless, standard, easy to demo |
| Build tool | Vite | Fastest dev server, CRA is deprecated |
| CSS | Tailwind v4 + CSS variables | Utility-first + theme switching |
| Drag & Drop | @dnd-kit | Accessible, React 18 compatible |
| Smooth scroll | Lenis | Lightweight, customizable easing |
| State | useState + custom hooks | No Redux needed at this scale |
| DB | MongoDB Atlas | Free tier, no local setup |
| Reminders | Server-side cron job | Reliable, works even if browser is closed |
| Optimistic UI | Yes | Instant feel, rollback on error |

---

## 16. How to Run

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev

# Open http://localhost:5173
# Sign up → create projects → add tasks → drag them around
```

---

## 17. What I Learned

- Full-stack JavaScript architecture end-to-end
- JWT authentication flow (hashing, signing, verifying)
- MongoDB document modeling and Mongoose ODM
- REST API design with protected routes
- React Router for client-side navigation
- Drag-and-drop mechanics (sensors, collision detection, optimistic updates)
- CSS custom properties for instant theme switching
- Background jobs for automated notifications
- Lenis smooth scrolling with custom easing curves
- Figma-to-code workflow using the Figma MCP server
