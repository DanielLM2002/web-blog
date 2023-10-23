import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const supabase = new Sequelize({
  database: process.env.SUPABASE_DATABASE,
  username: process.env.SUPABASE_USERNAME,
  password: process.env.SUPABASE_PASSWORD,
  host: process.env.SUPABASE_HOST,
  dialect: 'postgres',
  dialectOptions: {}
});

export default supabase;
