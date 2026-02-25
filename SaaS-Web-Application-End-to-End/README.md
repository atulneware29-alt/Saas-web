# SaaS Web Application - End-to-End

A full-stack SaaS application built with modern technologies including user authentication, role-based access control, CRUD operations, dashboard analytics, and production deployment on AWS.

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (React)
- **Styling:** Custom CSS with CSS Variables
- **Charts:** Recharts for analytics visualization
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

## 📋 Features

### Authentication System
- User registration with email and password
- Secure login with JWT tokens
- Password hashing with bcrypt
- Session management with httpOnly cookies
- Role-based login credentials

### Role-Based Access Control (RBAC)
- **Admin:** Full access to all features
- **Manager:** Can manage team members and projects
- **User:** Basic access to assigned projects/tasks only

### CRUD Operations
- **Projects:** Create, Read, Update, Delete projects
- **Tasks:** Full task management with Kanban-style board
- **Users:** User management (Admin only)

### Dashboard & Analytics
- Real-time statistics overview
- Interactive charts (Pie, Bar, Line)
- Task status distribution
- Priority breakdown
- Completion trends

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```
bash
cd SaaS-Web-Application-End-to-End
```

2. **Install Backend Dependencies**
```
bash
cd backend
npm install
```

3. **Configure Environment Variables**
```
bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

4. **Install Frontend Dependencies**
```
bash
cd frontend
npm install
```

### Running the Application

**Development Mode:**

Terminal 1 - Backend:
```
bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```
bash
cd frontend
npm run dev
```

Access the application at: `http://localhost:3000`

### Demo Credentials
```
Admin:    admin@example.com / password123
Manager:  manager@example.com / password123
User:     user@example.com / password123
```

---

## 📁 Project Structure

```
SaaS-Web-Application-End-to-End/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & role middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── validations/     # Input validation
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js pages
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context
│   │   ├── services/    # API services
│   │   └── styles/      # CSS styles
│   └── package.json
├── aws/                 # AWS deployment configs
├── SPEC.md             # Detailed specification
└── README.md
```

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - List users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Analytics
- `GET /api/analytics/overview` - Dashboard stats
- `GET /api/analytics/charts` - Chart data

---

## ☁️ AWS Deployment

### Backend (EC2)
1. Launch EC2 instance
2. Install Node.js and nginx
3. Clone repository and install dependencies
4. Configure environment variables
5. Set up PM2 for process management
6. Configure nginx reverse proxy

### Frontend (S3 + CloudFront)
1. Build Next.js app: `npm run build`
2. Upload static files to S3
3. Configure S3 for static website hosting
4. Set up CloudFront distribution
5. Configure custom domain (optional)

### Database
- Use MongoDB Atlas for managed MongoDB
- Configure network access for EC2 IP

---

## 📄 License

ISC License

---

## 👤 Author

Your Name Here
