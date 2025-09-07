# 📚 Library Management System

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Oracle](https://img.shields.io/badge/Oracle-F80000?style=for-the-badge&logo=oracle&logoColor=white)

A full-stack Library Management System built with a React frontend, Node.js/Express backend, and an OracleDB database. This project provides an efficient platform for managing core library operations, including user authentication, book issuance, and detailed user profile management.

## ✨ Features

- **User Authentication:** Secure login and registration system for both students and administrators.
- **User Profiles:** View, create, and edit user profiles with details like name, email, department, academic year, join date, and a list of currently issued books.
- **Book Management:** Seamlessly issue books to users and track the history of all issued books.
- **Responsive UI:** A modern and intuitive user interface built with React for a great user experience on any device.
- **RESTful Backend API:** A robust backend powered by Node.js and Express, providing clear and structured routes for interacting with the OracleDB database.

## 📂 Project Structure

```
.
├── backend/
│   ├── routes/
│   │   ├── auth.js      # Handles login and registration
│   │   └── user.js      # User profile and book-related routes
│   ├── db.js            # OracleDB connection logic
│   ├── server.js        # Express server setup
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx
    │   │   ├── Registration.jsx
    │   │   └── UserProfile.jsx
    │   ├── App.css
    │   ├── App.jsx
    │   └── index.js
    └── package.json
```

## 🛠️ Installation & Setup

To get this project up and running locally, please follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (which includes npm)
- Access to an OracleDB instance and its connection details.

### 1. Clone the Repository

First, clone the project to your local machine.

```bash
git clone [https://github.com/mkp151203/Library-Mangement-System.git](https://github.com/mkp151203/Library-Mangement-System.git)
cd Library-Mangement-System
```

### 2. Backend Setup

The backend requires your OracleDB credentials. You will need to update the connection details in `backend/db.js`.

```javascript
// backend/db.js - Update with your credentials
const dbConfig = {
    user: process.env.DB_USER || "your_username",
    password: process.env.DB_PASSWORD || "your_password",
    connectString: process.env.DB_CONNECT_STRING || "localhost/orcl",
};
```

Next, navigate to the backend directory, install its dependencies, and start the server.

```bash
cd backend
npm install
node server.js
```

The backend server will start and listen on `http://localhost:5000`.

### 3. Frontend Setup

In a **new terminal window**, navigate to the frontend directory, install its dependencies, and start the React application.

```bash
cd frontend
npm install
npm start
```

The frontend development server will launch and be accessible at `http://localhost:3000`.

## 💻 Usage

1. Ensure both the backend and frontend servers are running simultaneously in separate terminals.
2. Open your web browser and navigate to `http://localhost:3000`.
3. Register a new account or log in with existing user credentials.
4. Once logged in, you can view your profile, see your issued books, and (if you have admin rights) manage other user profiles.

## 🚀 Future Improvements

- [ ] **Book Search:** Implement a comprehensive search and filtering system for the library's book catalog.
- [ ] **Role-Based Access Control (RBAC):** Enhance security by adding distinct permissions for `admin` and `student` roles.
- [ ] **Due Date Notifications:** Add automated email or in-app notifications for upcoming book return deadlines.
- [ ] **Inventory Management:** Create a dashboard for librarians to add, update, and remove books from the library's collection.
- [ ] **Fine Calculation:** Automatically calculate and apply fines for overdue books.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
