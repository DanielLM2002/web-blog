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
    where: { Post: id }
  });
  return result;
};

const getComments = async (id) => {
  const result = await CommentsModel.findAll({
    where: { Post: id }
  });
  const comments = result.map(comment => comment.dataValues);
  await Promise.all(comments.map(async (comment) => {
    comment.Username = await getUsername(comment.Author);
  }));
  return comments;
};

const getUsername = async (id) => {
  const result = await UsersModel.findByPk(id, {
    attributes: ['Email']
  });
  return result.dataValues.Email.split('@')[0];
};

const getAuthors = async () => {
  const result = await PostsModel.findAll({
    attributes: ['Author']
  });
  const authorIds = result.map(post => post.dataValues.Author);
  const authors = await Promise.all(authorIds.map(async (Id) => {
    return {
      Id,
      Author: await getUsername(Id)
    }
  }));
  return authors;
};

const getAllPosts = async (req, res) => {
  try {
    const result = await PostsModel.findAll();
    const posts = result.map(post => post.dataValues);
    await Promise.all(posts.map(async (post) => {
      post.Username = await getUsername(post.Author)
      post.Comments = await getPostCommentCount(post.Id)
    }));
    res.render('Home', {
      Posts: posts,
      Categories: await getCategories(),
      Authors: await getAuthors()
    });
  } catch (exception) {
    console.log(exception);
  }
};

const createPost = async (req, res) => {
  try {
    res.render('CreatePost', {
      Categories: await getCategories(),
      Authors: await getAuthors()
    });
  } catch (exception) {
    console.log(exception);
  }
};

const getUserPosts = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const result = await PostsModel.findAll({ where: { Author: id } });
    const posts = result.map(post => post.dataValues);
    await Promise.all(posts.map(async (post) => {
      post.Username = await getUsername(post.Author)
      post.Comments = await getPostCommentCount(post.Id)
    }));
    res.render('UserPosts', {
      Author: await getUsername(id),
      Posts: posts,
      Categories: await getCategories(),
      Authors: await getAuthors()
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
      post.Username = await getUsername(post.Author)
      post.Comments = await getPostCommentCount(post.Id)
    }));
    res.render('CategoryPosts', {
      Posts: posts,
      Category: name,
      Categories: await getCategories(),
      Authors: await getAuthors()
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
    post.Username = await getUsername(post.Author);
    res.render('FullPost', {
      Post: post,
      Comments: await getComments(id),
      Categories: await getCategories(),
      Authors: await getAuthors()
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
