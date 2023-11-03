import dotenv from 'dotenv';
import session from 'express-session';

dotenv.config();

const expressSession = session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
});

export default expressSession;
