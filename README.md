# TaskFlow – Team Task Manager

A production-ready full-stack team task management application built with React, Node.js/Express, MongoDB, and JWT authentication.

---

## 1. Project Folder Structure

```
team-task-manager/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, user management
│   │   ├── projectController.js   # Project CRUD + member management
│   │   └── taskController.js      # Task CRUD + dashboard stats
│   ├── middleware/
│   │   ├── auth.js                # JWT protect, adminOnly, adminOrSelf
│   │   └── validators.js          # express-validator rules per route
│   ├── models/
│   │   ├── User.js                # Schema + bcrypt pre-save hook
│   │   ├── Project.js             # Schema with member refs
│   │   └── Task.js                # Schema with isOverdue virtual
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/
│   │   ├── errorHandler.js        # AppError class + global error middleware
│   │   └── tokenUtils.js          # generateToken, sendTokenResponse
│   ├── .env                       # Environment variables (git-ignored)
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   ├── seed.js                    # Demo data seeder
│   └── server.js                  # Express app entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Layout.js      # App shell (sidebar + <Outlet />)
│   │   │       ├── Layout.css
│   │   │       └── Sidebar.js     # Navigation, user info, logout
│   │   ├── context/
│   │   │   └── AuthContext.js     # Global auth state (login/logout/register)
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── DashboardPage.js   # Stats, progress, recent/overdue tasks
│   │   │   ├── ProjectsPage.js    # Project list + create/edit/delete modal
│   │   │   ├── ProjectDetailPage.js # Kanban board view per project
│   │   │   ├── TasksPage.js       # Filterable task table + CRUD modal
│   │   │   ├── UsersPage.js       # Admin-only user & role management
│   │   │   └── AuthPages.css
│   │   ├── services/
│   │   │   └── api.js             # Axios instance + all API call functions
│   │   ├── App.js                 # Router, route guards (Private/Admin/Public)
│   │   ├── index.js
│   │   └── index.css              # Global design system (CSS variables, utils)
│   ├── .env
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 2. Tech Stack

| Layer        | Technology                                |
|-------------|-------------------------------------------|
| Frontend    | React 18, React Router v6, Axios          |
| Styling     | Pure CSS with custom design system (dark) |
| Backend     | Node.js, Express 4                        |
| Database    | MongoDB 7 via Mongoose 8                  |
| Auth        | JSON Web Tokens (JWT) + bcryptjs          |
| Validation  | express-validator                         |
| Dev tooling | nodemon, morgan                           |
| Deployment  | Docker + docker-compose                   |

---

## 3. API Routes Reference

### Auth  (`/api/auth`)

| Method | Endpoint               | Access       | Description              |
|--------|------------------------|--------------|--------------------------|
| POST   | `/auth/register`       | Public       | Register new user        |
| POST   | `/auth/login`          | Public       | Login, receive JWT       |
| GET    | `/auth/me`             | Private      | Get current user profile |
| GET    | `/auth/users`          | Admin only   | List all users           |
| PUT    | `/auth/users/:id/role` | Admin only   | Update a user's role     |

### Projects  (`/api/projects`)

| Method | Endpoint                         | Access       | Description                     |
|--------|----------------------------------|--------------|---------------------------------|
| GET    | `/projects`                      | Private      | List projects (role-scoped)     |
| POST   | `/projects`                      | Admin only   | Create new project              |
| GET    | `/projects/:id`                  | Private      | Get single project              |
| PUT    | `/projects/:id`                  | Admin only   | Update project                  |
| DELETE | `/projects/:id`                  | Admin only   | Delete project + its tasks      |
| POST   | `/projects/:id/members`          | Admin only   | Add member to project           |
| DELETE | `/projects/:id/members/:userId`  | Admin only   | Remove member from project      |

### Tasks  (`/api/tasks`)

| Method | Endpoint       | Access     | Description                            |
|--------|----------------|------------|----------------------------------------|
| GET    | `/tasks/stats` | Private    | Dashboard stats + recent/overdue lists |
| GET    | `/tasks`       | Private    | List tasks (filterable, role-scoped)   |
| POST   | `/tasks`       | Private    | Create task                            |
| GET    | `/tasks/:id`   | Private    | Get single task                        |
| PUT    | `/tasks/:id`   | Private    | Update task (project member)           |
| DELETE | `/tasks/:id`   | Private    | Delete task (creator or admin)         |

#### GET `/tasks` Query Parameters

| Param      | Values                      | Description              |
|------------|-----------------------------|--------------------------|
| `project`  | MongoDB ObjectId            | Filter by project        |
| `status`   | `todo` `in-progress` `done` | Filter by status         |
| `priority` | `low` `medium` `high`       | Filter by priority       |
| `assignedTo` | MongoDB ObjectId          | Filter by assigned user  |
| `overdue`  | `true`                      | Only overdue tasks       |

---

## 4. Data Models

### User
```js
{ name, email, password (hashed), role: ['admin'|'member'] }
```

### Project
```js
{ name, description, color, status: ['active'|'completed'|'archived'],
  createdBy: User, members: [User] }
```

### Task
```js
{ title, description, status: ['todo'|'in-progress'|'done'],
  priority: ['low'|'medium'|'high'], deadline: Date,
  project: Project, assignedTo: User, createdBy: User }
