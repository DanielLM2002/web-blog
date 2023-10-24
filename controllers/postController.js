const getAllPosts = (req, res) => {
  try {
    res.render('Home');
  } catch (exception) {
    console.log(exception);
  }
};

const createPost = (req, res) => {
  try {
    res.render('CreatePost');
  } catch (exception) {
    console.log(exception);
  }
};

const getUserPosts = (req, res) => {
  try {
    res.render('UserPosts');
  } catch (exception) {
    console.log(exception);
  }
};

const getCategoryPosts = (req, res) => {
  try {
    res.render('CategoryPosts');
  } catch (exception) {
    console.log(exception);
  }
};

export { 
  getAllPosts,
  createPost,
  getUserPosts, 
  getCategoryPosts
};
