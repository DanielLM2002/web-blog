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

const getPostCommentCount = async (id) => {
  console.log(id);
  const result = await CommentsModel.count({
    where: {Post: id}
  });
  return result;
};

const getUsername = async (id) => {
  const result = await UsersModel.findByPk(id, {
    attributes: ['Email']
  });
  return result.dataValues.Email.split('@')[0];
};

const getAllPosts = async (req, res) => {
  try {
    const result = await PostsModel.findAll();
    const posts = result.map(post => post.dataValues);
    await Promise.all(posts.map(async (post) => {
      post.Username = await getUsername(post.User)
      post.Comments = await getPostCommentCount(post.Id)
    }));

    res.render('Home', {
      Username: null,
      Posts: posts,
      Category: null,
      Categories: await getCategories()
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

const getUserPosts = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await PostsModel.findAll({ where: { User: id } });
    const posts = result.map(post => post.dataValues);
    await Promise.all(posts.map(async (post) => {
      post.Username = await getUsername(post.User)
      post.Comments = await getPostCommentCount(post.Id)
    }));
    res.render('UserPosts', {
      Username: await getUsername(id),
      Posts: posts,
      Category: null,
      Categories: await getCategories()
    });
  } catch (exception) {
    console.log(exception);
  }
};

const getCategoryPosts = async (req, res) => {
  const { name } = req.params;
  try {
    const result = await PostsModel.findAll({ where: { Category: name } });
    const posts = result.map(post => post.dataValues);
    await Promise.all(posts.map(async (post) => {
      post.Username = await getUsername(post.User)
      post.Comments = await getPostCommentCount(post.Id)
    }));
    res.render('CategoryPosts', {
      Username: null,
      Posts: posts,
      Category: name,
      Categories: await getCategories()
    });
  } catch (exception) {
    console.log(exception);
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await PostsModel.findOne({ where: { Id: id } });
    const post = result.dataValues;
    post.Username = await getUsername(post.User);
    console.log(post);
    res.render('FullPost', {
      Post: post,
      Comments: null,
      Categories: await getCategories()
    });
  } catch(exception) {
    console.log(exception);
  }
};

export { 
  getAllPosts,
  createPost,
  getUserPosts, 
  getCategoryPosts,
  getPostById
};
