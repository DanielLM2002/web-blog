const example = (req, res) => {
  try {
    res.render('example');
  } catch (exception) {
    console.log(exception);
  }
};

export { example };
