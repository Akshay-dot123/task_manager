# Issue Tracker System

## Project Overview
A full-stack web application designed to track, manage, and resolve software issues. It allows users to register, create issues, assign them to team members, track their lifecycle, and collaborate via comments.

## Features
- **User Authentication:** Secure registration and login using JWT.
- **Issue Management:** Create, read, update, and delete issues.
- **Assignment & Tracking:** Assign issues to specific users and update status (Open, In Progress, Closed).
- **Collaboration:** Add comments to issues for team discussion.
- **Dashboard:** Visual overview of issue counts by status.

## Architecture & Tech Stack
- **Frontend:** React.js, React Router, Axios, Vite.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas (NoSQL).
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs.

## Setup Instructions (Local Development)

### Prerequisites
- Node.js (v16 or higher)
- A MongoDB Atlas Cluster URI

### Backend Setup
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `backend` root (see Environment Variables below).
4. Start the server: `npm run dev` (Runs on port 5000).

### Frontend Setup
1. Navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `frontend` root (see Environment Variables below).
4. Start the dev server: `npm run dev` (Runs on port 5173).

## Environment Variables

**backend/.env**
```env
PORT=5000
MONGO_URI=mongodb+srv://<Password>:Akshay@cluster0.usgz9.mongodb.net/task_manager
JWT_SECRET=your_super_secret_jwt_key_here