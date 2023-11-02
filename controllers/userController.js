import User from '../models/User.js';
import Post from '../models/Post.js';

User.hasMany(Post);

const getUsername = async (id) => {
  const { dataValues } = await User.findByPk(id, {
    attributes: ['Email']
  });
  return dataValues.Email.split('@')[0];
};

const loadLogin = (req, res) => {
  try {
    res.render('Login');
  } catch (exception) {
    console.log(exception);
  }
};

const loadSignup = (req, res) => {
  try {
    res.render('Signup');
  } catch (exception) {
    console.log(exception);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    res.render('Login');
  } catch (exception) {
    console.log(exception);
  }
};

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    res.render('Signup');
  } catch (exception) {
    console.log(exception);
  }
};

export { 
  getUsername, 
  loadLogin, 
  loadSignup, 
  login,
  signup 
};
