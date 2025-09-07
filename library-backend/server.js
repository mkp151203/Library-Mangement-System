// 💡 IMPORTANT: Load environment variables from a .env file first
// This ensures that variables like your database connection string are available
import 'dotenv/config'; 

// Import necessary libraries
import express from 'express';
import cors from 'cors';

// Import all your route modules
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import userRoutes from './routes/users.js';
import issueRoutes from './routes/issue.js';
import dashboardRoutes from './routes/dashboard.js';

// Initialize the Express application
const app = express();

// --- Middleware ---
// 💡 Enable CORS for all routes, allowing your frontend to make requests
app.use(cors()); 

// 💡 Parse incoming JSON requests, making it easy to access request bodies
app.use(express.json()); 

// --- API Routes ---
// 💡 Register all your imported route modules to their specific paths
app.use('/', authRoutes);
app.use('/books', bookRoutes);
app.use('/users', userRoutes);
app.use('/api', issueRoutes);
app.use('/dashboard', dashboardRoutes);

// --- Server Startup ---
// 💡 Use the PORT from the environment, or default to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
