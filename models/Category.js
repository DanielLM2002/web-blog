import { DataTypes } from 'sequelize';
import Post from './Post.js';
import { sequelize } from '../configuration/supabase.js';

const Category = sequelize.define('Category', {
  Name: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
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

export default Category;
