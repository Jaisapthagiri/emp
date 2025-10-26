# Employee Task Management System (Admin & Employee)

A full-stack Employee Task Management System built using **Node.js, Express, MongoDB, React, and Socket.io**.
The system enables Admins and Employees to collaborate in real time — managing tasks, tracking progress, and chatting instantly.

---

## Live Deployment & API Testing Links

* **Frontend :** [https://employee-task-management-kohl.vercel.app](https://backend-six-pi-28.vercel.app)
* **Backend & API:** [https://employee-task-management-kohl.vercel.app](https://backend-six-pi-28.vercel.app)
* **API Testing Guide (Postman Collection / Documentation):** [Drive Link](https://drive.google.com/file/d/1xUAIZNuBKgzYp6OeYdyE7fmfsJvrl9-T/view?usp=sharing)

---

## Project Overview

This backend API efficiently manages employees and tasks:

* **Admin:** Can create employees, assign tasks, update task statuses, delete employees, and chat with employees in real-time.
* **Employees:** Can login, view their assigned tasks, mark tasks as completed, and chat with the admin.

**Key features in the current implementation:**

* Real-time chat functionality between Admin and Employees using **Socket.io**.
* Fully tested with **Postman** for CRUD operations and chat events.

---

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* Socket.io
* JWT Authentication
* bcrypt.js

### Frontend

* React (v19)
* React Router DOM (v7)
* Tailwind CSS
* Socket.io Client
* Axios
* Lucide React (icons)
* React Hot Toast (notifications)
* Moment.js (date/time formatting)

---

## Frontend Overview

The frontend is a **React + Tailwind** application with separate dashboards for **Admin** and **Employee** roles.

**Core Features**

### 1. Authentication & Role Management

* JWT-based login for Admins and Employees
* Role-based route protection using React Router
* Persistent sessions via cookies

### 2. Task Management

**Admin:**

* Add new employees
* Assign tasks
* View and manage all tasks
* Track employee progress in real-time

**Employee:**

* View assigned tasks
* Update task status (`pending → in-progress → completed`)
* Receive task updates instantly via sockets

### 3. Real-Time Chat

* One-to-one chat between Admin and Employees
* Role-based chat sidebar:

  * Admin sees all employees
  * Employee sees only the Admin
* Dynamic message bubbles (right for sender, left for receiver)

### 4. Live Sync with Sockets

* Task updates and messages broadcast instantly
* Users appear online/offline in real-time
* No page refresh needed — everything updates live

---

## Setup Instructions

### Backend & Frontend Setup

1. Clone the repository:

```bash
git clone https://github.com/Jaisapthagiri/ETM
```

2. Install dependencies:

```bash
cd client
npm install
```

```bash
cd server
npm install
```

3. Create a `.env` file in the **server** folder with the following variables:

```text
PORT=5000
MONGO_URL=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```

4. Create a `.env` file in the **client** folder with:

```text
VITE_BACKEND_URL=http://localhost:5000
```

5. Run the development servers:

```bash
# Client
npm run dev

# Server
node server.js
# or
nodemon server.js
```

6. The client will run at `http://localhost:5173` and the server at `http://localhost:5000`.

---

## Features

### Admin Capabilities

* Login using seeded admin credentials
* Create new employees
* View employee details by ID or all employees
* Assign tasks to employees
* Update task statuses (admin override)
* Delete employees and their linked accounts
* Real-time chat with employees

### Employee Capabilities

* Login
* View assigned tasks
* Update task status (mark as "completed")
* Real-time chat with Admin

### Security

* Passwords hashed with **bcrypt.js**
* JWT authentication for both Admin and Employees
* Role-based access control for endpoints

---

## Real-Time Chat

* Implemented using **Socket.io**
* Admin can chat with multiple employees simultaneously
* Employees can chat with Admin
* Supports `message`, `seen`, and online/offline tracking

---

## API Endpoints

### Admin Routes

| Method | Endpoint               | Description             | Protected       |
| ------ | ---------------------- | ----------------------- | --------------- |
| POST   | `/login`               | Admin login             | No              |
| POST   | `/employee/create`     | Create a new employee   | Yes, admin only |
| GET    | `/employee`            | Get all employees       | Yes, admin only |
| GET    | `/employee/:id`        | Get employee by ID      | Yes, admin only |
| DELETE | `/employee/:id`        | Delete employee         | Yes, admin only |
| POST   | `/task/assign`         | Assign task to employee | Yes, admin only |
| GET    | `/view-task`           | View all tasks          | Yes, admin only |
| PATCH  | `/task/:taskId/status` | Update task status      | Yes, admin only |

### Employee Routes

| Method | Endpoint         | Description                                      | Protected          |
| ------ | ---------------- | ------------------------------------------------ | ------------------ |
| POST   | `/login`         | Employee login                                   | No                 |
| GET    | `/tasks`         | Get all tasks assigned to the logged-in employee | Yes, employee only |
| PATCH  | `/tasks/:taskId` | Update task status (`in-progress` / `completed`) | Yes, employee only |

### Chat Routes

| Method | Endpoint             | Description                                                            | Protected |
| ------ | -------------------- | ---------------------------------------------------------------------- | --------- |
| GET    | `/users`             | Retrieve users for sidebar (Admins see Employees, Employees see Admin) | Yes       |
| GET    | `/messages/:id`      | Get all messages between the logged-in user and selected user          | Yes       |
| PATCH  | `/messages/seen/:id` | Mark all messages from a specific user as seen                         | Yes       |
| POST   | `/send/:id`          | Send a new message to the selected user                                | Yes       |

---

## Authentication

* **Admin:** Seeded credentials via `seed.js`
* **Employee:** JWT token generated on login
* Add `Authorization: Bearer <token>` in request headers for protected routes

---

## Notes

* All endpoints and chat functionality tested successfully with **Postman**
* Passwords are securely hashed before storage
* MongoDB stores all users, employees, tasks, and chat messages
* Can be extended to include a full frontend UI for full-stack deployment

---

## Deployment

* Server is deployed using **Vercel serverless functions**

---
