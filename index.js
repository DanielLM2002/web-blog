import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import supabase from './configuration/supabase.js';
import postRoutes from './routes/postRoutes.js';

const app = express();
const corsOptions = {};
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.set('view engine', 'pug');

// Data base connection authentication
supabase.authenticate();

// Routes
app.use('/', postRoutes);

app.listen(port, host, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
