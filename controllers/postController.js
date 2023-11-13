import fs from 'fs';
import path from 'path';
import moment from 'moment';
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

const getPages = (posts) => {
  return Math.ceil(posts.length / 5);
};

const getPostNumberByCategory = async (category) => {
  try {
    const result = await Post.count({ where: { CategoryName: category } });
    return result;
  } catch (exception) {
    console.log(exception);
  }
};

const filterPostsByPage = (posts, page) => {
  let subarray = posts.slice(5 * (page - 1));
  if (subarray.length > 5) {
    subarray = subarray.slice(0, 5);
  }
  return subarray;
};

const getAllPosts = async (req, res) => {
  try {
    const { page } = req.params;
    const result = await Post.findAll({
      order: [['createdAt', 'DESC']]
    });
    let posts = result.map(post => post.dataValues);
    const pages = getPages(posts);
    await Promise.all(posts.map(async (post) => {
      post.Username = await getUsername(post.UserId)
      post.CommentCount = await getCommentCount(post.Id)
      post.Date = moment(post.createdAt).format('DD/MM/YYYY')
    }));
    if (page) {
      posts = filterPostsByPage(posts, parseInt(page));
    } else {
      posts = filterPostsByPage(posts, 1)
    }
    res.render('Home', {
      Posts: posts,
      Categories: await getCategories(),
      Authors: await getAuthors(),
      Credentials: req.session.credentials,
      Pages: pages,
      CurrentPage: page ? page : 1
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
    post.Date = moment(post.createdAt).format('DD/MM/YYYY');
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
  const { page } = req.params;
  const { id } = req.session.credentials;
  try {
    const result = await Post.findAll({ 
      where: { UserId: id },
      order: [['createdAt', 'DESC']]
    });
    let posts = result.map(post => post.dataValues);
    const pages = getPages(posts);
    await Promise.all(posts.map(async (post) => {
      post.Username = await getUsername(post.UserId)
      post.CommentCount = await getCommentCount(post.Id)
      post.Date = moment(post.createdAt).format('DD/MM/YYYY')
    }));
    if (page) {
      posts = filterPostsByPage(posts, parseInt(page));
    } else {
      posts = filterPostsByPage(posts, 1)
    }
    res.render('Profile', {
      Author: await getUsername(id),
      Posts: posts,
      Categories: await getCategories(),
      Authors: await getAuthors(),
      Credentials: req.session.credentials,
      Pages: getPages(posts),
      Pages: pages,
      CurrentPage: page ? page : 1
    });
  } catch (exception) {
    console.log(exception);
  }
};

const getPostsByUser = async (req, res) => {
  const { id, page } = req.params;
  try {
    const result = await Post.findAll({ 
      where: { UserId: id },
      order: [['createdAt', 'DESC']]
    });
    let posts = result.map(post => post.dataValues);
    const pages = getPages(posts);
    await Promise.all(posts.map(async (post) => {
      post.Username = await getUsername(post.UserId)
      post.CommentCount = await getCommentCount(post.Id)
      post.Date = moment(post.createdAt).format('DD/MM/YYYY')
    }));
    if (page) {
      posts = filterPostsByPage(posts, parseInt(page));
    } else {
      posts = filterPostsByPage(posts, 1)
    }
    res.render('UserPosts', {
      Author: await getUsername(id),
      AuthorId: id,
      Posts: posts,
      Categories: await getCategories(),
      Authors: await getAuthors(),
      Credentials: req.session.credentials,
      Pages: pages,
      CurrentPage: page ? page : 1
    });
  } catch (exception) {
    console.log(exception);
  }
};

const getPostsByCategory = async (req, res) => {
  const { name, page } = req.params;
  try {
    const result = await Post.findAll({ 
      where: { CategoryName: name },
      order: [['createdAt', 'DESC']] 
    });
    let posts = result.map(post => post.dataValues);
    const pages = getPages(posts);
    await Promise.all(posts.map(async (post) => {
      post.Username = await getUsername(post.UserId)
      post.CommentCount = await getCommentCount(post.Id)
      post.Date = moment(post.createdAt).format('DD/MM/YYYY')
    }));
    if (page) {
      posts = filterPostsByPage(posts, parseInt(page));
    } else {
      posts = filterPostsByPage(posts, 1)
    }
    res.render('CategoryPosts', {
      Posts: posts,
      Category: name,
      Categories: await getCategories(),
      Authors: await getAuthors(),
      Credentials: req.session.credentials,
      Pages: getPages(posts),
      Pages: pages,
      CurrentPage: page ? page : 1
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

    if (title !== '' && content !== '') {
      const file = req.file;
      const postId = uuidv4();
      const { id } = req.session.credentials;
      if (file !== undefined) {
        const fileExtension = path.extname(file.path);
        const newFileName = postId + fileExtension;
        const newFilePath = 'public/' + newFileName;
        await fs.promises.rename(file.path, newFilePath);
        const fileData = fs.readFileSync(newFilePath);
        await supabaseClient.storage.from(process.env.SUPABASE_BUCKET).upload(postId, fileData, {
          contentType: file.mymetype
        });
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
    const file = req.file;
    const post = await Post.findByPk(id);
    if (post.dataValues.UserId === credentials.id || credentials.admin) {
      if (title !== '' && category !== '' && content !== '') {
        await post.update({
          Title: title,
          CategoryName: category,
          Content: content,
          updatedAt: Date()
        });
        if (file !== undefined) {
          if (post.dataValues.Image) {
            await supabaseClient.storage.from(process.env.SUPABASE_BUCKET).remove([post.dataValues.Image]);
          }
          const fileExtension = path.extname(file.path);
          const newFileName = post.dataValues.Id + fileExtension;
          const newFilePath = 'public/' + newFileName;
          await fs.promises.rename(file.path, newFilePath);
          const fileData = fs.readFileSync(newFilePath);
          await supabaseClient.storage.from(process.env.SUPABASE_BUCKET).upload(post.dataValues.Id, fileData, {
            contentType: file.mymetype
          });
          await fs.promises.unlink(newFilePath);
        }
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
