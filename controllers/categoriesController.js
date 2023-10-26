import CategoriesModel from '../models/CategoriesModel.js';

const getCategories = async () => {
  const result = await CategoriesModel.findAll();
  const categories = result.map(post => post.dataValues.Name);
  return categories;
};

export { 
  getCategories
};