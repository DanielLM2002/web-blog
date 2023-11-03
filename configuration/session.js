import dotenv from 'dotenv';
import session from 'express-session';

dotenv.config();

const expressSession = session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
});

export default expressSession;
