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

export { 
  getAllPosts,
  createPost
};
