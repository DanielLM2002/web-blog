import { DataTypes } from 'sequelize';
import { sequelize } from '../configuration/supabase.js';

const User = sequelize.define('User', {
  Id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: true,
    unique: true
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  Admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE, 
    allowNull: true
  },
  updatedAt: {
    type: DataTypes.DATE, 
    allowNull: true
  }
});

export default User;
