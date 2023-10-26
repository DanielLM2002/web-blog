import { DataTypes } from 'sequelize';

import UsersModel from './UsersModel.js';
import PostsModel from './PostsModel.js';
import supabase from '../configuration/supabase.js';

const CommentsModel = supabase.define('Comments', {
  Id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  Author: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: UsersModel,
      key: 'Id'
    }
  },
  Post: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: PostsModel,
      key: 'Id'
    }
  },
  Content: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
});

export default CommentsModel;
