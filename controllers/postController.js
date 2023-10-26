import PostsModel from '../models/PostsModel.js';

import { getUsername } from './userController.js';
import { getCategories } from './categoriesController.js';
import { getComments, getCommentCount } from './commentsController.js';

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
    const result = await PostsModel.findAll({
      order: [['Date', 'DESC']]
    });
    const posts = result.map(post => post.dataValues);
    await Promise.all(posts.map(async (post) => {
      post.Username = await getUsername(post.Author)
      post.Comments = await getCommentCount(post.Id)
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

const getPostsByUser = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const result = await PostsModel.findAll({ 
      where: { Author: id },
      order: [['Date', 'DESC']]
    });
    const posts = result.map(post => post.dataValues);
    await Promise.all(posts.map(async (post) => {
      post.Username = await getUsername(post.Author)
      post.Comments = await getCommentCount(post.Id)
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

const getPostsByCategory = async (req, res) => {
  const { name } = req.params;
  try {
    const result = await PostsModel.findAll({ 
      where: { Category: name },
      order: [['Date', 'DESC']] 
    });
    const posts = result.map(post => post.dataValues);
    await Promise.all(posts.map(async (post) => {
      post.Username = await getUsername(post.Author)
      post.Comments = await getCommentCount(post.Id)
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
  getPostsByUser as getUserPosts, 
  getPostsByCategory as getCategoryPosts,
  getPostById
};
