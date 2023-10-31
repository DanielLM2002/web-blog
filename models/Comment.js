import { DataTypes } from 'sequelize';

import User from './User.js';
import { sequelize } from '../configuration/supabase.js';

const Comment = sequelize.define('Comment', {
  Id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: true,
    unique: true
  },
  UserId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  PostId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  Content: {
    type: DataTypes.TEXT,
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

Comment.belongsTo(User);

export default Comment;
