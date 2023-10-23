import { DataTypes } from 'sequelize';
import supabase from '../configuration/supabase.js';

const CategoriesModel = supabase.define('Categories', {
  Name: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  }
});

export default CategoriesModel;
