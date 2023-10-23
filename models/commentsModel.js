import { DataTypes } from 'sequelize';
import supabase from '../configuration/supabase.js';

const Comments = supabase.define('Comments', {
  Id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  Post: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  Comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
});

Comments.sync();

export default Comments;
