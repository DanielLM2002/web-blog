import { v4 as uuidv4 } from 'uuid';

import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

import { getAuthors } from './postController.js';
import { getCategories } from './categoryController.js';

Comment.belongsTo(User);
Comment.belongsTo(Post);

const getCommentCount = async (id) => {
  const result = await Comment.count({
    where: { PostId: id }
  });
  return result;
};

const postComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const { credentials } = req.session; 
    if (content !== '') {
      const newComment = new Comment({
        Id: uuidv4(),
        UserId: credentials.id,
        PostId: id,
        Content: content
      });
      await newComment.save();
    }
    res.redirect(`/posts/${id}`);
  } catch (exception) {
    console.log(exception);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { credentials } = req.session;
    const commentData = await Comment.findByPk(id, { attributes: ['UserId', 'PostId'] });
    if (commentData.dataValues.UserId === credentials.id || credentials.admin) {
      await Comment.destroy({ where: { Id: id } });
    }
    res.redirect(`/posts/${commentData.dataValues.PostId}`);
  } catch (exception) {
    console.log(exception);
  }
};

const loadEditComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { credentials } = req.session;
    const comment = await Comment.findByPk(id);
    res.render('EditComment', {
      Comment: comment.dataValues,
      Categories: await getCategories(),
      Authors: await getAuthors(),
      Credentials: credentials
    });
  } catch (exception) {
    console.log(exception);
  }
};

const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const { credentials } = req.session; 
    const comment = await Comment.findByPk(id);
    if (content !== '') {
      await comment.update({
        Content: content,
        updateAt: Date()
      });
      res.redirect(`/posts/${comment.dataValues.PostId}`);
    } else {
      res.render('EditComment', {
        Comment: comment.dataValues,
        Categories: await getCategories(),
        Authors: await getAuthors(),
        Credentials: credentials,
        Error: true
      })
    }
  } catch (exception) {
    console.log(exception);
  }
};

export {
  getCommentCount,
  postComment,
  deleteComment,
  loadEditComment,
  editComment
};
