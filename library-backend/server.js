// 💡 Load environment variables from .env
import 'dotenv/config'; 

// Import libraries
import express from 'express';
import cors from 'cors';

// Import route modules
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import userRoutes from './routes/users.js';
import issueRoutes from './routes/issue.js';
import dashboardRoutes from './routes/dashboard.js';

// Initialize Express app
const app = express();

// --- Middleware ---
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON bodies

// --- API Routes ---
app.use('/', authRoutes);
app.use('/books', bookRoutes);
app.use('/users', userRoutes);
app.use('/api', issueRoutes);
app.use('/dashboard', dashboardRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend running' });
});

// --- Serve Frontend in Production (optional) ---
// if (process.env.NODE_ENV === 'production') {
//   import path from 'path';
//   import { fileURLToPath } from 'url';
//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);

//   app.use(express.static(path.join(__dirname, '../library-frontend/dist')));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../library-frontend/dist', 'index.html'));
//   });
// }

// --- Server Startup ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
