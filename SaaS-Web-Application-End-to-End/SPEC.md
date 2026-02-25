# SaaS Web Application - End-to-End Project Specification

## 1. Project Overview

**Project Name:** SaaS Web Application (End-to-End)
**Project Type:** Full-stack SaaS Web Application
**Core Functionality:** A complete SaaS product with user authentication, role-based access control, CRUD operations, dashboard analytics, and production deployment on AWS.
**Target Users:** Businesses and teams needing a SaaS solution for managing projects, tasks, and analytics.

---

## 2. Technology Stack

### Frontend
- **Framework:** Next.js 14 (React)
- **Styling:** Custom CSS with CSS Variables
- **Charts:** Recharts for analytics
- **State Management:** React Context API

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs

### Deployment
- **Frontend:** AWS S3 + CloudFront
- **Backend:** AWS EC2
- **Database:** MongoDB Atlas (cloud)

---

## 3. UI/UX Specification

### Color Palette
- **Primary:** `#0f172a` (Dark Navy)
- **Secondary:** `#1e293b` (Slate)
- **Accent:** `#3b82f6` (Bright Blue)
- **Success:** `#10b981` (Emerald)
- **Warning:** `#f59e0b` (Amber)
- **Error:** `#ef4444` (Red)
- **Text Primary:** `#f8fafc` (Off-white)
- **Text Secondary:** `#94a3b8` (Gray)
- **Background:** `#020617` (Near Black)
- **Card Background:** `#0f172a` with `#1e293b` borders

### Typography
- **Primary Font:** "Outfit", sans-serif (Google Fonts)
- **Monospace:** "JetBrains Mono", monospace
- **Headings:** 
  - H1: 2.5rem, weight 700
  - H2: 2rem, weight 600
  - H3: 1.5rem, weight 600
- **Body:** 1rem, weight 400, line-height 1.6

### Layout Structure
- **Sidebar:** Fixed left, 260px width, collapsible on mobile
- **Header:** Fixed top, 64px height, contains user menu and notifications
- **Main Content:** Fluid width with max-width 1400px, padding 24px
- **Cards:** Rounded corners (12px), subtle shadow, border 1px solid #1e293b
- **Responsive Breakpoints:**
  - Mobile: < 768px (sidebar becomes drawer)
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### Visual Effects
- **Transitions:** All interactive elements 0.2s ease
- **Hover States:** Scale 1.02 on cards, color shift on buttons
- **Loading States:** Skeleton loaders with shimmer effect
- **Animations:** Fade-in on page load, slide-in for modals

---

## 4. Feature Specification

### 4.1 Authentication System
- **Register:** Email, password, name, company name
- **Login:** Email/password with JWT
- **Password:** Minimum 8 characters, hashed with bcrypt
- **Session:** JWT stored in httpOnly cookie (7 days)
- **Logout:** Clear JWT, redirect to login

### 4.2 Role-Based Access Control (RBAC)
- **Roles:**
  - `admin`: Full access, can manage users and all data
  - `manager`: Can manage team members and projects
  - `user`: Basic access to assigned projects only
- **Permissions:**
  - Admin: Create, read, update, delete all
  - Manager: Create, read, update own team's data
  - User: Read, update own data only

### 4.3 CRUD Operations
**Projects:**
- Create project (name, description, status, priority)
- Read projects (list with filters, single project detail)
- Update project (all fields)
- Delete project (soft delete)

**Tasks:**
- Create task (title, description, assignedTo, dueDate, priority)
- Read tasks (list with filters, Kanban view)
- Update task (status, assignee, priority)
- Delete task

**Users (Admin only):**
- Create user (invite)
- Read users (list, search)
- Update user (role, status)
- Delete/Deactivate user

### 4.4 Dashboard & Analytics
- **Overview Cards:**
  - Total Projects (count)
  - Active Tasks (count)
  - Completed Tasks (count)
  - Team Members (count)
- **Charts:**
  - Project Status Distribution (Pie Chart)
  - Task Completion Trend (Line Chart - last 7 days)
  - Tasks by Priority (Bar Chart)
  - Team Performance (Horizontal Bar Chart)
- **Recent Activity:** List of recent actions

### 4.5 Validations (Backend)
- **Email:** Valid email format, unique in database
- **Password:** Minimum 8 characters
- **Name:** Required, minimum 2 characters
- **Project Name:** Required, unique
- **Task Title:** Required, minimum 3 characters

---

## 5. API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### User Routes
- `GET /api/users` - List all users (admin/manager)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Project Routes
- `GET /api/projects` - List projects (filtered by role)
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Task Routes
- `GET /api/tasks` - List tasks (filtered by role/project)
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Analytics Routes
- `GET /api/analytics/overview` - Dashboard overview stats
- `GET /api/analytics/charts` - Chart data for dashboard

---

## 6. Database Schema

### User Collection
```
javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  company: String,
  role: Enum ['admin', 'manager', 'user'],
  avatar: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Project Collection
```
javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  status: Enum ['active', 'completed', 'on-hold', 'cancelled'],
  priority: Enum ['low', 'medium', 'high', 'urgent'],
  owner: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Collection
```
javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: Enum ['todo', 'in-progress', 'review', 'completed'],
  priority: Enum ['low', 'medium', 'high', 'urgent'],
  project: ObjectId (ref: Project),
  assignedTo: ObjectId (ref: User),
  dueDate: Date,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 7. Project Structure

```
SaaS-Web-Application-End-to-End/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── roleCheck.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── analytics.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── analyticsController.js
│   ├── validations/
│   │   ├── authValidation.js
│   │   ├── projectValidation.js
│   │   └── taskValidation.js
│   ├── utils/
│   │   └── ApiError.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.js
│   │   │   │   ├── page.js
│   │   │   │   ├── projects/
│   │   │   │   ├── tasks/
│   │   │   │   ├── users/
│   │   │   │   └── analytics/
│   │   │   ├── api/
│   │   │   └── layout.js
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── layout/
│   │   │   └── forms/
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── utils/
│   ├── package.json
│   └── next.config.js
├── aws/
│   └── deployment-config.json
├── .env.example
├── README.md
└── SPEC.md
```

---

## 8. Acceptance Criteria

### Authentication
- [ ] User can register with valid email and password
- [ ] User can login and receive JWT token
- [ ] Invalid credentials show appropriate error
- [ ] Protected routes redirect to login if not authenticated

### Roles & Permissions
- [ ] Admin can access all features
- [ ] Manager can manage team and projects
- [ ] User can only see assigned projects/tasks

### CRUD Operations
- [ ] Projects can be created, viewed, updated, deleted
- [ ] Tasks can be created, viewed, updated, deleted
- [ ] All operations have proper validation
- [ ] Success/error messages display appropriately

### Dashboard
- [ ] Shows correct statistics
- [ ] Charts render with real data
- [ ] Responsive on all screen sizes

### Deployment
- [ ] Backend runs on AWS EC2
- [ ] Frontend hosted on AWS S3 + CloudFront
- [ ] Environment variables properly configured

---

## 9. Environment Variables

```
env
# Backend
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production

# Frontend
NEXT_PUBLIC_API_URL=http://your-ec2-instance:5000/api
