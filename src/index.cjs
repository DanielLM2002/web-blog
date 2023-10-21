import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';

dotenv.config();
const app = express();
const corsOptions = {};
const allowedDomains = [];
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
  res.render('home');
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
