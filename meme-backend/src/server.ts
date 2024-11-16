import express from 'express';
import cors from 'cors';
import "dotenv/config";
import usersRouter from './routes/users';
import { connectDB } from './config/database';

const app = express();
app.use(express.json({ limit: "3mb" }));
app.use(cors());
const port = process.env.PORT || 3003;

// Create user function


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', usersRouter);

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
