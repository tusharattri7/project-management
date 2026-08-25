# 🚀 Project Management & Collaboration Platform (Basecampy)

A production-ready full-stack project management and team collaboration web application built using the **MERN** stack (Node.js, Express, MongoDB, React) with Tailwind CSS and Vite.

---

## 🌐 Access & Quick Preview

### Option 1: Live Demo (Hosted)
> **Live Site:** [https://your-deployment-link.vercel.app](https://your-deployment-link.vercel.app) *(Update with your live domain)*

---

### Option 2: Running Locally (For Reviewers & Collaborators)

To run and evaluate this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/tusharattri7/project-management.git](https://github.com/tusharattri7/project-management.git)
   cd project-management

   Run the Backend Server:

```bash: 
cd backend
npm install
```
# Configure your backend/.env (refer to template below)
```
npm run dev
```
Run the Frontend Client (in a second terminal):

```bash
cd frontend
npm install
```
# Configure your frontend/.env (refer to template below)
```
npm run dev
```
Open http://localhost:5173 in your browser.


📌 Features
🔐 Authentication & Security
JWT Authentication: Secure Access & Refresh token rotation stored in httpOnly cookies.

Password Management: Bcrypt password hashing, Forgot Password, and Reset Password workflows via email links.

Email Verification: Account verification tokens for new user registrations.

Route Guards: Dynamic client-side protected and public route restrictions.

📁 Workspaces & Project Management
Workspace Creation: Create, customize, list, and delete project boards.

Project Role-Based Access: Manage team members with Admin and Member permissions.

Member Management: Invite collaborators via email and manage access levels.

📋 Kanban Task Boards & Checklists
Kanban Workflow: Organize tasks across customizable status columns (To Do, In Progress, Done).

Subtasks & Checklists: Granular subtask tracking with completion toggles and real-time status counts.

Assignee Distribution: Assign specific project tasks to active collaborators.

File & Media Attachments: Upload and manage task-related files using Multer storage.

⚙️ Account Management
User Profile: View account details and active role.

Security Settings: In-app current password verification and password update.

🛠️ Tech Stack
Frontend
Core: React 19, Vite

Routing: React Router

Styling: Tailwind CSS

Icons & Notifications: Lucide React, React Hot Toast

HTTP Client: Axios (configured with interceptors for automatic token refresh)

Backend
Runtime & Framework: Node.js, Express.js

Database: MongoDB with Mongoose ODM

Authentication: JSON Web Tokens (JWT), Bcrypt.js, Cookie-Parser

File Uploads: Multer

Email Service: Nodemailer (Mailtrap / SMTP integration)

Validation: Express Validator

FILE STRUCTURE
project-management/
│
├── backend/                         # Express REST API
│   ├── public/                      # Multer static uploads (public/images)
│   ├── src/
│   │   ├── controllers/             # Request handlers (auth, project, task)
│   │   ├── db/                      # MongoDB connection setup
│   │   ├── middlewares/             # Auth, error, and multer middlewares
│   │   ├── models/                  # Mongoose data schemas
│   │   ├── routes/                  # Express API route declarations
│   │   ├── utils/                   # ApiError, ApiResponse, asyncHandler, constants
│   │   ├── app.js                   # Express application configuration
│   │   └── index.js                 # Server entry point
│   ├── .env                         # Backend environment variables
│   └── package.json
│
└── frontend/                        # React SPA (Vite)
    ├── public/                      # Static assets
    ├── src/
    │   ├── api/                     # Axios instance and API service layers
    │   ├── components/              # UI components (Modal, Button, Input, TaskModal)
    │   ├── context/                 # AuthContext & State management
    │   ├── layouts/                 # AppLayout (Sidebar, Navigation)
    │   ├── pages/                   # Application views (Dashboard, ProjectDetails, Auth, Settings)
    │   ├── routes/                  # ProtectedRoute and PublicRoute guards
    │   ├── App.jsx                  # Route registry
    │   ├── index.css                # Tailwind base styles
    │   └── main.jsx                 # React root entry
    ├── .env                         # Frontend environment variables
    ├── index.html
    └── package.json


📝 License
This project is open-source and made by Tushar Attri.
   
