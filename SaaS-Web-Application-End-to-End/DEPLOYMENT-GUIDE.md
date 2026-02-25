# 🚀 Deployment Guide - How to Make Your SaaS App Accessible to Everyone

This guide explains how to deploy your SaaS application so that anyone can access it over the internet.

---

## Current Status: Running Locally ✅

Your application is currently running at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

**Issue:** This is only accessible on YOUR computer. To let everyone access it, you need to deploy it to the cloud.

---

## Option 1: Quick & Free - Deploy to Vercel (Recommended for Frontend)

### Prerequisites:
1. Push your code to GitHub
2. Create a free account at [vercel.com](https://vercel.com)

### Steps:

#### Deploy Frontend to Vercel:
```
bash
# 1. Go to Vercel.com and sign up with GitHub
# 2. Click "Add New Project" → Import your GitHub repo
# 3. Configure:
#    - Framework Preset: Next.js
#    - Build Command: npm run build
#    - Output Directory: .next
# 4. Add Environment Variable:
#    NEXT_PUBLIC_API_URL = https://your-backend-url.com/api
# 5. Click Deploy!
```

#### Deploy Backend to Render/Railway (Free Tier):

```
bash
# Option A: Render.com (Free)
# 1. Go to render.com and sign up
# 2. Create "New Web Service"
# 3. Connect your GitHub repo
# 4. Configure:
#    - Build Command: (leave empty)
#    - Start Command: node server.js
# 5. Add Environment Variables:
#    NODE_ENV = production
#    PORT = 5000
#    MONGODB_URI = your-mongodb-atlas-connection-string
#    JWT_SECRET = any-random-secret-key
#    JWT_EXPIRE = 7d
#    FRONTEND_URL = your-vercel-frontend-url
# 6. Deploy!
```

---

## Option 2: Deploy to AWS (Production)

### Part A: Set Up MongoDB Atlas (Free Database)

1. **Create MongoDB Atlas Account:**
   - Go to [.mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Sign up for free account
   - Create free cluster (M0)

2. **Get Connection String:**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

3. **Configure Network Access:**
   - Go to Network Access
   - Add IP: `0.0.0.0/0` (allows all IPs)

### Part B: Deploy Backend to AWS EC2

1. **Launch EC2 Instance:**
   - Go to AWS Console → EC2
   - Launch Instance (t3.micro - Free tier eligible)
   - Choose Ubuntu 20.04 LTS
   - Create key pair (download .pem file)

2. **Connect to EC2:**
   
```
bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
```

3. **Install Node.js:**
   
```
bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
```

4. **Deploy Backend:**
   
```
bash
   # Clone your repo
   cd /home/ubuntu
   git clone your-repo-url
   cd SaaS-Web-Application-End-to-End/backend

   # Install dependencies
   npm install

   # Create environment file
   nano .env
   
```

5. **Configure .env:**
   
```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/saasdb
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRE=7d
   FRONTEND_URL=https://your-cloudfront-url
   
```

6. **Install PM2 (Process Manager):**
   
```
bash
   sudo npm install -g pm2
   pm2 start server.js
   pm2 startup
   
```

7. **Set Up Nginx Reverse Proxy:**
   
```
bash
   sudo apt update
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/default
   
```

   Add this configuration:
   
```
nginx
   server_name your-domain.com;

   location / {
       proxy_pass http://localhost:5000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
   }
   
```

   Then:
   
```
bash
   sudo systemctl restart nginx
   
```

### Part C: Deploy Frontend to AWS S3 + CloudFront

1. **Build the Frontend:**
   
```
bash
   cd frontend
   npm run build
   
```

2. **Create S3 Bucket:**
   - Go to S3 → Create bucket
   - Name: `your-app-name`
   - Uncheck "Block all public access"
   - Enable "Static website hosting"

3. **Upload Files:**
   - Upload all contents from `frontend/out/` or `.next/static/`
   - Set proper permissions for public read

4. **Create CloudFront Distribution:**
   - Create distribution
   - Point to your S3 bucket
   - Get the CloudFront URL

5. **Update API URL:**
   - In your backend .env, set `FRONTEND_URL` to your CloudFront URL
   - In Vercel/frontend, set `NEXT_PUBLIC_API_URL` to your EC2 domain

---

## Quick Start - Deploy Both Frontend & Backend in 10 Minutes

### Use Railway (Easiest for Beginners):

```
bash
# 1. Go to railway.app and sign up

# 2. Deploy Backend:
#    - New Project → Deploy from GitHub repo
#    - Select backend folder
#    - Add environment variables

# 3. Deploy Frontend:
#    - New Project → Deploy from GitHub repo  
#    - Select frontend folder
#    - Add NEXT_PUBLIC_API_URL = your-railway-backend-url/api
```

---

## Environment Variables Required:

### Backend (.env):
```
env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/saasdb
JWT_SECRET=change-this-to-random-string
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-url
```

### Frontend (.env.local):
```
env
NEXT_PUBLIC_API_URL=https://your-backend-url/api
```

---

## Demo Credentials (Use after deployment):

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password123 |
| Manager | manager@example.com | password123 |
| User | user@example.com | password123 |

---

## Troubleshooting:

### CORS Errors:
- Make sure backend has `FRONTEND_URL` set correctly
- Check CORS configuration in server.js

### Database Connection:
- Verify MongoDB Atlas network access allows your IP
- Check connection string is correct

### API Not Working:
- Check if backend is running: `pm2 status`
- Check logs: `pm2 logs`

---

## Summary - Recommended Path for Beginners:

1. **Database:** Use MongoDB Atlas (free)
2. **Backend:** Deploy to Render.com or Railway (free)
3. **Frontend:** Deploy to Vercel (free)

This gives you a production-ready app accessible to everyone at no cost!
