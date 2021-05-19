var Author = require('../models/author');
var Book = require('../models/book');
var async = require('async');
const { body, validationResult } = require('express-validator');

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
exports.author_detail = (req, res, next) => {
  async.parallel(
    {
      author: (callback) => {
        Author.findById(req.params.id).exec(callback);
      },
      authors_books: (callback) => {
        Book.find({ author: req.params.id }, 'title summary').exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.author == null) {
        var err = new Error('Author not found');
        err.status = 404;
        return next(err);
      }
      // successful
      res.render('author_detail', {
        title: 'Author Detail',
        author: results.author,
        author_books: results.authors_books,
      });
    }
  );
};

// display Author create from a GET
exports.author_create_get = (req, res, next) => {
  res.render('author_form', { title: 'Create Author' });
};

// handle author create an POST
exports.author_create_post = (req, res, next) => {
  // validate and sanitize fields
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
    body('family_name')
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage('Family name must be specified.')
      .isAlphanumeric()
      .withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth')
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate();
  body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate();

  //process request after validation and sanitization
  (res, req, next) => {
    // extract the validation error from a request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      //there are errors. render the form again with sanitized values/error messages
      res.render('author_form', {
        title: 'Create Author',
        author: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      //data from form is valid

      //create an author object with escaped and trimmed data
      var author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
      });
      author.save((err) => {
        if (err) {
          return next(err);
        }
        //successful - redirect to new author record.
        res.redirect(author.url);
      });
    }
  };
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
