import { Sequelize } from 'sequelize';

import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

import { getUsername } from './userController.js';
import { getCategories } from './categoryController.js';
import { getCommentCount } from './commentController.js';

const getAuthors = async () => {
  const result = await User.findAll({
    include: [{ model: Post }],
    where: {
      '$Posts.Id$': { [Sequelize.Op.not]: null }
    },
  });
  const authors = result.map(record => {
    return {
      Id: record.dataValues.Id,
      Username: record.dataValues.Email.split('@')[0]
    }
  });
  return authors;
};

const getAllPosts = async (req, res) => {
  try {
    const result = await Post.findAll({
      order: [['createdAt', 'DESC']]
    });
    const posts = result.map(post => post.dataValues);
    await Promise.all(posts.map(async (post) => {
      post.Username = await getUsername(post.UserId)
      post.CommentCount = await getCommentCount(post.Id)
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

const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Post.findOne({ 
      include: [{ 
        model: Comment,
        order: [['createdAt', 'DESC']] 
      }],
      where: { Id: id } 
    });
    const post = result.dataValues;
    post.Comments = await Promise.all(post.Comments.map(async (comment) => {
      return {
        Id: comment.dataValues.Id,
        UserId: comment.dataValues.UserId,
        Username: await getUsername(comment.dataValues.UserId),
        PostId: comment.dataValues.PostId,
        Content: comment.dataValues.Content,
        createdAt: comment.dataValues.createdAt,
        updatedAt: comment.dataValues.updatedAt
      }
    }));
    post.Username = await getUsername(post.UserId);
    res.render('FullPost', {
      Post: post,
      Categories: await getCategories(),
      Authors: await getAuthors()
    });
  } catch(exception) {
    console.log(exception);
  }
};

const getPostsByUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Post.findAll({ 
      where: { UserId: id },
      order: [['createdAt', 'DESC']]
    });
    const posts = result.map(post => post.dataValues);
    await Promise.all(posts.map(async (post) => {
      post.Username = await getUsername(post.UserId)
      post.CommentCount = await getCommentCount(post.Id)
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
    const result = await Post.findAll({ 
      where: { CategoryName: name },
      order: [['createdAt', 'DESC']] 
    });
    const posts = result.map(post => post.dataValues);
    await Promise.all(posts.map(async (post) => {
      post.Username = await getUsername(post.UserId)
      post.CommentCount = await getCommentCount(post.Id)
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

export { 
  getAllPosts, 
  createPost,
  getPostById,
  getPostsByUser,
  getPostsByCategory
};
