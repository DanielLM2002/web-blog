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
    const newComment = new Comment({
      Id: uuidv4(),
      UserId: '841f0b5a-446a-4434-aeb2-9e6466022adb',
      PostId: id,
      Content: content
    });
    await newComment.save();
    res.redirect(`/posts/${id}`);
  } catch (exception) {
    console.log(exception);
  }
};

export {
  getCommentCount,
  postComment
};
