import { Sequelize } from 'sequelize';
import { createClient } from '@supabase/supabase-js';

const sequelize = new Sequelize({
  database: process.env.SUPABASE_DATABASE,
  username: process.env.SUPABASE_USERNAME,
  password: process.env.SUPABASE_PASSWORD,
  host: process.env.SUPABASE_HOST,
  dialect: 'postgres',
  dialectOptions: {}
});

const supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export { sequelize, supabaseClient };
