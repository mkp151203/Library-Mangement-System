📚 Library Management System
A full-stack Library Management System built with a React frontend, Node.js/Express backend, and an OracleDB database. This project provides an efficient platform for managing library operations, including user authentication, book issuance, and detailed user profile management.

✨ Features
User Authentication: Secure login and registration system for both students and administrators.

User Profiles: View, create, and edit user profiles with details like name, email, department, academic year, join date, and a list of currently issued books.

Book Management: Seamlessly issue books to users and track the history of all issued books.

Responsive UI: A modern and intuitive user interface built with React for a great user experience on any device.

RESTful Backend API: A robust backend powered by Node.js and Express, providing clear and structured routes for interacting with the OracleDB database.

Project Structure
.
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Registration.jsx
│   │   │   └── UserProfile.jsx
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
│
└── backend/
    ├── routes/
    │   ├── auth.js
    │   └── user.js
    ├── db.js        # OracleDB connection logic
    ├── server.js    # Express server setup
    └── package.json

🛠️ Installation & Setup
To get this project up and running locally, follow these steps.

Prerequisites
Node.js and npm installed

Access to an OracleDB instance

1. Clone the Repository
git clone [https://github.com/mkp151203/Library-Mangement-System.git](https://github.com/mkp151203/Library-Mangement-System.git)
cd Library-Mangement-System

2. Backend Setup
The backend requires OracleDB credentials. You'll need to update the connection details in backend/db.js.

// backend/db.js - Update with your credentials
const dbConfig = {
    user: process.env.DB_USER || "your_username",
    password: process.env.DB_PASSWORD || "your_password",
    connectString: process.env.DB_CONNECT_STRING || "localhost/orcl",
};

Now, install dependencies and start the server:

cd backend
npm install
node server.js

The backend server will start on http://localhost:5000.

3. Frontend Setup
In a new terminal, navigate to the frontend directory, install dependencies, and start the React application:

cd frontend
npm install
npm start

The frontend development server will start on http://localhost:3000.

💻 Usage
Ensure both the backend and frontend servers are running.

Open your browser and navigate to http://localhost:3000.

Register a new account or log in with existing credentials.

Once logged in, you can view your profile, see issued books, and admins can manage other user profiles.

🚀 Future Improvements
[ ] Book Search: Implement comprehensive search and filtering for the book catalog.

[ ] Role-Based Access Control (RBAC): Enhance security by adding distinct permissions for admin and student roles.

[ ] Due Date Notifications: Add automated email or in-app notifications for upcoming book return deadlines.

[ ] Inventory Management: Add functionality for librarians to add, update, and delete books from the library collection.

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.
