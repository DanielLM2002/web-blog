import User from '../models/User.js';
import Post from '../models/Post.js';

User.hasMany(Post);

const getUsername = async (id) => {
  const { dataValues } = await User.findByPk(id, {
    attributes: ['Email']
  });
  return dataValues.Email.split('@')[0];
};

export { getUsername };
