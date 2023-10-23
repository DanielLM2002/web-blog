import { DataTypes } from 'sequelize';
import supabase from '../configuration/supabase.js';

const Users = supabase.define('Users', {
  Email: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Rol: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

Users.sync();

export default Users;
