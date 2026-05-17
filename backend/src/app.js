import express from 'express';
import cors from 'cors';

import agendamentos from './routes/agendamentosRoute.js';
import Admin from './routes/adminRoute.js';


const app = express();

app.use(cors({
    origin: [
        'https://urbancut-barber.netlify.app', 
        'http://localhost:5173'             
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Urbancut online",
  });
});
;

app.use('/agendamentos', agendamentos);
app.use('/admin', Admin);

export default app;