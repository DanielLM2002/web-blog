import CommentsModel from '../models/CommentsModel.js';
import { v4 as uuidv4 } from 'uuid';

import { getUsername } from './userController.js';

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

const getCommentCount = async (id) => {
  const result = await CommentsModel.count({
    where: { Post: id }
  });
  return result;
};

const postComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const newComment = new CommentsModel({
      Id: uuidv4(),
      Author: 'ffc1a1b0-bfd3-42a7-b9c1-44747616ed5b',
      Post: id,
      Content: content
    });
    await newComment.save();
    res.redirect(`/posts/${id}`);
  } catch (exception) {
    console.log(exception);
  }
};

export {
  getComments,
  getCommentCount, 
  postComment
}
