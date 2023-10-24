import { DataTypes } from 'sequelize';
import supabase from '../configuration/supabase.js';

const UsersModel = supabase.define('User', {
  Id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
});

export default UsersModel;
