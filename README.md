# Student Management System

A full-stack web application built with React (Vite) and Node.js (Express) to manage student records.

## Features

- **Add Students**: Register new students with their name, roll number, and department.
- **Search & Filter**: Find students by name or roll number, or filter by department.
- **Delete Records**: Remove student records from the database.
- **Responsive UI**: Built with a clean, modern design.

## Prerequisites

- [Node.js](https://nodejs.org/) installed.
- [MongoDB](https://www.mongodb.com/atlas/database) account and a connection URI.

## Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd Student-Management-System
```

### 2. Setup the Backend
Navigate to the `backend` folder:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder and add your configuration:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```
Start the backend server:
```bash
npm start
```

### 3. Setup the Frontend
Navigate back to the root folder:
```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

## Tech Stack

- **Frontend**: React, Axios, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Styling**: Vanilla CSS (Inline)
