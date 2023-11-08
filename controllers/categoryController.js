import Category from '../models/Category.js';

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

const addCategory = async (req, res) => {
  try {
    const { name } = req.params;
    if (name !== '') {
      if (searchCategory(name)) {
        res.send('error');
      } else {
        const newCategory = new Category({ Name: name });
        await newCategory.save();
        res.send('asdsadas');
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
    res.send('asdsadas');
  } catch (exception) {
    console.log(exception);  
  }
};
 
export { 
  getCategories,
  addCategory,
  deleteCategory 
};