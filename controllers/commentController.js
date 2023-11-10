import { v4 as uuidv4 } from 'uuid';

import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { getUsername } from './userController.js';

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

export {
  getCommentCount,
  postComment,
  deleteComment
};
