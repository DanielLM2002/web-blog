import { DataTypes } from 'sequelize';

import User from './User.js';
import Category from './Category.js';
import Comment from './Comment.js';
import { sequelize } from '../configuration/supabase.js';

const Post = sequelize.define('Post', {
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
  CategoryName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  Image: {
    type: DataTypes.TEXT,
    allowNull: true
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

Post.belongsTo(User);
Post.hasMany(Comment);
Post.belongsTo(Category);

export default Post;
