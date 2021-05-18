var BookInstance = require('../models/bookinstance');

// display list of all BookInstance
exports.bookinstance_list = (req, res, next) => {
  BookInstance.find()
    .populate('book')
    .exec((err, list_bookinstances) => {
      if (err) {
        return next(err);
      }
      // successful, so render
      res.render('bookinstance_list', {
        title: 'Book Instance List',
        bookinstance_list: list_bookinstances,
      });
    });
};

// display detail page for a specific BookInstance
exports.bookinstance_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: BookInstance detail: ${req.params.id}`);
};

// display BookInstance create from a GET
exports.bookinstance_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance create GET');
};

// handle BookInstance create an POST
exports.bookinstance_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance create POST');
};

// display BookInstance delete form on GET
exports.bookinstance_delete_get = (req, res) => {
  ress.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// handle BookInstance delete on POST
exports.bookinstance_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// display BookInstance update from GET
exports.bookinstance_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// handle BookInstance update on POST
exports.bookinstance_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance update POST');
};
