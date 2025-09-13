# 📚 Library Management System

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Oracle](https://img.shields.io/badge/Oracle-F80000?style=for-the-badge&logo=oracle&logoColor=white)

A full-stack Library Management System built with a React frontend, Node.js/Express backend, and an OracleDB database. This project provides an efficient platform for managing core library operations, including user authentication, book issuance, and detailed user profile management.

## 🚀 Demo

[![Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-blue?style=for-the-badge&logo=vercel)](https://library-mangement-system-mehul.vercel.app/)

## ✨ Features

- **User Authentication:** Secure login and registration system for both students and administrators.
- **User Profiles:** View, create, and edit user profiles with details like name, email, department, academic year, join date, and a list of currently issued books.
- **Book Management:** Seamlessly issue books to users and track the history of all issued books.
- **Responsive UI:** A modern and intuitive user interface built with React for a great user experience on any device.
- **RESTful Backend API:** A robust backend powered by Node.js and Express, providing clear and structured routes for interacting with the OracleDB database.
- **JWT-based authentication** for secure session management and protected routes, ensuring a reliable and scalable backend.

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

## 💾 Database Schema

The application uses four main tables in the Oracle database.

(version - Oracle Database 11g Express Edition Release 11.2.0.2.0 - 64bit Production)

### 1. `USERS`
Stores user credentials for authentication.

| Column   | Type          | Constraints |
|----------|---------------|-------------|
| ID       | NUMBER        | NOT NULL    |
| USERNAME | VARCHAR2(50)  | NOT NULL    |
| PASSWORD | VARCHAR2(255) | NOT NULL    |
| ROLE     | VARCHAR2(20)  | NOT NULL    |

### 2. `BOOKS`
Contains the library's book collection.

| Column        | Type           | Constraints |
|---------------|----------------|-------------|
| ID            | NUMBER         | NOT NULL    |
| TITLE         | VARCHAR2(255)  | NOT NULL    |
| AUTHOR        | VARCHAR2(255)  | NOT NULL    |
| GENRE         | VARCHAR2(100)  |             |
| PUBLISHEDYEAR | NUMBER         |             |
| AVAILABLE     | CHAR(1)        |             |
| COVER         | VARCHAR2(1000) |             |

### 3. `USER_PROFILES`
Stores detailed information about each user.

| Column       | Type           | Constraints |
|--------------|----------------|-------------|
| USER_ID      | NUMBER         | NOT NULL    |
| NAME         | VARCHAR2(100)  |             |
| EMAIL        | VARCHAR2(100)  |             |
| ROLE         | VARCHAR2(20)   |             |
| DEPARTMENT   | VARCHAR2(100)  |             |
| YEAR         | VARCHAR2(50)   |             |
| JOIN_DATE    | DATE           |             |
| BOOKS_ISSUED | NUMBER         |             |
| AVATAR       | VARCHAR2(1000) |             |

### 4. `ISSUED_BOOKS`
Tracks books that are currently issued to users.

| Column     | Type    | Constraints |
|------------|---------|-------------|
| ID         | NUMBER  | NOT NULL    |
| BOOK_ID    | NUMBER  | NOT NULL    |
| USER_ID    | NUMBER  | NOT NULL    |
| ISSUE_DATE | DATE    |             |
| DUE_DATE   | DATE    |             |
| RETURNED   | CHAR(1) |             |


## 🛠️ Installation & Setup

To get this project up and running locally, please follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (which includes npm)
- Access to an OracleDB instance and its connection details.
- You need to install oracle database and set up the tables proplerly according to the given structure above.

### 1. Clone the Repository

First, clone the project to your local machine.

```bash
git clone [https://github.com/mkp151203/Library-Mangement-System.git](https://github.com/mkp151203/Library-Mangement-System.git)
cd Library-Mangement-System
```

### 2. Backend Setup

run these queries to create your database

```sql
-- ===============================
-- USERS TABLE
-- ===============================
CREATE TABLE USERS (
    ID NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    USERNAME VARCHAR2(50) NOT NULL UNIQUE,
    PASSWORD VARCHAR2(255) NOT NULL,
    ROLE VARCHAR2(20) NOT NULL
);

-- ===============================
-- BOOKS TABLE
-- ===============================
CREATE TABLE BOOKS (
    ID NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    TITLE VARCHAR2(255) NOT NULL,
    AUTHOR VARCHAR2(255) NOT NULL,
    GENRE VARCHAR2(100),
    PUBLISHEDYEAR NUMBER(4,0),
    AVAILABLE CHAR(1) DEFAULT 'Y' CHECK (AVAILABLE IN ('Y', 'N')) NOT NULL,
    COVER VARCHAR2(1000)
);

-- ===============================
-- USER_PROFILES TABLE
-- ===============================
CREATE TABLE USER_PROFILES (
    USER_ID NUMBER PRIMARY KEY,
    NAME VARCHAR2(100) NOT NULL,
    EMAIL VARCHAR2(100) NOT NULL,
    ROLE VARCHAR2(20),
    DEPARTMENT VARCHAR2(100),
    YEAR VARCHAR2(50),
    JOIN_DATE DATE DEFAULT SYSDATE,
    BOOKS_ISSUED NUMBER DEFAULT 0,
    AVATAR VARCHAR2(1000),
    CONSTRAINT FK_USER_PROFILES_USERS FOREIGN KEY (USER_ID)
        REFERENCES USERS(ID) ON DELETE CASCADE
);

-- ===============================
-- ISSUED_BOOKS TABLE
-- ===============================
CREATE TABLE ISSUED_BOOKS (
    ID NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    BOOK_ID NUMBER NOT NULL,
    USER_ID NUMBER NOT NULL,
    ISSUE_DATE DATE DEFAULT SYSDATE NOT NULL,
    DUE_DATE DATE NOT NULL,
    RETURNED CHAR(1) DEFAULT 'N' CHECK (RETURNED IN ('Y', 'N')) NOT NULL,
    CONSTRAINT FK_ISSUED_BOOK_ID FOREIGN KEY (BOOK_ID)
        REFERENCES BOOKS(ID),
    CONSTRAINT FK_ISSUED_USER_ID FOREIGN KEY (USER_ID)
        REFERENCES USER_PROFILES(USER_ID)
);

CREATE SEQUENCE ISSUE_SEQ START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE USER_SEQ START WITH 1 INCREMENT BY 1;

};
```

The backend requires your OracleDB credentials. You will need to update the connection details in `library-backend/db.js`.

```javascript
// backend/db.js - Update with your credentials
const dbConfig = {
    user: process.env.DB_USER || "your_username",
    password: process.env.DB_PASSWORD || "your_password",
    connectString: process.env.DB_CONNECT_STRING || "localhost/orcl",
};
```

or you can use .env file in `library-backend/.env`.

```.env
DB_USER=username
DB_PASSWORD=password
DB_CONNECT_STRING=your connect string 
TNS_ADMIN=wallet location(if using autonomous database)
WALLET_PASSWORD=WalletPassword
JWT_SECRET=486789bd67d1638a46f7df9ad56297e (generate online)
```

The Frontend requires VITE_API_URL . You will need to update the connection details in `library-frontend/.env`.

```.env
#if running on localhost add ths line
VITE_API_URL=http://localhost:5000

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
npm run dev
```

The frontend development server will launch and be accessible at `http://localhost:5173`.

## 💻 Usage

1. Ensure both the backend and frontend servers are running simultaneously in separate terminals.
2. Open your web browser and navigate to `http://localhost:5173`.
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
