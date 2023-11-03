import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import upload from './configuration/upload.js';
import session from './configuration/session.js';
import { sequelize } from './configuration/supabase.js';

import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

const app = express();
const corsOptions = {};
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

app.use(upload);
app.use(session);
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.set('view engine', 'pug');

sequelize.authenticate();

// Routes
app.use('/', userRoutes);
app.use('/', postRoutes);
app.use('/', commentRoutes);

app.listen(port, host, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
