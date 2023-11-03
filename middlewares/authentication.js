
const checkUserAuth = (req, res, next) => {
  const { credentials } = req.session;
  if (credentials) {
    return next();
  } else {
    const error = new Error('Invalid session');
    res.status(403).json({ message: error.message });
  }
};

const checkAdminAuth = (req, res, next) => {
  const { credentials } = req.session;
  if (credentials) {
    const { admin } = credentials;
    if (admin) {
      return next();
    } else {
      const error = new Error('Invalid admin session');
      res.status(403).json({ message: error.message });
    }
  } else {
    const error = new Error('Invalid session');
    res.status(403).json({ message: error.message });
  }
};

export { checkUserAuth, checkAdminAuth };
