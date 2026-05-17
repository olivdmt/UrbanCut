import express from 'express';
import cors from 'cors';

import agendamentos from './routes/agendamentosRoute.js';
import Admin from './routes/adminRoute.js';

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Urbancut online",
  });
});

app.use(cors());
app.use(express.json());

app.use('/agendamentos', agendamentos);
app.use('/admin', Admin);

export default app;