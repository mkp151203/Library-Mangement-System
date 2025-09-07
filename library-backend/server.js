import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import userRoutes from './routes/users.js';
import issueRoutes from './routes/issue.js'; // ✅ Import issue/return routes
import dashboardRoutes from './routes/dashboard.js'; // ✅ Import dashboard routes
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/', authRoutes);
app.use('/books', bookRoutes);
app.use('/users', userRoutes);
app.use('/api', issueRoutes); // ✅ Register issue/return route
app.use('/dashboard', dashboardRoutes);
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
