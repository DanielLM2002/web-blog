import supabase from '../configuration/supabase.js';
import UsersModel from '../models/UsersModel.js';
import PostsModel from '../models/PostsModel.js';
import CommentsModel from '../models/CommentsModel.js';
import CategoriesModel from '../models/CategoriesModel.js';

const getCategories = async () => {
  const result = await CategoriesModel.findAll();
  const categories = result.map(post => post.dataValues.Name);
  return categories;
};

const getAllPosts = async (req, res) => {
  try {
    const result = await PostsModel.findAll();
    const posts = result.map(post => post.dataValues);
    const userIds = posts.map(post => post.User);
    const userEmails = await UsersModel.findAll({
      where: { Id: userIds },
      attributes: ['Id','Email']
    });
    const userNames = userEmails.map(username => username.dataValues.Email.split('@')[0]);
    posts.map((post, index) => post.Username = userNames[index]);
    
    res.render('Home', {
      Posts: posts,
      categories: await getCategories()
    });
  } catch (exception) {
    console.log(exception);
  }
};

const createPost = (req, res) => {
  try {
    res.render('CreatePost');
  } catch (exception) {
    console.log(exception);
  }
};

const getUserPosts = (req, res) => {
  try {
    res.render('UserPosts');
  } catch (exception) {
    console.log(exception);
  }
};

const getCategoryPosts = (req, res) => {
  try {
    res.render('CategoryPosts');
  } catch (exception) {
    console.log(exception);
  }
};

export { 
  getAllPosts,
  createPost,
  getUserPosts, 
  getCategoryPosts
};
