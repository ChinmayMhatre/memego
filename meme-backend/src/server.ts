import express from 'express';
import cors from 'cors';
import "dotenv/config";
import usersRouter from './routes/users';
import pointsRouter from './routes/points';
import { connectDB } from './config/database';
import contractRouter from './routes/contract';

const app = express();
app.use(express.json({ limit: "3mb" }));
app.use(cors());
const port = process.env.PORT || 3003;

// Create user function


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/users', usersRouter);
app.use('/api/points', pointsRouter);
app.use('/api/contract', contractRouter);


// Modified server startup to include database connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
