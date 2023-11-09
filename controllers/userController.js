import User from '../models/User.js';
import Post from '../models/Post.js';
import { getCategories } from './categoryController.js';
import { supabaseClient } from '../configuration/supabase.js';

User.hasMany(Post);

const getUsername = async (id) => {
  try {
    const { dataValues } = await User.findByPk(id, {
      attributes: ['Email']
    });
    return dataValues.Email.split('@')[0];
  } catch (exception) {
    console.log(exception);
  }
};

const getUsers = async () => {
  try {
    const result = await User.findAll();
    const users = result.map(user => user.dataValues);
    return users;
  } catch (exception) {
    console.log(exception);
  }
};

const isUserAdmin = async (id) => {
  try {
    const { dataValues } = await User.findByPk(id, {
      attributes: ['Admin']
    })
    return dataValues.Admin;
  } catch (exception) {
    console.log(exception);
  }
};

const loadAdmin = async (req, res) => {
  const { credentials } = req.session;
  try {
    res.render('Admin', {
      Users: await getUsers(),
      Categories: await getCategories(),
      Credentials: credentials
    });
  } catch (exception) {
    console.log(exception);
  }
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
    const { data: { user, session }, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      res.render('Login', { Error: true });
    } else {
      req.session.credentials  = {
        id: user.id,
        admin: await isUserAdmin(user.id),
        email: user.email,
        aud: user.aud,
        token: session.access_token
      };
      res.redirect('/');
    }
  } catch (exception) {
    console.log(exception);
  }
};

const logout = async (req, res) => {
  try {
    delete req.session.credentials;
    res.redirect('/');
  } catch (exception) {
    console.log(exception);
  }
}; 

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    if (emailRegex.test(email) && password !== '') {
      const { data: { user }, error } = await supabaseClient.auth.signUp({ email, password });
      if (error) {
        console.log(error);
        res.render('Signup', { Error: true });
      } else {
        const newUser = new User({
          Id: user.id,
          Email: user.email,
          Admin: false
        });
        await newUser.save();
        res.render('Signup', { Error: false });
      }
    } else {
      res.render('Signup', { Error: true });
    }
  } catch (exception) {
    console.log(exception);
  }
};

const changeUserRole = async (req, res) => {
  try {
    const { id, role } = req.params;
    const user = await User.findOne({ where: { Id: id } });
    if (role === 'true') {
      user.Admin = false;
    } else {
      user.Admin = true;
    }
    await user.save();
    res.redirect('/Admin');
  } catch (exception) {
    console.log(exception);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { Id: id } });
    await supabaseClient.auth.admin.deleteUser(id);
    res.redirect('/Admin');
  } catch (exception) {
    console.log(exception);
  }
};

export { 
  getUsername, 
  loadAdmin,
  loadLogin, 
  loadSignup, 
  login,
  logout,
  signup,
  changeUserRole,
  deleteUser 
};
