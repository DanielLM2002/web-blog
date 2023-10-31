import Category from '../models/Category.js';

const getCategories = async () => {
  const result = await Category.findAll();
  const categories = result.map(post => post.dataValues.Name);
  return categories;
};

export { getCategories };