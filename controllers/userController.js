import UsersModel from '../models/UsersModel.js';

const getUsername = async (id) => {
  const result = await UsersModel.findByPk(id, {
    attributes: ['Email']
  });
  return result.dataValues.Email.split('@')[0];
};

export { getUsername };
