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
      Posts: posts,
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

    console.log(posts);

    res.render('UserPosts', {
      Username: await getUsername(id),
      Posts: posts,
      Categories: await getCategories()
    });
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
