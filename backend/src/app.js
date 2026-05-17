import express from 'express';
import cors from 'cors';

import agendamentos from './models/agendamentos.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/agendamentos', agendamentos);

export default app;