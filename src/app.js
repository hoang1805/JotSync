import express from 'express';
import route from './routes/routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


route(app);

export default app;