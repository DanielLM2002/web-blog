import UsersModel from '../models/UsersModel.js';

const getUsername = async (id) => {
  const { dataValues } = await UsersModel.findByPk(id, {
    attributes: ['Email']
  });
  return dataValues.Email.split('@')[0];
};

export { getUsername };
