import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Sequelize } from 'sequelize';

import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { getUsername } from './userController.js';
import { getCategories } from './categoryController.js';
import { getCommentCount } from './commentController.js';
import { supabaseClient } from '../configuration/supabase.js';

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

const getPostNumberByCategory = async (category) => {
  try {
    const result = await Post.count({ where: { CategoryName: category } });
    return result;
  } catch (exception) {
    console.log(exception);
  }
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
      Authors: await getAuthors(),
      Credentials: req.session.credentials
    });
  } catch (exception) {
    console.log(exception);
  }
};

const createPost = async (req, res) => {
  try {
    res.render('CreatePost', {
      Categories: await getCategories(),
      Authors: await getAuthors(),
      Credentials: req.session.credentials
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
      Authors: await getAuthors(),
      Credentials: req.session.credentials
    });
  } catch(exception) {
    console.log(exception);
  }
};

const getProfilePosts = async (req, res) => {
  const { id } = req.session.credentials;
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
    res.render('Profile', {
      Author: await getUsername(id),
      Posts: posts,
      Categories: await getCategories(),
      Authors: await getAuthors(),
      Credentials: req.session.credentials
    });
  } catch (exception) {
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
      Authors: await getAuthors(),
      Credentials: req.session.credentials
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
      Authors: await getAuthors(),
      Credentials: req.session.credentials
    });
  } catch (exception) {
    console.log(exception);
  }
};

const post = async (req, res) => {
  try { 
    const {
      title,
      category,
      content,
    } = req.body;

    if (title !== '' || content !== '') {
      const file = req.file;
      const postId = uuidv4();
      const { id } = req.session.credentials;
      console.log(req.session);
      if (file !== undefined) {
        const fileExtension = path.extname(file.path);
        const newFileName = postId + fileExtension;
        const newFilePath = 'public/' + newFileName;
        await fs.promises.rename(file.path, newFilePath);
        const fileData = fs.readFileSync(newFilePath);
        const result = await supabaseClient.storage.from(process.env.SUPABASE_BUCKET).upload(postId, fileData, {
          contentType: file.mymetype
        });
        console.log(result);
      }
      const newPost = new Post({
        Id: postId,
        UserId: id,
        CategoryName: category,
        Title: title,
        Content: content,
        Image: file !== undefined ? postId : null
      });
      await newPost.save();

      if (file !== undefined) {
        const fileExtension = path.extname(file.path);
        const newFileName = 'public/' + postId + fileExtension;
        await fs.promises.unlink(newFileName);
      }

      res.render('CreatePost', {
        Categories: await getCategories(),
        Authors: await getAuthors(),
        Success: true,
        Credentials: req.session.credentials
      });
    } else {
      res.render('CreatePost', {
        Categories: await getCategories(),
        Authors: await getAuthors(),
        Success: false,
        Credentials: req.session.credentials
      });
    }
  } catch (exception) {
    console.log(exception);
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params; 
    const { credentials } = req.session;
    const post = await Post.findByPk(id, { attributes: ['UserId', 'Image'] });
    if (post.dataValues.UserId === credentials.id || credentials.admin) {
      await Post.destroy({ where: { Id: id } });
      if (post.dataValues.Image) {
        await supabaseClient.storage.from(process.env.SUPABASE_BUCKET).remove([post.dataValues.Image])
      }
    }
    res.redirect('/');
  } catch (exception) {
    console.log(exception);
  }
};

const loadEditPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    res.render('EditPost', {
      Post: post.dataValues,
      Categories: await getCategories(),
      Authors: await getAuthors(),
      Credentials: req.session.credentials
    });
  } catch (exception) {
    console.log(exception);
  }
};

const editPost = async (req, res) => {
  try {
    const { id } = req.params; 
    const { credentials } = req.session;
    const {
      title,
      category,
      content
    } = req.body;
    const post = await Post.findByPk(id);
    if (post.dataValues.UserId === credentials.id || credentials.admin) {
      if (title !== '' && category !== '' && content !== '') {
        await post.update({
          Title: title,
          CategoryName: category,
          Content: content,
          updatedAt: Date()
        });
        res.redirect(`/posts/${id}`);
      } else {
        res.render('Editpost', {
          Post: post.dataValues,
          Categories: await getCategories(),
          Authors: await getAuthors(),
          Credentials: req.session.credentials,
          Error: true
        });
      }
    } else {
      res.redirect('/');
    }
  } catch (exception) {
    console.log(exception);
  }
};

export { 
  getAllPosts, 
  getAuthors,
  getProfilePosts,
  getPostNumberByCategory,
  createPost,
  loadEditPost,
  getPostById,
  getPostsByUser,
  getPostsByCategory, 
  post,
  deletePost,
  editPost
};
