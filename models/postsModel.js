import { DataTypes } from 'sequelize';
import supabase from '../configuration/supabase.js';

const Posts = supabase.define('Posts', {
  Id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Summary: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  Author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Image: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Posts.sync();

export default Posts;