// virtual: isOverdue (bool)
```

---

## 5. Role-Based Access Control

| Feature                       | Member | Admin |
|-------------------------------|--------|-------|
| View own projects & tasks     | ✅     | ✅    |
| Create / update / delete tasks | ✅ (in project) | ✅ |
| Create projects               | ❌     | ✅    |
| Edit / delete projects        | ❌     | ✅    |
| Manage project members        | ❌     | ✅    |
| View all users                | ❌     | ✅    |
| Change user roles             | ❌     | ✅    |
| See all projects & tasks      | ❌     | ✅    |

---

## 6. Setup Instructions

### Option A – Local Development (Recommended)

#### Prerequisites
- **Node.js** ≥ 18  →  https://nodejs.org
- **MongoDB** ≥ 6   →  https://www.mongodb.com/try/download/community  
  _Or use MongoDB Atlas (free cloud cluster)_

---

#### Step 1 – Clone / extract the project

```bash
cd team-task-manager
```

---

#### Step 2 – Backend setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Open .env and set MONGO_URI if using Atlas, or leave default for local MongoDB
```

Your `.env` should look like:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

```bash
# Start the backend (development mode with auto-reload)
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000 in development mode
```

---

#### Step 3 – Seed demo data (optional but recommended)

```bash
# In the backend directory
node seed.js
```

Output:
```
✅ MongoDB connected
👤 Created 5 users
📁 Created 4 projects
✅ Created 19 tasks

─────────────────────────────────────────
🎉  Database seeded successfully!

Demo credentials:
  Admin  → admin@demo.com  / admin123
  Member → bob@demo.com    / member123
  Member → carol@demo.com  / member123
─────────────────────────────────────────
```

To wipe all data:
```bash
node seed.js --destroy
```

---

#### Step 4 – Frontend setup

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start the React dev server
npm start
```

The app opens at **http://localhost:3000**

---

### Option B – Docker (one command)

#### Prerequisites
- Docker Desktop → https://www.docker.com/products/docker-desktop/

```bash
# From project root
docker-compose up --build
```

Services:
- Frontend → http://localhost:3000
- Backend  → http://localhost:5000
- MongoDB  → localhost:27017

To seed inside Docker:
```bash
docker exec taskflow-backend node seed.js
```

To stop:
```bash
docker-compose down          # stop
docker-compose down -v       # stop + delete volumes (wipes DB)
```

---

## 7. Environment Variables

### Backend (`backend/.env`)

| Variable     | Default                                        | Description              |
|-------------|------------------------------------------------|--------------------------|
| `PORT`       | `5000`                                         | Express server port      |
| `MONGO_URI`  | `mongodb://localhost:27017/team-task-manager`  | MongoDB connection string |
| `JWT_SECRET` | *(set a long random string)*                   | JWT signing secret       |
| `JWT_EXPIRE` | `7d`                                           | Token expiry duration    |
| `NODE_ENV`   | `development`                                  | Enables morgan logging   |
| `CLIENT_URL` | `http://localhost:3000`                        | CORS allowed origin      |

### Frontend (`frontend/.env`)

| Variable             | Default                        | Description        |
|---------------------|--------------------------------|--------------------|
| `REACT_APP_API_URL` | `http://localhost:5000/api`    | Backend base URL   |

---

## 8. Key Features Summary

- **JWT Authentication** – stateless, stored in `localStorage`, auto-attached via Axios interceptor; invalid/expired tokens redirect to login.
- **Role-Based Access** – `protect` middleware on all private routes; `adminOnly` middleware on admin routes; frontend route guards (`<AdminRoute>`).
- **Dashboard** – live stats (total, by-status, overdue, assigned-to-me), completion progress bar, recent tasks, overdue task list.
- **Projects** – create with colour picker and member selector; kanban board view per project with drag-free status advancement.
- **Tasks** – filterable table (project, status, priority, keyword search); inline status dropdown; create/edit modal with full fields.
- **Users** – admin sees all users with inline role dropdown; members see only their own projects and tasks.
- **Error Handling** – global `errorHandler` middleware normalises Mongoose, JWT, and operational errors into consistent JSON responses.
- **Validation** – `express-validator` on all POST/PUT routes; client-side form validation before API calls.

---

## 9. Production Checklist

Before deploying to production:

- [ ] Set a strong, random `JWT_SECRET` (32+ chars)
- [ ] Use a hosted MongoDB (Atlas, Railway, etc.)
- [ ] Set `NODE_ENV=production` (disables morgan, hides stack traces)
- [ ] Set `CLIENT_URL` to your actual frontend domain
- [ ] Set `REACT_APP_API_URL` to your actual backend URL
- [ ] Enable HTTPS (SSL/TLS) via a reverse proxy (Nginx, Caddy)
- [ ] Add rate limiting (already included via `express-rate-limit` in API integration example)
- [ ] Rotate JWT secret periodically

---

## 10. Scripts

### Backend
| Command            | Description                        |
|--------------------|------------------------------------|
| `npm run dev`      | Start with nodemon (auto-reload)   |
| `npm start`        | Start production server            |
| `node seed.js`     | Seed demo data                     |
| `node seed.js --destroy` | Wipe all data               |

### Frontend
| Command          | Description                          |
|------------------|--------------------------------------|
| `npm start`      | Start development server (port 3000) |
| `npm run build`  | Create optimised production build    |
| `npm test`       | Run tests                            |
