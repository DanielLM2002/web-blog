import Category from '../models/Category.js';
import { getUsers } from './userController.js';
import { getPostNumberByCategory } from './postController.js';

const getCategories = async () => {
  try {
    const result = await Category.findAll();
    const categories = result.map(post => post.dataValues.Name);
    return categories;
  } catch (exception) {
    console.log(exception);
  }
};

const searchCategory = async (name) => {
  try {
    const result = await Category.findOne({
      where: { Name: name }
    });
    return result;
  } catch (exception) {
    console.log(exception);
  }
};

const getCategoriesWithPostsNumber = async () => {
  try {
    const categories = await getCategories();
    const result = Promise.all(categories.map(async (category) => { 
      return {
        name: category,
        postsNumber: await getPostNumberByCategory(category)
      } 
    }));
    return result;
  } catch (exception) {
    console.log(exception);
  }
};

const addCategory = async (req, res) => {
  try {
    const { category } = req.body;
    if (category !== '') {
      if (await searchCategory(category)) {
        res.render('Admin', { 
          Users: await getUsers(),
          Categories: await getCategoriesWithPostsNumber(),
          Error: true 
        });
      } else {
        const newCategory = new Category({ Name: category });
        await newCategory.save();
        res.redirect('/admin');
      }
    }
  } catch (exception) {
    console.log(exception);  
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { name } = req.params;
    await Category.destroy({ where: { Name: name } });
    res.redirect('/admin');
  } catch (exception) {
    console.log(exception);  
  }
};
 
export { 
  getCategories,
  addCategory,
  deleteCategory,
  getCategoriesWithPostsNumber 
};