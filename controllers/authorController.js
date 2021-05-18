var Author = require('../models/author');

// display list of all authors
exports.author_list = (req, res, next) => {
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec((err, list_authors) => {
      if (err) {
        return next(err);
      }
      // successful so render
      res.render('author_list', {
        title: 'Author List',
        author_list: list_authors,
      });
    });
};

// display detail page for a specific
exports.author_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Author detail: ${req.params.id}`);
};

// display Author create from a GET
exports.author_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Author create GET');
};

// handle author create an POST
exports.author_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Author create POST');
};

// display Author delete form on GET
exports.author_delete_get = (req, res) => {
  ress.send('NOT IMPLEMENTED: Author delete GET');
};

// handle Author delete on POST
exports.author_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Author delete POST');
};

// display Author update from GET
exports.author_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Author update GET');
};

// handle Author update on POST
exports.author_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Author update POST');
};
