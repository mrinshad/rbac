# Role-Based Access Control (RBAC) UI

## Project Overview

This is a Role-Based Access Control (RBAC) System that allows administrators to view and manage user roles and permissions.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or later)
- npm (v9 or later)

## Technology Stack

- React
- Next.js
- NextUI
- JSON Server (for mock API)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mrinshad/rbac.git
cd rbac
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup JSON Server

Install JSON Server globally:
```bash
npm install -g json-server
```

### 4. Run the Project

Open two terminal windows:

Terminal 1 - Start JSON Server:
```bash
json-server --watch db.json --port 3001
```

Terminal 2 - Start Next.js Development Server:
```bash
npm run dev
```

### 5. Access the Application

- Frontend: [http://localhost:3000](http://localhost:3000)
- JSON Server API: [http://localhost:3001](http://localhost:3001)

## Configuration

### JSON Server Endpoints

- `/roles`: Retrieve and manage roles
- `/permissions`: Retrieve and manage role permissions
- `/users`: Retrieve and manage user information

## Features

- View roles and their permissions
- Real-time permission updates
- Responsive design
- Mock API integration

## Contact

Mohammed Rinshad P - rinshadmorayur09@gmail.com
